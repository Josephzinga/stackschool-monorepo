Super — je vais te donner **une explication claire, pas à pas**, et **un système complet en TypeScript** pour :

- **Passport.js** avec **Google OAuth** (provider)
- ton **modèle Prisma** (`User`, `Profile`, `Account`, `Session`, `VerificationToken`) — on l’utilise tel que tu l’as défini
- une gestion **session cookie (express-session)** + **refresh cookie** (token stocké dans la table `Session`)
- les routes utiles (`/auth/google`, `/auth/google/callback`, `/auth/me`, `/auth/refresh`, `/auth/logout`)
- la logique **find-or-create** pour `User` ⇄ `Profile` ⇄ `Account`
- conseils de sécurité et le flux pour la page d’onboarding (compléter le profil)

Je fournis d’abord le **contexte et le flux** (pour que tu comprennes), puis le **code TypeScript complet** du serveur et enfin les **explications détaillées** sur chaque partie.

---

# Vue d’ensemble du flux (résumé conceptuel)

1. L’utilisateur clique sur **Se connecter avec Google** → navigateur redirigé vers `/auth/google`.
2. Google revient sur `/auth/google/callback` avec le profil.
3. Backend :

   - **cherche un `Account`** existant (provider+providerAccountId) → si trouvé => connecte cet user.
   - sinon **cherche un `User` par email** → si trouvé : crée `Account` et complète `Profile` si nécessaire.
   - sinon : **crée `User` + `Profile` + `Account`**.

4. Après authentification : on appelle `req.login(user)` (Passport) — **express-session** créé une session courte côté serveur et envoie le cookie de session (`connect.sid` par défaut).
5. On crée **en plus** un **refresh token** long (généré côté serveur) et on sauvegarde ce token dans la table `Session` (ton modèle Prisma). Ce token est renvoyé dans un cookie `refresh_token` HttpOnly, long expiry (ex : 30 jours).
6. Quand la session courte expire (ex : 15 minutes), le client appelle `/auth/refresh` (automatiquement ou manuellement) ; backend vérifie `refresh_token` cookie → si valide, il **re-crée une session express** (req.login) et **rotate** (change) le refresh token (sécurité).
7. `GET /auth/me` renvoie le `user` + `profile` (données publiques) si la session express est valide. Sinon `user: null`.
8. `POST /auth/logout` : détruit session express et supprime le refresh token serveur + supprime les cookies côté client.

---

# Fichiers / dépendances (ce dont tu as besoin)

Tu as dit que tu as déjà tout installé — voici la liste minimale (TypeScript) si besoin :

```
npm i express passport passport-google-oauth20 express-session connect-pg-simple pg cors cookie-parser prisma @prisma/client bcrypt dotenv
npm i -D typescript ts-node @types/express @types/express-session @types/cookie-parser @types/node
```

---

# `.env` (exemple)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
SESSION_SECRET=change_this_super_secret
FRONTEND_ORIGIN=http://localhost:3000

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

