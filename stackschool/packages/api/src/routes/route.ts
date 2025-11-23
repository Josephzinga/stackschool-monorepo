// src/server.ts
import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

// -------------------- helpers --------------------
function generateToken(len = 48) {
  return crypto.randomBytes(len).toString("hex");
}

const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// -------------------- middlewares --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS : autorise frontend et envoie les cookies
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// -------------------- express-session --------------------
// Nous utilisons express-session + connect-pg-simple pour stocker les sessions express (short-lived).
// Le cookie de session est autonome (par ex: connect.sid) et contient l'id de session côté serveur.
const ONE_MIN = 60 * 1000;
const SESSION_TTL = 15 * ONE_MIN; // session courte : 15 minutes

app.use(
  session({
    store: new PgSession({ pool: pgPool, tableName: "session" }),
    name: "sid", // nom du cookie de session (au lieu de connect.sid)
    secret: process.env.SESSION_SECRET || "change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production", // true en production (https)
      sameSite: "lax",
      maxAge: SESSION_TTL,
    },
  })
);

// -------------------- passport --------------------
app.use(passport.initialize());
app.use(passport.session()); // passport rely on express-session

// Passport serialize / deserialize
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true, Account: true },
    });
    done(null, user ?? null);
  } catch (err) {
    done(err as Error);
  }
});

// -------------------- Google Strategy --------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extraire données utiles
        const provider = "google";
        const providerAccountId = profile.id;
        const email = profile.emails?.[0]?.value ?? null;
        const displayName = profile.displayName ?? "";
        const avatar = profile.photos?.[0]?.value ?? null;

        // split displayName pour firstname/lastname (naïf, améliorable)
        const parts = displayName.trim().split(/\s+/);
        const firstname = parts.shift() ?? "";
        const lastname = parts.join(" ") ?? "";

        // 1) cherche Account existant
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId,
            },
          },
          include: { user: { include: { profile: true } } },
        });

        if (existingAccount) {
          // mettre à jour tokens si besoin
          await prisma.account.update({
            where: { id: existingAccount.id },
            data: {
              access_token: accessToken ?? existingAccount.access_token,
              refresh_token: refreshToken ?? existingAccount.refresh_token,
            },
          });
          return done(null, existingAccount.user);
        }

        // 2) sinon cherche user par email pour lier
        if (email) {
          const userByEmail = await prisma.user.findUnique({
            where: { email },
            include: { profile: true, Account: true },
          });

          if (userByEmail) {
            // Crée l'Account pour ce user existant
            await prisma.account.create({
              data: {
                provider,
                providerAccountId,
                access_token: accessToken,
                refresh_token: refreshToken,
                user: { connect: { id: userByEmail.id } },
              },
            });

            // Créer/mettre à jour profile si manque info
            if (!userByEmail.profile) {
              await prisma.profile.create({
                data: {
                  firstname,
                  lastname,
                  photo: avatar,
                  user: { connect: { id: userByEmail.id } },
                },
              });
            } else if (!userByEmail.profile.photo && avatar) {
              await prisma.profile.update({
                where: { id: userByEmail.profile.id },
                data: { photo: avatar },
              });
            }

            const fresh = await prisma.user.findUnique({
              where: { id: userByEmail.id },
              include: { profile: true },
            });
            return done(null, fresh);
          }
        }

        // 3) sinon créer user social-only
        const safeEmail = email ?? `google:${providerAccountId}@local.invalid`;

        const newUser = await prisma.user.create({
          data: {
            email: safeEmail,
            emailVerified: email ? new Date() : undefined,
            profile: {
              create: {
                firstname,
                lastname,
                photo: avatar,
              },
            },
            Account: {
              create: {
                provider,
                providerAccountId,
                access_token: accessToken,
                refresh_token: refreshToken,
              },
            },
          },
          include: { profile: true, Account: true },
        });

        return done(null, newUser);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// -------------------- Routage auth --------------------

// 1) démarrer Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2) callback Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_ORIGIN}/login`,
    session: true,
  }),
  async (req, res) => {
    // À ce stade : req.user est défini (serializeUser a enregistré l'id dans la session express).
    try {
      const user = req.user as any; // user venant de deserializeUser (ou du callback)
      if (!user || !user.id) {
        return res.redirect(`${FRONTEND_ORIGIN}/login?error=auth`);
      }

      // --- Create a refresh token entry in prisma.session table (our long-lived token) ---
      const refreshToken = generateToken(32);
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

      await prisma.session.create({
        data: {
          sessionToken: refreshToken,
          userId: user.id,
          expires,
        },
      });

      // Set refresh cookie (HttpOnly)
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Redirect to front — la session express (cookie sid) est déjà envoyée par express-session
      res.redirect(`${FRONTEND_ORIGIN}/?from=social&provider=google`);
    } catch (err) {
      console.error("Callback error:", err);
      res.redirect(`${FRONTEND_ORIGIN}/login?error=server`);
    }
  }
);

// /auth/me => retourne le user si session express valide
app.get("/auth/me", async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.json({ user: null });
  }
  // req.user est peuplé par deserializeUser
  const user = req.user as any;
  // Ne PAS renvoyer de champs sensibles (password)
  res.json({
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile ?? null,
    },
  });
});

// /auth/refresh => échange refresh_token cookie contre une nouvelle session express (rotates token)
app.post("/auth/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh_token"];
    if (!refreshToken)
      return res.status(401).json({ error: "no_refresh_token" });

    // find session
    const dbSession = await prisma.session.findUnique({
      where: { sessionToken: refreshToken },
    });
    if (!dbSession || dbSession.expires < new Date()) {
      // token absent ou expiré
      if (dbSession) {
        await prisma.session.delete({ where: { id: dbSession.id } });
      }
      res.clearCookie("refresh_token");
      return res.status(401).json({ error: "invalid_refresh" });
    }

    // find user
    const user = await prisma.user.findUnique({
      where: { id: dbSession.userId },
      include: { profile: true },
    });
    if (!user) {
      await prisma.session.delete({ where: { id: dbSession.id } });
      res.clearCookie("refresh_token");
      return res.status(401).json({ error: "user_not_found" });
    }

    // Créer une nouvelle session express (req.login) -> génère un nouveau cookie sid
    await new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Rotate refresh token : supprime l'ancien et crée-en un nouveau
    await prisma.session.delete({ where: { id: dbSession.id } });

    const newRefresh = generateToken(32);
    const newExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        sessionToken: newRefresh,
        userId: user.id,
        expires: newExpires,
      },
    });

    res.cookie("refresh_token", newRefresh, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("refresh error", err);
    res.status(500).json({ error: "server_error" });
  }
});

// /auth/logout => logout complet (session + refresh token)
app.post("/auth/logout", async (req, res) => {
  try {
    // remove refresh token entry from DB if present
    const refreshToken = req.cookies["refresh_token"];
    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { sessionToken: refreshToken },
      });
      res.clearCookie("refresh_token");
    }

    // Logout passport & destroy express session
    req.logout((err) => {
      if (err) console.error("logout err", err);
      req.session?.destroy(() => {
        res.clearCookie("sid");
        res.json({ ok: true });
      });
    });
  } catch (err) {
    console.error("logout server err", err);
    res.status(500).json({ error: "server_error" });
  }
});

// Simple health
app.get("/health", (req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
