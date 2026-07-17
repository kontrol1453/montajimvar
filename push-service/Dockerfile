# Push Service Dockerfile
# Multi-stage build for Express + better-sqlite3

# ============================================
# STAGE 1: Base
# ============================================
FROM node:20-alpine AS base

RUN apk add --no-cache \
    dumb-init \
    python3 \
    make \
    g++ \
    sqlite-dev \
    openssl \
    ca-certificates

RUN addgroup -g 1001 -S nodejs && \
    adduser -S pushsvc -u 1001 -G nodejs

WORKDIR /app

COPY package*.json ./

# ============================================
# STAGE 2: Builder
# ============================================
FROM base AS builder

RUN npm ci

COPY . .

# ============================================
# STAGE 3: Runner
# ============================================
FROM base AS runner

ENV NODE_ENV=production

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R pushsvc:nodejs /app/data

COPY --from=builder --chown=pushsvc:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=pushsvc:nodejs /app/package*.json ./
COPY --from=builder --chown=pushsvc:nodejs /app/server.js ./
COPY --from=builder --chown=pushsvc:nodejs /app/db.js ./
COPY --from=builder --chown=pushsvc:nodejs /app/setup.js ./
COPY --from=builder --chown=pushsvc:nodejs /app/ecosystem.config.js ./

USER pushsvc

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "server.js"]