NODE_ENV=development
PORT=4000
```

---

# Code serveur (TypeScript) — `src/server.ts`

Colle ce fichier dans ton projet TypeScript (ajoute/ajuste imports et tsconfig si nécessaire).
Je commente fortement chaque bloc pour que tu saches comment ça marche.

```ts
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
```

---

# Explications détaillées (ligne par ligne — points importants)

### 1) Pourquoi `express-session` + `connect-pg-simple` **et** une table `Session` ?

- `express-session` fournit le **mécanisme de session** que Passport attend (serializeUser/deserializeUser). Il stocke une session courte côté serveur (id ↔ données de session) et envoie un cookie `sid` au client.
- **Mais** pour le pattern refresh-token côté navigateur (similaire à NextAuth), on garde une table `Session` (ton modèle Prisma) pour stocker un **refresh token** longue durée. Ce token est en cookie HttpOnly et permet de recréer une session express lorsque la session courte expire.
- Avantage : amortit la durée de l’ID de session, permet rotation du refresh token, meilleure sécurité et contrôle (tu peux lister/annuler tokens côté serveur).

### 2) Durées recommandées

- session courte (`sid`) : 10–30 minutes (ici 15 minutes).
- refresh token cookie : 7–30 jours (ici 30 jours).
- toujours **HttpOnly** et `sameSite: 'lax'` (ou `none`+`secure` si cross-site strict).

### 3) Sécurité cookie & domaines

- En **production** : `secure: true` (HTTPS requis).
- Si front & api sont sur sous-domaines (ex: `app.example.com` / `api.example.com`) : configurer `domain` du cookie pour `example.com` si besoin, et utiliser `sameSite: 'none'` + `secure: true`.
- Ajoute rate-limit sur `/auth/login` et `/auth/refresh` pour éviter abus.

### 4) Rotation du refresh token

- À chaque `/auth/refresh`, on supprime l’ancien refresh token en DB et on en crée un nouveau. -> limite l’utilisation abusive d’un token volé.

### 5) Stocker tokens OAuth dans `Account`

- `Account` garde `access_token`, `refresh_token`, `id_token` (optionnel). Utile si tu veux appeler des API Google côté serveur au nom de l’utilisateur.

### 6) Gérer l’email manquant (Facebook) — cas général

- Certains providers peuvent ne pas fournir l’email : on crée alors un email factice `provider:id@local.invalid` et on force l’utilisateur à **compléter** son profil via la page d’onboarding (voir plus bas).

### 7) serializeUser / deserializeUser

- `serializeUser` stocke `user.id` en session express.
- `deserializeUser` rebuild l’objet `user` (avec `profile`) à partir de l’id. Important : **ne jamais inclure `password`** dans l’objet renvoyé (on l’a exclu dans les requêtes Prisma).

### 8) Frontend (Next.js) — comportements importants

- **OAuth redirect** : bouton → `window.location.href = "http://localhost:4000/auth/google"`. Pas besoin de fetch.
- **Après callback** : backend redirige vers `FRONTEND_ORIGIN`. Le navigateur aura :

  - cookie `sid` (session express) côté frontend (HTTP cookie)
  - cookie `refresh_token` (HttpOnly)

- **Appeler /auth/me** : fetch("[http://localhost:4000/auth/me](http://localhost:4000/auth/me)", { credentials: 'include' }) pour récupérer user+profile.
- **Si /auth/me retourne user:null** → appeler `/auth/refresh` (POST) pour essayer de recréer session via refresh cookie. Si refresh échoue → rediriger vers `/login`.

Exemples client pseudo :

```js
// obtenir user
const res = await fetch("http://localhost:4000/auth/me", {
  credentials: "include",
});
if (res.status === 200) {
  const { user } = await res.json();
  if (!user) {
    // essayer refresh once
    const r = await fetch("http://localhost:4000/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (r.ok) {
      /* maintenant faire /auth/me à nouveau */
    } else {
      /* rediriger vers login */
    }
  }
}
```

### 9) Page d’onboarding (compléter profil)

Après première connexion social-only :

- si `profile` est incomplet (email missing, phone missing), détecte côté frontend (après `/auth/me`), et redirige vers `/complete-profile`.
- Page `/complete-profile` : formulaire pour firstname, lastname, phone, email si nécessaire. Appelle API `/auth/profile` (PATCH) pour enregistrer `Profile` via Prisma. (Je ferai le code si tu veux).
- Important : valider email si l’utilisateur l’a modifié (send verification token -> utilise `VerificationToken`).

### 10) Révocation / logout

- Quand user se déconnecte : supprime entry dans `Session` table (refresh tokens), détruis session express, et clear cookies. Ainsi la session ne pourra plus être rafraîchie.

---

# Prochaines étapes que je peux faire pour toi (dis ce que tu veux maintenant)

- Générer la **route Next.js / page** `complete-profile` (TypeScript) + API Next -> pour appeler `/auth/profile` et mettre à jour `Profile`.
- Ajouter la **stratégie Local** (email/password) en TypeScript (register/login) avec `bcrypt` si tu veux un login classique en plus du social.
- Générer fichier `prisma/schema.prisma` complet si tu veux vérifier les modèles (mais tu as déjà).
- Ajouter **CSRF protection** et **rate-limiting** exemples.

---

Si tu veux, je te fournis **la route `PATCH /auth/profile`** (TypeScript) plus la page Next.js pour compléter le profil — ainsi on aura le flow complet onboarding. Veux-tu que je génère ça maintenant ?

# PARTIE 2

Top — je vais tout t’expliquer clairement et te donner du code prêt à coller. On va couvrir :

1. À quoi sert la page Next.js qui reçoit `?from=social&provider=...`
2. Un composant Next (App Router) « callback/finish » qui gère le redirect et lance la logique (récupérer `/auth/me`, fallback `/auth/refresh`, redirection vers onboarding si profil incomplet).
3. Les pages Login / Signup (LocalStrategy) côté Next.js (fetch avec `credentials: 'include'`).
4. Le code serveur TypeScript pour **local register/login** (Express + Passport-Local + bcrypt + Prisma).
5. Comment **lier** un provider social à un compte local existant (passReqToCallback + logique de linking).
6. Notes pratiques & sécurité.

Je donne d’abord l’idée générale, puis le code.

---

# 1) Rôle de la page `?from=social&provider=...`

Quand Passport redirige vers :

```
res.redirect(`${FRONTEND_ORIGIN}/?from=social&provider=google`);
```

tu dois fournir une page front qui :

- lit les query params `from` et `provider` (p. ex. `google`, `facebook`, `github`, ...),
- vérifie l’état d’authentification côté client en appelant `/auth/me` (avec `credentials: 'include'`),
- si `me` renvoie `user: null`, tente automatiquement `/auth/refresh` (si tu utilises refresh cookie) pour recréer la session,
- si l’utilisateur est connecté :

  - s’il a un profil incomplet → redirige vers `/complete-profile` (onboarding) pour compléter `Profile`,
  - sinon redirige vers la page d’accueil ou dashboard,

- si l’utilisateur n’est toujours pas connecté → affiche une erreur et invite à se reconnecter.

Cette page sert donc d’**intermédiaire** entre la redirection OAuth et le reste de ton app (onboarding, messages de bienvenue, tracking du provider, etc.). Elle est utile surtout si tu as plusieurs providers : tu peux afficher un message personnalisé (ex : « bienvenue via Google »).

---

# 2) Exemple Next.js (App Router) — page `app/auth/finish/page.tsx` (client component)

```tsx
// app/auth/finish/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthFinish() {
  const search = useSearchParams();
  const router = useRouter();
  const from = search?.get("from") ?? "";
  const provider = search?.get("provider") ?? "";

  const [status, setStatus] = useState<
    "loading" | "ok" | "need_onboard" | "error"
  >("loading");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    async function checkAuth() {
      try {
        // 1) verifier /auth/me
        let res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
          }/auth/me`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();
        if (data?.user) {
          // connecté
          // si profile incomplet -> redirect onboarding
          const profile = data.user.profile;
          if (!profile || !profile.firstname || !profile.lastname) {
            setStatus("need_onboard");
            // redirige vers onboarding et passe le provider
            router.replace(
              `/complete-profile?provider=${encodeURIComponent(provider)}`
            );
            return;
          }
          // tout ok
          setStatus("ok");
          router.replace(`/dashboard`);
          return;
        }

        // 2) si pas connecté, essayer refresh (cas session courte expirée)
        const refresh = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
          }/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refresh.ok) {
          // on refait /auth/me
          const res2 = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
            }/auth/me`,
            {
              credentials: "include",
            }
          );
          const data2 = await res2.json();
          if (data2?.user) {
            if (!data2.user.profile || !data2.user.profile.firstname) {
              router.replace(
                `/complete-profile?provider=${encodeURIComponent(provider)}`
              );
              return;
            }
            router.replace(`/dashboard`);
            return;
          }
        }

        // si toujours pas connecté -> afficher erreur
        setStatus("error");
        setMsg(
          "Impossible de valider la connexion. Réessaie ou contacte le support."
        );
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMsg("Erreur réseau");
      }
    }
    checkAuth();
  }, [from, provider, router]);

  if (status === "loading")
    return (
      <div>Verification de la connexion via {provider || "le provider"}…</div>
    );
  if (status === "error") return <div>Erreur: {msg}</div>;
  return null;
}
```

Points à noter :

- `NEXT_PUBLIC_API_BASE` = `http://localhost:4000` en dev. Met-le dans `.env` pour la prod.
- Cette page tente `/auth/me` puis `/auth/refresh` (flow décrit précédemment).
- Si profil incomplet, redirige vers `/complete-profile` en passant `provider` pour contextualiser l’onboarding.

