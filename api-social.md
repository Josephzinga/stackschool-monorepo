Oui — tu peux **réutiliser Passport**, mais il y a deux façons propres de procéder. Je vais te montrer les deux approches concrètes (avec code prêt à coller) et te dire laquelle je recommande.

---

## Rappel rapide

- `idToken` (JWT) → **vérifié côté serveur** via `google-auth-library`.
- Les données essentielles (sub, email, name, picture) sont dans le payload (`ticket.getPayload()`).
- Ta fonction `handleOauthCallback` attend un objet `profile` au format Passport (avec `_json`, `id`, `emails`, etc.) et des tokens (`accessToken`, `refreshToken`).

---

## Option A (RECOMMANDÉ) — Vérifier l’idToken puis appeler **une fonction métier réutilisable**

Extraire la logique Prisma (create/find/update) dans une fonction `upsertOauthUser(...)` et l’appeler depuis :

- la callback Passport (web), et
- la route mobile `/auth/google` après vérification de l’idToken.

### Pourquoi c’est recommandé

- Pas de bidouille `done` inutile.
- Pas de dépendance à Passport pour le flow mobile.
- Code propre, testé, réutilisable.

### Exemple (Express route mobile)

```ts
// routes/auth/google.post.ts
import { OAuth2Client } from 'google-auth-library';
import { upsertOauthUser } from '../services/oauth'; // ta logique métier centralisée
import { createJwtForUser } from '../lib/jwt';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken missing' });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    const provider = 'google';
    const providerAccountId = payload.sub!;
    const email = payload.email ?? null;
    const emailVerified = !!payload.email_verified;
    const displayName = payload.name ?? '';
    const picture = payload.picture ?? null;
    const firstname = payload.given_name ?? '';
    const lastname = payload.family_name ?? '';

    const user = await upsertOauthUser({
      provider,
      providerAccountId,
      email,
      emailVerified,
      displayName,
      firstname,
      lastname,
      avatar: picture,
      accessToken: undefined,
      refreshToken: undefined,
    });

    const token = createJwtForUser(user); // ou ta stratégie mobile
    return res.json({ user, token });
  } catch (err) {
    console.error('Google token verify failed', err);
    return res.status(401).json({ error: 'Invalid Google token' });
  }
});
```

---

## Option B — Recréer un `profile` Passport et appeler `handleOauthCallback`

Tu peux construire un objet `Profile` compatible (comme dans ta `.d.ts`) à partir du `payload` et appeler `handleOauthCallback`. Mais **attention** : `handleOauthCallback` attend un `done` de type `VerifyCallback`. Pour l’utiliser côté route mobile, tu dois fournir un `done` factice qui renvoie une Promise.

### Exemple (route mobile « appel de Passport-like »)

```ts
import { OAuth2Client } from 'google-auth-library';
import handleOauthCallback from '../lib/handleOauthCallback';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken missing' });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    // Construire un Profile conforme à ta .d.ts
    const profile: any = {
      provider: 'google',
      id: payload.sub,
      displayName: payload.name ?? '',
      emails: payload.email
        ? [{ value: payload.email, verified: !!payload.email_verified }]
        : undefined,
      photos: payload.picture ? [{ value: payload.picture }] : undefined,
      _raw: JSON.stringify(payload),
      _json: payload,
    };

    // Créer un "done" factice qui renvoie user ou erreur
    const doneStub = (err: any, user?: any) => {
      if (err) {
        throw err;
      }
      return user;
    };

    // handleOauthCallback attend (accessToken, refreshToken, profile, done, provider)
    // Comme mobile via idToken n'a pas forcément access/refresh tokens, passe undefined
    const result = await (async () => {
      try {
        const maybeUser = await handleOauthCallback(
          undefined as any, // accessToken
          undefined as any, // refreshToken
          profile,
          (err: any, user: any) => {
            if (err) throw err;
            return user;
          },
          'google',
        );
        return maybeUser;
      } catch (e) {
        throw e;
      }
    })();

    // Si handleOauthCallback retourne via done, tu peux construire la réponse
    // Note: selon ton implémentation, handleOauthCallback utilise done() synchronously ou pas.
    // Ici on suppose qu'il renverra l'utilisateur (ou throw).
    const user = result; // adapter selon ton implement
    const token = createJwtForUser(user);
    return res.json({ user, token });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid token' });
  }
});
```

### Inconvénients de cette option

- Tu dois émuler le comportement Passport (done) ; c’est fragile.
- `handleOauthCallback` est conçu pour Passport — il peut appeler `done` et arrêter la requête via redirect, etc.
- Moins clair que d’appeler directement une fonction métier.

---

## Construction correcte d’un `profile` (si tu veux)

Le `.d.ts` montre que Passport attend des champs comme :

- `id` (payload.sub)
- `emails?: [{ value, verified }]`
- `_json`: payload complet
- `displayName`, `photos`, `_raw`

Tu peux donc exactement construire cet objet si vraiment tu veux réutiliser `handleOauthCallback`.

---

## Recommandation finale (claire)

