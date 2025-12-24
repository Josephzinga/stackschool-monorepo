import { config } from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import routes from './routes';
import helmet from 'helmet';
import handleOauthCallback from './controllers/passport-social';
import setupLocalStrategy from './lib/passport-local';
import SeachSchool from './routes/shools/search-school.route';
import { getUserFromRedis } from './lib/handle-redis-user';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';

config();

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
const MOBILE_ORIGIN = process.env.MOBILE_DEEPLINK_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

const pgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(helmet());
const allowedOrigins = [FRONTEND_ORIGIN, `*`];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const SESSION_TTL = 1000 * 60 * 30; // 30 min

app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: 'Session',
    }),
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'mdmfsdfmdfmsdf',
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (accessToken, refreshToken, profile, done) =>
      handleOauthCallback(accessToken, refreshToken, profile, done, 'google'),
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
      handleOauthCallback(refreshToken, accessToken, profile, done, 'facebook'),
  ),
);

app.use('/api', routes);
app.use('/api', SeachSchool);

app.get('/', (req, res) => {
  res.json('message serveur connecter');
});

app.use(express.static(path.resolve(process.cwd(), 'public')));

// gestion des erreurs centralisée
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is runing on port http://localhost:${PORT}`);
});