---

# 3) Page Next.js pour démarrer l’OAuth (boutons providers)

Sur ta page de login tu peux afficher des boutons qui redirigent vers ton backend :

```tsx
// app/login/components/SocialButtons.tsx (client)
export default function SocialButtons() {
  const start = (provider: string) => {
    window.location.href = `${
      process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
    }/auth/${provider}`;
  };

  return (
    <div>
      <button onClick={() => start("google")}>Se connecter avec Google</button>
      <button onClick={() => start("facebook")}>
        Se connecter avec Facebook
      </button>
      {/* ajoute d'autres providers pareil */}
    </div>
  );
}
```

---

# 4) Login & Signup Local (Next.js client pages) — exemples TSX (fetch)

### Signup (register)

```tsx
// app/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstname, lastname }),
    });
    if (res.ok) router.replace("/dashboard");
    else {
      const err = await res.json();
      alert(err?.error || "Erreur");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Prénom"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <input
        placeholder="Nom"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
```

### Login

```tsx
// app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.replace("/dashboard");
    else {
      const data = await res.json();
      alert(data?.error || "Erreur de connexion");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}
```

Important :

- `credentials: "include"` = indispensable pour que le cookie de session (`sid`) et le refresh cookie soient envoyés/parcourus.

---

# 5) Code serveur TypeScript — LocalStrategy (Express + Passport + Prisma + bcrypt)

