FROM node:lts-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./

COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
COPY packages/db ./packages/db
COPY apps/web ./apps/web

RUN pnpm --filter @stackschool/web install --no-frozen-lockfile

EXPOSE 3000

# Solution simple et fiable
WORKDIR /app/apps/web
CMD ["pnpm", "dev"]