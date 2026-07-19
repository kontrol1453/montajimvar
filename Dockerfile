# Montajım Var - Production Dockerfile
# Multi-stage build for Next.js 16 (App Router) with Prisma

# ============================================
# STAGE 1: Base / Dependencies
# ============================================
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    openssl \
    ca-certificates

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# ============================================
# STAGE 2: Builder - Install deps & build
# ============================================
FROM base AS builder

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
COPY .env.build .env
RUN npm run build

# ============================================
# STAGE 3: Runner - Production runtime
# ============================================
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma/

# Copy node_modules for Prisma (only production deps needed at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the Next.js server
CMD ["node", "server.js"]
