# School Timetable Generation – Prisma + date-fns

## Context

You are working in a Node.js / TypeScript backend using:

- Prisma ORM
- PostgreSQL
- date-fns
- An existing Prisma Client instance (`prisma`)

The goal is to generate school timetables (lessons) for a school using:

- schoolId
- classId
- teacherId
- subjectId

The lesson name MUST be derived from the subject name (`subject.name`).

---

## Important Naming Rule

When creating a Lesson:

- Use `subject.name` as the lesson title
- Do NOT hardcode lesson names

Example:

```ts
title: subject.name;
```

---

## Data Relationship Reference (NO SQL IN CODE)

```sql
Class -> ClassSubjects -> Subject
                     -> Teacher
```

This SQL is for understanding only and must not be implemented in code.

---

## Prisma Lesson Model Recommendation

It is RECOMMENDED to add a `title` column to the Lesson model.

```prisma
model Lesson {
  id        String   @id @default(cuid())
  title     String
  day       Day
  startTime DateTime
  endTime   DateTime

  schoolId  String
  classId   String
  teacherId String
  subjectId String

  school    School  @relation(fields: [schoolId], references: [id])
  class     Class   @relation(fields: [classId], references: [id])
  teacher   Teacher @relation(fields: [teacherId], references: [id])
  subject   Subject @relation(fields: [subjectId], references: [id])

  @@index([schoolId, day])
}
```

---

## Constraints

- Lessons must be created per `schoolId`
- A teacher cannot teach two lessons at the same time
- A class cannot have two lessons at the same time
- Lesson duration: 1 hour
- Time range: 08:00 → 16:00
- Days: MONDAY → FRIDAY

---

## date-fns Requirements

Use ONLY date-fns for time manipulation:

- setHours
- setMinutes
- addHours
- isBefore

---

## Seed Example

```ts
await prisma.lesson.create({
  data: {
    title: subject.name,
    schoolId,
    classId,
    subjectId,
    teacherId,
    day: 'MONDAY',
    startTime,
    endTime,
  },
});
```

---

## What NOT to Do

- No raw SQL
- No hardcoded dates
- No redefining Prisma client
- No fake IDs

---

## Migration Express/GraphQL → NestJS (plan concis)

Objectif: fournir à un agent IA une checklist actionnable et des recommandations pour migrer progressivement l'API existante (Express + GraphQL) vers une application NestJS sans interrompre le service.

- **Contexte à inspecter**: consultez les points d'entrée et dossiers suivants avant de commencer: [apps/api/src/server.ts](apps/api/src/server.ts), [apps/api/src/graphql](apps/api/src/graphql), [apps/api/src/routes](apps/api/src/routes), et [apps/api/package.json](apps/api/package.json).

- **Principes**:
  - Migrer par modules fonctionnels (auth, users, graphql, socket, jobs).
  - Favoriser une migration incrémentale en faisant tourner les deux serveurs côte à côte si nécessaire.
  - Préserver les comportements existants (sessions PostgreSQL, passport strategies, sockets, rate limiting).

- **Checklist de migration**:
  1. Scaffold: créer un nouveau projet NestJS dans `apps/api-nest` (ou `apps/api` si on veut remplacer directement), initialiser TypeScript, lint, build et script `dev`.
  2. GraphQL: utiliser `@nestjs/graphql` (Code‑First recommandé) ou Schema‑First si vous conservez le schéma existant. Configurer `GraphQLModule.forRoot` avec `ApolloDriver` et `autoSchemaFile` si code-first.
  3. Auth: migrer `passport` via `@nestjs/passport` et `PassportStrategy` + Guards. Conserver la session express (`express-session`) si nécessaire en appelant `app.use(session(...))` dans `main.ts` ou migrer vers JWT guards.
  4. Sockets: implémenter les Gateways Nest (`@WebSocketGateway`) et réutiliser l'initialisation socket existante (adapter la configuration CORS/Origins).
  5. Middlewares: transformer middlewares Express en providers/middleware Nest et appliquer globalement dans `main.ts` (`helmet`, `cors`, `lusca` si besoin).
  6. Rate limiting: réutiliser `rate-limiter-flexible` ou adopter `@nestjs/throttler` si plus simple pour l'app.
  7. Sessions & Store: continuer à utiliser `connect-pg-simple` avec `express-session` si les sessions existantes doivent être compatibles pendant la migration.
  8. Routes REST: migrer route par route en créant Controllers Nest et en testant chaque endpoint.
  9. Tests & CI: ajouter scripts `build`, `start`, `dev` et adapter CI pour builder l'app Nest. Migrer progressivement les tests (unit/integration).
  10. Déploiement: mettre à jour Dockerfile / docker‑compose pour supporter la nouvelle image ou orchestration side‑by‑side.

- **Stratégies d'exécution incrémentale**:
  - Option A (side-by-side): déployer `apps/api-nest` sur un port différent, mettre en place une route/proxy (Nginx ou reverse-proxy) pour rediriger certains préfixes vers le nouveau service.
  - Option B (cohabitation dans same process): démarrer Nest derrière Express en adaptant `server.ts` pour instancier Nest comme un middleware (possible mais plus complexe).

- **Points d'attention spécifiques au repo**:
  - `src/server.ts` initialise Passport, sessions PostgreSQL et sockets — prioriser la portabilité de ces éléments.
  - `graphql` est protégé par `isAuthenticated` et un rate limiter ; reproduire ces Guard + Interceptor dans Nest.
  - Vérifier l'usage de modules partagés (`@stackschool/db`, `@stackschool/shared`) et les adapter comme providers Nest (injection de dépendances).

- **Propositions de personnalisations d'agents**:
  - Créer un skill `migrate-express-to-nest` pour générer squelettes de modules/Controllers/Resolvers basés sur la structure existante.
  - Ajouter un hook `check-session-compatibility` pour valider les sessions PostgreSQL lors des tests d'intégration.

Si vous voulez, je peux générer le squelette initial `apps/api-nest` et migrer un module (par exemple `auth`) comme preuve de concept.
