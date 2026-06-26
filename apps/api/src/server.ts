import { config } from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import helmet from 'helmet';
import setupLocalStrategy from './lib/setup-local-strategy';
import { getUserFromRedis } from './lib/handle-redis-user';
import path from 'path';
import cors from 'cors';
import { JWT_SECRET } from './constant/config';
import { errorHandler } from './middlewares/errorHandler';
import graphqlMiddleware from './graphql';
import { isAuthenticated } from './middlewares/auth';
import routes from './routes';
import { express as useragent } from 'express-useragent';
import { createServer } from 'node:http';
import { initSocket } from './lib/socket';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import handleOauthStrategy from './controllers/passport-social.controller';
import forgotPasswordController from './controllers/auth/forgot-password.controller';
import lusca from 'lusca';
import { createRateLimiter } from './utils/limiter';

config();

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
const httpServer = createServer(app);

// 1. Middlewares de base (Sécurité en premier)
app.use(helmet());
app.use(
  cors({
    origin: [FRONTEND_ORIGIN],
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-school-id'],
  }),
);

// 2. Initialisation Socket.io
export const io = initSocket(httpServer, FRONTEND_ORIGIN);

// 3. Middlewares de parsing
app.use(useragent());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 4. Session & Auth
const pgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const globalRateLimiter = createRateLimiter({
  points: 100,
  duration: 15 * 60,
  keyPrefix: 'global',
});

// Limite globale sur toutes les routes : 100 requêtes par IP toutes les 15 minutes.
app.use(globalRateLimiter.middleware);

const graphqlRateLimiter = createRateLimiter({
  points: 30,
  duration: 60,
  keyPrefix: 'graphql',
});

const SESSION_TTL = 1000 * 60 * 30; // 30 min

app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: 'Session',
    }),
    name: 'sid',
    secret: JWT_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === 'production',
      httpOnly: true,
      maxAge: SESSION_TTL,
      sameSite: 'lax',
    },
  }),
);
// Apply strict security headers globally
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.p3p('ABCDEF'));
app.use(lusca.xssProtection(true));
app.use(lusca.nosniff());
app.use(lusca.referrerPolicy('same-origin'));

// CSRF: apply only to non-API routes (SPA/pages). We skip `/api` and `/graphql` because
// those endpoints are consumed by the frontend via XHR/fetch and use other protections
// (CORS, sameSite cookies, auth tokens). For protected non-API POSTs/forms, enable CSRF.
const csrfMiddleware = lusca.csrf();
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/graphql') return next();
  csrfMiddleware(req as any, res as any, (err?: unknown) => {
    if (err) return next(err);
    try {
      if (typeof (req as any).csrfToken === 'function') {
        // Expose token for SPA clients in a cookie named `XSRF-TOKEN`
        res.cookie('XSRF-TOKEN', (req as any).csrfToken());
      }
    } catch (e) {
      // ignore token generation errors here
    }
    return next();
  });
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getUserFromRedis(id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

setupLocalStrategy();

// OAuth Strategies
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (accessToken, refreshToken, profile, done) =>
      handleOauthStrategy(accessToken, refreshToken, profile, done, 'google'),
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      enableProof: true,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    (accessToken, refreshToken, profile, done) =>
      handleOauthStrategy(refreshToken, accessToken, profile, done, 'facebook'),
  ),
);

// 5. Routes
app.use('/api', routes);
app.use('/api/auth', forgotPasswordController);
app.all(
  '/graphql',
  isAuthenticated,
  graphqlRateLimiter.middleware,
  graphqlMiddleware,
);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'public/index.html'));
});

app.use(express.static(path.resolve(process.cwd(), 'public')));

// 6. Error Handling
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