Voici la logique côté serveur pour register/login (TypeScript, express route). Intègre-la dans ton serveur existant.

```ts
// src/auth/local.ts (extraits)
import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        profile: {
          create: {
            firstname: firstname ?? "",
            lastname: lastname ?? "",
          },
        },
      },
    });

    // login automatiquement (créé express session)
    req.login(user, (err) => {
      if (err)
        return res.status(500).json({ error: "Login after register failed" });
      // create refresh token in DB (comme pour social)
      // ... code pour créer token identique à social flow ...
      return res.json({ ok: true });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// Login (passport-local)
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });
        if (!user)
          return done(null, false, { message: "Utilisateur introuvable" });
        if (!user.password)
          return done(null, false, { message: "Compte social uniquement" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
          return done(null, false, { message: "Mot de passe incorrect" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Route login en utilisant passport.authenticate
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ error: info?.message || "Authentication failed" });

    req.login(user, async (err) => {
      if (err) return next(err);

      // créer refresh token en DB (comme pour google callback)
      // await prisma.session.create({ data: { sessionToken: token, userId: user.id, expires: ... }});
      // set cookie "refresh_token"

      res.json({
        ok: true,
        user: { id: user.id, email: user.email, profile: user.profile },
      });
    });
  })(req, res, next);
});

export default router;
```

Notes :

- Lors de `register`, on crée le `Profile` en même temps.
- Après login/register, crée et envoie le `refresh_token` cookie comme pour social login (voir code Google callback fourni précédemment).

---

# 6) Lier un provider social à un compte local existant (linking)

Deux cas courants :

- **Cas A** : l’utilisateur a déjà un compte local (email+password). Il veut lier Google depuis son profil : on doit détecter `req.user` existant lorsque le callback OAuth arrive, et dans ce cas ajouter un `Account` lié à `req.user.id`.
- **Cas B** : l’utilisateur clique “se connecter avec Google” alors qu’un autre compte avec même email existe → on lie automatiquement (logique `find by email`).

Pour le **Cas A** tu utilises `passReqToCallback: true` dans la stratégie OAuth :

```ts
new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    // si l'utilisateur est déjà connecté (req.user) -> link
    if (req.user) {
      const user = req.user as any;
      // créer un Account lié
      await prisma.account.create({
        data: {
          provider: "google",
          providerAccountId: profile.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          user: { connect: { id: user.id } },
        },
      });
      // éventuellement mettre à jour profile (photo, names) si vide
      return done(null, user);
    }

    // sinon logique normale find-or-create (account/email/new user)
  }
);
```

Flow UX typique pour linking :

1. User est connecté localement.
2. Dans son `Account settings`, il clique « Lier Google ».
3. Tu rediriges vers `/auth/google?link=true` (ou juste `/auth/google` mais backend détecte `req.user`).
4. Google callback arrive : si `req.user` existe -> create Account avec `userId` existant -> redirect vers settings (avec succès).

Important : pour que `req.user` existe au callback, l'utilisateur doit déjà avoir une session express (cookie `sid`) valide quand il commence l’OAuth flow. Donc _navigateur doit envoyer cookie sid_ au backend lorsqu'il appelle `/auth/google` — c’est automatique si frontend et backend partagent le domaine ou si CORS et cookies sont correctement configurés (`credentials: 'include'`).

---

# 7) Résumé rapide & checklist pour toi

