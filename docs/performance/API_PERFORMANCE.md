# API Performance Audit

## Endpoints Analyzed

| Endpoint | Pattern | Response Size | Caching | Status |
|----------|---------|---------------|---------|--------|
| `GET /api/jobs` | Public + Admin | Large | None | Needs pagination |
| `GET /api/profiles` | Public + Admin | Large | None | OK (paginated) |
| `GET /api/admin/summary` | Admin only | ~2 KB | None | OK |
| `GET /api/admin/audit-logs` | Admin only | Paginated | None | OK |
| `GET /api/admin/search` | Admin only | Small | None | OK |
| `GET /api/sitemap` | Public | Very large | None | **CRITICAL** |
| `GET /api/categories` | Public | Small | None | Should cache |
| `POST /api/analyze` | AI | Medium | None | OK |

## Critical Issues

### 1. No response caching
Every public API call hits the database. No `Cache-Control` headers on any endpoint.

### 2. No rate limiting
No middleware-level rate limiting. Potential for abuse on search endpoints.

### 3. Missing compression
No explicit gzip/brotli configuration (Vercel handles this but should verify).

### 4. Sitemap query exhaustion
`GET /api/admin/summary` runs 15+ parallel Prisma queries. Should cache for 30-60s.

## Recommendations

### Cache Headers
```ts
// Add to public API responses
new Response(body, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
})
```

### Rate Limiting
```ts
// lib/rate-limit.ts sketch
const rateLimit = new Map<string, { count: number; reset: number }>();
export function checkRateLimit(key: string, max: number, window: number): boolean;
```

### Response Compression
Verify Vercel automatically handles brotli. If not, add middleware.

### API Response Size
- Add field selection (sparse fieldsets) to list endpoints
- Default limit to 20, max 100
- Add `?fields=id,title` query parameter support
