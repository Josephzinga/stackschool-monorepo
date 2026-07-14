FROM node:lts-slim AS base
RUN npm install -g pnpm@11.9.0 nx
WORKDIR /repo

FROM base AS builder
COPY pnpm-workspace.yaml package.json  tsconfig.base.json ./
COPY apps/service-operations ./apps/service-operations
COPY packages/messaging ./packages/messaging
COPY packages/contracts  ./packages/contracts
RUN pnpm install --no-frozen-lockfile
RUN pnpm prisma generate
RUN npx nx build service-operations

FROM node:lts-slim AS runner
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/service-operations ./apps/service-operations
COPY --from=builder /repo/packages/messaging ./packages/messaging
COPY --from=builder /repo/packages/contracts ./packages/contracts
COPY --from=builder /repo/service-operations/package.json ./service-operations/package.json
CMD ["node", "apps/service-operations/dist/main.js"]