- ✅ Page `...?from=social&provider=...` : vérifier `/auth/me`, fallback `/auth/refresh`, rediriger vers onboarding/dash.
- ✅ Login/Register local : fetch POST -> `/auth/login` et `/auth/register` avec `credentials: 'include'`.
- ✅ Lien provider ↔ local : utiliser `passReqToCallback` pour linking si `req.user` présent.
- ✅ Après tout login (local ou social): crée **refresh token** (table `Session`) et envoie cookie HttpOnly `refresh_token`.
- ✅ Front-end : appeler `/auth/me` pour obtenir `user` et afficher profile. Si null, tenter refresh.
- ✅ Onboarding : page `/complete-profile` pour compléter firstname/lastname/email/phone et appeler une route `/auth/profile` PATCH.

---

Si tu veux je peux maintenant :

- te générer la page `/complete-profile` (Next.js) + l’API route Express `PATCH /auth/profile` pour mettre à jour `Profile` ;
- ou t’aider à ajouter l’option `link account` dans l’UI (bouton Link Google) et le code côté serveur pour gérer le linking proprement (avec checks et messages).

Laquelle tu veux en premier ?

# login Routes parite 3

Parfait — je te propose tout ce dont tu as besoin :

1. l'enregistrement de la stratégie `local` (Passport + ta fonction `handleLocalAuth`),
2. la route `POST /auth/login` qui utilise `passport.authenticate("local", ...)` avec un _callback_ personnalisé pour gérer : erreurs, comptes _social-only_, création de session / cookie `refresh_token` (comme pour Google), et redirections vers le front.

Colle ça dans ton projet (TypeScript / Express). J'ai repris tes noms (`generateToken`, `prisma`, `FRONTEND_ORIGIN`) pour rester cohérent.

---

### 1) Enregistrer la stratégie Local (ex. `lib/passport-local.ts`)

```ts
// lib/passport-local.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import handleLocalAuth from "../auth/handleLocalAuth"; // ta fonction

export default function setupLocalStrategy() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "emailOrUsername",
        passwordField: "password",
        session: true,
      },
      // LocalStrategy attend (username, password, done)
      (username: string, password: string, done: any) => {
        return handleLocalAuth(username, password, done);
      }
    )
  );
}
```

Appelle `setupLocalStrategy()` au démarrage de ton serveur (là où tu configures Passport).

---

### 2) Route de login (ex. `routes/auth/local.ts`)

