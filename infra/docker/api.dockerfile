FROM node:lts-slim

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
RUN apt-get update -y && apt-get install -y openssl
COPY packages/db ./packages/db
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN pnpm install --no-frozen-lockfile

EXPOSE 4001 51212 

# Solution simple et fiable
WORKDIR /app/apps/api
CMD ["pnpm", "run", "dev"]
