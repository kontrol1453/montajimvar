# Caching Strategy

## Current State

| Layer | Status | Detail |
|-------|--------|--------|
| Browser cache | ❌ | No Cache-Control on most responses |
| CDN cache | ❌ | No s-maxage headers |
| Application cache | ❌ | No in-memory or Redis cache |
| Prisma query cache | ❌ | No caching configured |
| ISR | ❌ | All pages force-dynamic |
| Font cache | ❌ | External font, no preload |

## Recommended Strategy

### 1. Static Pages — ISR
```ts
// Pages that change rarely: /gizlilik, /kullanim-kosullari, /yardim, /kurumsal
export const revalidate = 86400; // 24 hours
export const dynamic = 'force-static';
```

### 2. Sitemap — Response Cache
```ts
// sitemap.ts — server-side cache
const CACHE_TTL = 3600; // 1 hour
// Use a simple in-memory Map or Vercel KV
```

### 3. Public API — CDN Cache
```ts
// /api/categories, /api/blog
headers: {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}
```

### 4. Image Cache
```ts
// next.config.js
images: {
  minimumCacheTTL: 86400,
  // formats: ['image/avif', 'image/webp'] already default
}
```

### 5. Prisma Middleware Cache
```ts
// lib/prisma-cache.ts — optional, for heavy aggregations
// Cache dashboard queries for 30s
```

## Implementation Priority

1. ISR on static pages (legal, about, help) — immediate win
2. Cache-Control headers on public API routes
3. Sitemap caching
4. Image TTL configuration
5. Prisma query caching for admin dashboard