```ts
// routes/auth/local.ts
import { Router } from "express";
import passport from "passport";
import { generateToken } from "../../lib/generateToken";
import { prisma } from "../../lib/prisma";
import { User } from "../../generated/client";

const router = Router();
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * POST /auth/login
 * Body: { emailOrUsername: string, password: string }
 *
 * Utilise un callback personnalisé pour gérer :
 * - erreur serveur (err)
 * - user falsy (bad credentials)
 * - info.isSocialOnly => renvoyer info pour rediriger vers login social
 * - création de session + cookie refresh_token (comme pour google callback)
 */
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    async (err: any, user: User | false, info: any) => {
      try {
        if (err) {
          console.error("Passport local error:", err);
          return res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=server`);
        }

        // Cas : compte social-only (strategy l'a retourné via info)
        if (info?.isSocialOnly) {
          const providers = Array.isArray(info.providers)
            ? info.providers.join(",")
            : info.providers || "";
          // rediriger vers page qui propose connexion via provider (ou fournir JSON si AJAX)
          return res.redirect(
            `${FRONTEND_ORIGIN}/auth/finish?from=social&providers=${encodeURIComponent(
              providers
            )}`
          );
        }

        // Cas : mauvais identifiants
        if (!user) {
          // info.message peut contenir le message de la stratégie (ex: "Identifiants invalides")
          const msg = info?.message ? encodeURIComponent(info.message) : "auth";
          return res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=${msg}`);
        }

        // OK : login réussi -> créer session (refresh token) et cookie
        const refreshToken = generateToken(32);
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25); // 25 jours

        await prisma.session.create({
          data: {
            sessionToken: refreshToken,
            userId: user.id,
            expires,
          },
        });

        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 25,
        });

        // Option : si profil incomplet, rediriger vers /auth/finish?from=local&complete=true
        const profileComplete = Boolean(
          user.profile &&
            user.username &&
            user.profile.firstname &&
            user.profile.lastname
        );
        if (!profileComplete) {
          return res.redirect(
            `${FRONTEND_ORIGIN}/auth/finish?from=local&complete=false`
          );
        }

        // Sinon rediriger vers l'app (ou profil)
        return res.redirect(`${FRONTEND_ORIGIN}/dashboard`);
      } catch (e) {
        console.error("Error in local login callback:", e);
        return res.redirect(`${FRONTEND_ORIGIN}/auth/login?error=server`);
      }
    }
  )(req, res, next);
});

export default router;
```

---

### Remarques utiles

- J’ai utilisé `passport.authenticate(..., callback)(req,res,next)` pour récupérer `err, user, info` et agir selon la situation (social-only, mauvais identifiants, ou succès).
- Tu peux aussi renvoyer JSON si tu gères l’auth via fetch/AJAX plutôt que des redirections. Exemple : si `req.headers["accept"] === "application/json"`, renvoyer `{ ok: false, message }` au lieu de `res.redirect(...)`.
- `info.providers` vient de ta stratégie `handleLocalAuth` (tu l'avais mis `Account` → j'ai supposé que ta stratégie met `providers` dans `info`).
- Pense à protéger la route contre le bruteforce (rate-limit).
- Vérifie que tu as bien appelé `setupLocalStrategy()` **avant** d'utiliser la route.
- N'oublie pas `passport.initialize()` et `passport.session()` dans ton `app.ts`/`server.ts`, ainsi que `express.json()` middleware.

---

Si tu veux, je peux aussi :

- fournir la version **JSON** de la route adaptée pour fetch/AJAX (utile pour Single Page App),
- t’aider à intégrer la redirection `auth/finish` côté frontend (ex. traitement des query params `from=...&providers=...`),
- adapter la route si tu utilises Next.js API routes au lieu d'Express.

Laquelle tu veux que je fasse ensuite ?

# Les routes Forgot-passowrd et reset password

Très bonne question 👍

👉 **Twilio**, à la base, est surtout spécialisé dans la **communication par SMS, appels et WhatsApp**.
Mais oui, **Twilio peut aussi envoyer des emails**, **grâce à son service SendGrid** — qui appartient à Twilio.

Voici les détails 👇

---

## 💌 Twilio SendGrid : l’envoi d’emails via Twilio

Twilio a racheté **SendGrid**, une plateforme complète pour l’envoi d’emails (transactionnels ou marketing).
C’est donc **Twilio SendGrid** que tu utilises pour envoyer les emails depuis ton application (ex. pour `reset-password`, confirmation de compte, etc.).

---

### ⚙️ Exemple : envoyer un email de réinitialisation avec Twilio SendGrid

1. **Installe le SDK :**

```bash
npm install @sendgrid/mail
```

2. **Configure ton API Key (dans `.env`) :**

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **Utilise-le dans ton code :**

```ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendResetPasswordEmail(email: string, resetLink: string) {
  const msg = {
    to: email,
    from: "no-reply@tonapp.com", // un email vérifié dans ton compte SendGrid
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour continuer :</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>Ce lien expirera dans 15 minutes.</p>
    `,
  };

  await sgMail.send(msg);
}
```

---

### 💬 Exemple : envoyer un code WhatsApp avec Twilio (normal Twilio SDK)

```ts
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendWhatsAppCode(phone: string, code: string) {
  await client.messages.create({
    from: "whatsapp:+14155238886", // numéro sandbox Twilio WhatsApp
    to: `whatsapp:${phone}`,
    body: `Votre code de vérification est : ${code}`,
  });
}
```

---

## 🧩 Intégration dans ton flux `forgot-password`

Dans ta route `/forgot-password`, tu peux faire :

```ts
if (user.email) {
  const token = generateToken(32);
  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  const link = `${FRONTEND_ORIGIN}/reset-password?token=${token}`;
  await sendResetPasswordEmail(user.email, link);
  return res.json({ message: "Email envoyé" });
}

if (user.phoneNumber) {
  const code = Math.floor(100000 + Math.random() * 900000);
  await prisma.verificationCode.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  await sendWhatsAppCode(user.phoneNumber, code);
  return res.json({ message: "Code envoyé sur WhatsApp" });
}
```

---

## 🧠 En résumé

| Cas                              | Moyen             | Modèle Prisma       | Méthode d’envoi         |
| -------------------------------- | ----------------- | ------------------- | ----------------------- |
| 🔑 Réinitialisation via Email    | Lien (token)      | `VerificationToken` | **Twilio SendGrid**     |
| 📲 Réinitialisation via WhatsApp | Code (6 chiffres) | `VerificationCode`  | **Twilio WhatsApp API** |

---

Souhaites-tu que je te crée les **trois routes complètes (`/forgot-password`, `/verify-phone`, `/reset-password`)** intégrées avec **SendGrid + Twilio WhatsApp**, prêtes à copier-coller dans ton projet Express ?
