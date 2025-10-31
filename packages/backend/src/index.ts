import { config } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { prisma } from "./lib/prisma";
import cors from "cors";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import routes from "./routes";
import { createClient, RedisClientType } from "redis";
import helmet from "helmet";
import handleOauthCallback from "./controllers/passport-social";
import setupLocalStrategy from "./lib/passport-local";
import SeachSchool from "./routes/shools/search-school.route";
import { User } from "@stackschool/db";

config();

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

const pgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(helmet());
//app.use(cors());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const SESSION_TTL = 1000 * 60 * 30; // 30 min

app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "Session",
    }),
    name: "sid",
    secret: process.env.SESSION_SECRET || "mdmfsdfmdfmsdf",
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
      maxAge: SESSION_TTL,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true, Account: true },
    });
    return done(null, user ?? null);
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
      handleOauthCallback(accessToken, refreshToken, profile, done, "google")
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      enableProof: true,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    (accessToken, refreshToken, profile, done) =>
      handleOauthCallback(refreshToken, accessToken, profile, done, "facebook")
  )
);

app.use("/api", routes);
app.use("/api", SeachSchool);
app.get("/", (req, res) => {
  res.json("message serveur connecter");
});

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error: Error) => {
  console.error("Erreur de connexion à redis:", error);
});

async function connectToRedis() {
  await redisClient.connect();
  console.log("Redis connecté");
}

connectToRedis();

app.listen(PORT, () => {
  console.log(`server is runing on port http://localhost:${PORT}`);
});
