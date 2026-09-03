# StackSchool

Plateforme SaaS de gestion scolaire, construite en architecture microservices avec GraphQL fédéré et messagerie asynchrone.

## Stack technique

- **Backend** : NestJS (TypeScript), architecture microservices
- **API** : GraphQL avec Apollo Federation v2 (gateway) + REST ponctuel (auth interne)
- **Message broker** : RabbitMQ (communication inter-services, request-response et événements)
- **Bases de données** : PostgreSQL (une instance dédiée par microservice) via Prisma ORM
- **Cache / sessions** : Redis
- **Monorepo** : pnpm workspaces + Nx (build, cache, orchestration des tâches)
- **Frontend** : Next.js (web), Expo (mobile) — hors périmètre backend de ce document

## Architecture

```
                     ┌─────────────┐
   Client (web/mobile) ──▶  Gateway  │  ← seul point d'entrée public (GraphQL + REST auth)
                     └──────┬──────┘
                            │ Apollo Federation (GraphQL) + RabbitMQ (commandes/événements)
        ┌───────────┬───────┴───────┬───────────────┐
        ▼           ▼               ▼               ▼
  service-auth  service-core  service-academic  service-operations
        │           │               │               │
    auth_db      core_db       academic_db    operations_db
```

Chaque microservice possède sa propre base PostgreSQL — aucune base n'est partagée entre services. Les échanges de données entre services passent soit par RabbitMQ (commandes typées, événements), soit par résolution d'entités Apollo Federation (GraphQL).

### Services

| Service              | Responsabilité                                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `gateway`            | Point d'entrée unique. Authentification (Passport, sessions Redis), composition du schéma GraphQL fédéré, routage REST pour l'auth |
| `service-auth`       | Comptes utilisateurs, credentials, vérification (email/téléphone), tokens                                                          |
| `service-core`       | Personnel enseignant, affectations, données RH scolaires                                                                           |
| `service-academic`   | Écoles, classes, matières, inscriptions, élèves                                                                                    |
| `service-operations` | Présences, notifications (WhatsApp/SMS), opérations transverses                                                                    |

### Principes clés

- **Le gateway est le seul service exposé publiquement.** Tous les autres services communiquent uniquement via le réseau Docker interne.
- **Aucun service ne fait confiance à une requête sans passer par le gateway** — un secret partagé (`GATEWAY_INTERNAL_SECRET`) protège les endpoints GraphQL internes.
- **Chaque service valide ses propres entrées**, indépendamment de ce que le gateway a déjà vérifié (défense en profondeur).
- **Les types Prisma ne sont jamais partagés entre services.** Les contrats inter-services (Zod, GraphQL) définissent des types indépendants, mappés explicitement depuis les modèles internes de chaque service.

## Démarrage rapide

### Prérequis

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### Installation

```bash
git clone <repo-url>
cd stackschool-monorepo
cp .env.example .env   # renseigner les variables (voir ci-dessous)
pnpm install
```

### Variables d'environnement principales

```bash
# Bases de données (une par service)
POSTGRES_AUTH_USER=...
POSTGRES_AUTH_PASSWORD=...
POSTGRES_AUTH_DB=...
# ... idem pour CORE, ACADEMIC, OPERATIONS

# RabbitMQ
RABBITMQ_USER=...
RABBITMQ_PASSWORD=...

# Sécurité inter-services
GATEWAY_INTERNAL_SECRET=...
SESSION_SECRET=...

JWT_SECRET=lsdmlsdsdm@@@@!
NEXT_PUBLIC_API_URL=http://api/4000
SESSION_SECRET=mmdmdmdmddmdm

POSTGRES_ACADEMIC_USER=...
POSTGRES_ACADEMIC_PASSWORD=...
POSTGRES_ACADEMIC_DB=...

POSTGRES_CORE_USER=...
POSTGRES_CORE_PASSWORD=...
POSTGRES_CORE_DB=...

POSTGRES_OPERATIONS_USER=...
POSTGRES_OPERATIONS_PASSWORD=...
POSTGRES_OPERATIONS_DB=...

RABBITMQ_USER=...
RABBITMQ_PASSWORD=...

MINIO_ROOT_USER=...
MINIO_ROOT_PASSWORD=...

GATEWAY_INTERNAL_SECRET=...


```

### Lancer l'infrastructure (bases, cache, broker)

```bash
docker compose up -d db auth_db core_db academic_db operations_db redis rabbitmq
```

### Lancer les microservices en développement (hors Docker, hot-reload)

```bash
npx nx run-many -t dev --projects=gateway,service-auth,service-core,service-academic,service-operations
```

> En développement local (hors conteneur), `RABBITMQ_URL` doit pointer vers `localhost:5672` plutôt que vers le hostname Docker `rabbitmq`.

### Lancer tout en conteneurs (y compris les services applicatifs)

- **il vaut mieux d'exécuté les serveurs dans l'hôte**

```bash
docker compose up -d
```

Le gateway est alors accessible sur `http://localhost:3000`.

## Structure du monorepo

```
apps/
  web/                  # Next.js (client web)
  mobile/               # Expo (client mobile)
  gateway/              # Point d'entrée : GraphQL fédéré + REST auth
  service-auth/
  service-core/
  service-academic/
  service-operations/

packages/
 contract/ (Schéma zod, types et logique commun)
 messaging/ (Partage de la logique serveur Nestjs et transport entre service)
```

## Développement

```bash
# Builder un service précis (et ses dépendances dans le bon ordre)
npx nx build service-auth

# Builder tout le monorepo
npx nx run-many -t build

# Ne builder que ce qui a changé depuis la branche de référence
npx nx affected -t build

# Générer le client Prisma d'un service après modification du schéma
pnpm --filter @stackschool/db-auth exec prisma generate

# Créer une migration
pnpm --filter @stackschool/db-auth run migrate
```

## Statut du projet

Projet en développement actif — architecture microservices en cours de finalisation (Federation GraphQL, workflows d'inscription multi-rôles, notifications asynchrones).

## Licence

Propriétaire — tous droits réservés.
