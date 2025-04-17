FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# COPY package.json pnpm-lock.yaml ./
# RUN npm install -g corepack@latest && corepack enable pnpm && pnpm install --frozen-lockfile
COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]