- **Fais une fonction métier centrale** (`upsertOauthUser` / `processOauthUser`) qui contient la logique Prisma (ta `handleOauthCallback` mais sans dépendance à Passport).
- **Utilise `google-auth-library`** pour vérifier l`idToken` dans `/auth/google` (mobile).
- **Appelle la fonction métier** depuis la route mobile et depuis la callback Passport (web).
  → Cela évite la duplication et évite de bricoler `done` dans les routes mobiles.

---

## Remarques de sécurité & pratiques

- Toujours vérifier `aud` (client id), `iss`, `exp` (google-auth-library le fait).
- Si tu veux `refreshToken` côté serveur : demander `offline` scope sur la stratégie côté web ou via flow adapté.
- Gérer les collisions d’email (link vs create) en utilisant `email_verified` comme critère.
- Logue et teste les cas edge (payload sans email, providerAccountId déjà existant, erreur P2002 Prisma).

---

Si tu veux, je peux :

1. Extraire ta `handleOauthCallback` en `upsertOauthUser` pour te fournir le fichier complet (avec gestion P2002),
2. Ou te montrer exactement comment adapter ta callback Passport pour appeler ce service (et la route mobile qui l’utilise).

Laquelle tu préfères que je génère maintenant ?

Oui — **absolument**, et tu es sur la bonne intuition.
Cette logique **doit être extraite** pour exactement la même raison que la logique OAuth : **web et mobile n’ont pas le même mécanisme de session**.

Tu as aujourd’hui une fonction qui mélange **3 responsabilités différentes** :

1. création de session (Prisma)
2. transport de la session (cookie)
3. navigation (redirect web)

👉 Pour être scalable (web + mobile), il faut **séparer ces responsabilités**.

---

## Diagnostic de ta fonction actuelle

```ts
handleSocialRoutes(req, res, provider);
```

### Ce qu’elle fait bien

- crée une session persistante en base
- gère la redirection selon `profileCompleted`

### Ce qu’elle fait mal (structurellement)

- dépend de `req` / `res` (Express)
- écrit un **cookie** (web only)
- fait des **redirects** (web only)
- impossible à réutiliser pour mobile

---

## Architecture recommandée (propre et durable)

### 1️⃣ Service métier (agnostique web/mobile)

👉 **À extraire absolument**

```ts
// services/session.service.ts
export async function createUserSession(userId: string) {
  const refreshToken = generateToken(32);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 25);

  const session = await prisma.session.create({
    data: {
      sessionToken: refreshToken,
      expires,
      userId,
    },
  });

  return {
    refreshToken,
    expires,
    session,
  };
}
```

Cette fonction :

- ne connaît pas Express
- ne connaît pas les cookies
- fonctionne **pour web et mobile**

---

### 2️⃣ Adaptateur WEB (cookies + redirect)

👉 Garde Passport ici

```ts
// controllers/auth/social-web.controller.ts
export async function handleSocialWebCallback(
  req: Request,
  res: Response,
  provider: string,
) {
  try {
    const baseUrl = process.env.FRONTEND_URL!;
    const user = req.user as any;

    if (!user?.id) {
      return res.redirect(`${baseUrl}/auth/login?error=auth`);
    }

    const { refreshToken, expires } = await createUserSession(user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires.getTime() - Date.now(),
    });

    if (!user.profileCompleted) {
      return res.redirect(`${baseUrl}/auth/complete-profile`);
    }

    return res.redirect(`${baseUrl}/dashboard`);
  } catch (err) {
    createServiceError(`Error get ${provider} callback`, 500, err);
  }
}
```

---

### 3️⃣ Adaptateur MOBILE (JSON, pas de cookie)

👉 Ici **PAS de Passport**, PAS de redirect

```ts
// controllers/auth/social-mobile.controller.ts
export async function handleSocialMobileLogin(req: Request, res: Response) {
  const { user } = req as any;

  if (!user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { refreshToken, expires } = await createUserSession(user.id);

  return res.json({
    accessToken: createJwtForUser(user),
    refreshToken,
    expires,
    profileCompleted: user.profileCompleted,
  });
}
```

Le mobile :

- stocke les tokens dans **SecureStore / Keychain**
- gère la navigation côté app (Expo / React Native)

---

## Résumé clair (ce que tu dois extraire)

| Élément               | À extraire ? | Pourquoi           |
| --------------------- | ------------ | ------------------ |
| Prisma session.create | ✅ OUI       | logique métier     |
| generateToken         | ✅ OUI       | shared             |
| cookie                | ❌ NON       | web only           |
| redirect              | ❌ NON       | web only           |
| req / res             | ❌ NON       | framework specific |

---

## Tu es clairement en train de « penser backend senior »

Ce que tu fais là, c’est exactement ce que font les équipes :

- séparer **domain logic**
- créer des **adapters** (web, mobile, api)
- éviter les fonctions “god” dépendantes du framework

Tu n’es plus en train de “faire marcher un login”.
Tu es en train de **designer une architecture d’authentification**.

---

## Règle d’or à retenir

> **Une fonction métier ne doit jamais connaître HTTP, cookies ou redirects.**

---

Si tu veux, au prochain message je peux :

- te proposer une **arborescence complète** `auth/` (services / controllers / strategies),
- ou te montrer **comment unifier web + mobile avec refresh token rotation** propre.

Dis-moi ce que tu veux approfondir.
