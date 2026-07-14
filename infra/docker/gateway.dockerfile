FROM node:lts-slim AS base
RUN npm install -g pnpm@11.9.0 nx
WORKDIR /repo

FROM base AS builder
COPY pnpm-workspace.yaml package.json  tsconfig.base.json ./
COPY apps/gateway ./apps/gateway
COPY packages/messaging ./packages/messaging
COPY packages/contracts  ./packages/contracts
RUN pnpm install --no-frozen-lockfile
RUN npx nx build gateway

FROM node:lts-slim AS runner
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/gateway ./apps/gateway
COPY --from=builder /repo/packages/messaging ./packages/messaging
COPY --from=builder /repo/packages/contracts ./packages/contracts
COPY --from=builder /repo/gateway/package.json ./gateway/package.json
CMD ["node", "apps/gateway/dist/main.js"]
