# Performance Report — Montajım Var

> **Generated:** 2026-07-16
> **Stack:** Next.js 16.2.9 · React 19.2.3 · Tailwind CSS v4 · Prisma 5.22 · PostgreSQL (NeonDB)
> **Deployment:** Vercel

---

## Overview

Montajım Var is a full-featured marketplace platform with public pages, authenticated dashboards, admin panels, push notifications, service worker caching, and Leaflet-based maps. The app leans heavily on Server Components but has several performance bottlenecks: **force-dynamic on every route**, **no ISR**, **no data cache layer**, **Google Fonts via `<link>` instead of `next/font`**, **large client bundles** (Framer Motion + Leaflet), and **unoptimized images**.

---

## Bundle Size Analysis

### Dependencies

| Package | Estimated Size | Where Used | Notes |
|---------|---------------|-----------|-------|
| `framer-motion` | ~150 KB (min) | DashboardLayout, mobile nav, corporate pages | 6 files import it directly |
| `leaflet` + `react-leaflet` | ~50 KB (min) | SearchMap, CompanyMap | Needed only on search/firma pages |
| `lucide-react` | tree-shakeable | ~68 files importing various icons | Many admin pages import 5-10+ icons each |
| `date-fns` | ~20 KB (tree-shakeable) | Various components | |
| `sonner` | ~5 KB | Toast notifications | |

### Client Components ("use client")

**100+ files** use `"use client"`. Notable large client components:

- `Navbar.tsx` — 381 lines, imports 12 lucide icons, uses `useSession`, `signOut`, dropdown state
- `SearchForm.tsx` — 362 lines, imports 3 lucide icons, full form state + URL sync
- `DashboardLayout.tsx` — 179 lines, imports 14 lucide icons + `framer-motion`
- `SearchViewToggle.tsx` — client component for list/map toggle
- `AdminShell.tsx` — imports 10+ lucide icons + admin sidebar/header logic
- Various admin page files are entirely `"use client"`

**Problem:** The dashboard page (`src/app/(public)/dashboard/page.tsx`) imports `framer-motion` directly in a Server Component file — but since it's used in JSX, it forces the entire page into a client bundle.

### Impact

- Large initial JS payload for dashboard pages (Framer Motion + Lucide)
- No route-level code splitting for admin vs public pages
- Leaflet bundled even on non-map pages

---

## Image Optimization

### Current State

- **Remote patterns configured:** `*.supabase.co`, `lh3.googleusercontent.com`, `*.googleusercontent.com`
- **No additional image optimization config** — no `formats`, `deviceSizes`, `imageSizes`, `minimumCacheTTL`, or `loader` settings
- **Logo/hero images** served from Supabase storage without responsive sizing
- `next.config.js` image config is minimal:

```js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "*.supabase.co" },
    { protocol: "https", hostname: "lh3.googleusercontent.com" },
    { protocol: "https", hostname: "*.googleusercontent.com" },
  ],
},
```

### Issues

- No `next/image` optimization for profile images from Supabase
- No AVIF/WebP format negotiation
- No responsive `srcSet` generation
- No lazy loading configuration beyond Next.js defaults
- Missing device/image size policies — Next.js falls back to defaults (640/750/828/1080/1200/1920/2048/3840)
- `minimumCacheTTL` not set — optimized images expire from cache aggressively

### Usage

- `Navbar.tsx` uses `next/image` for the logo
- Profile images reference Supabase URLs directly
- Blog cover images, city page images all from Supabase

---

## Font Loading Strategy

### Current State

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz@14..32&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap" />
```

Fonts are loaded via `<link>` in the root layout (`src/app/layout.tsx`).

### Problems

| Issue | Severity |
|-------|----------|
| **Not using `next/font`** — no self-hosting, no preload optimization | High |
| **Inter weight range unclear** — only `opsz` param specified, no weight range | Medium |
| **Manrope loads 4 weights** (500, 600, 700, 800) — all downloaded even if unused | Medium |
| `display=swap` is set, so FOUT occurs (text visible in fallback font, then swaps) | Low |
| No `next/font` means no `size-adjust` fallback, increasing CLS | Medium |

### Impact

- External Google Fonts request blocks rendering
- Render-blocking CSS download adds ~200-400ms to FCP (varies by connection)
- No font preloading — font discovery happens after CSS is parsed
- CLS from font swap is likely measurable (especially for Manrope headings)

---

## Rendering Strategy

### Current State

**16 pages** use `export const dynamic = "force-dynamic"`:

| Route | Reason |
|-------|--------|
| `/(public)/page.tsx` (Home) | `force-dynamic` — runs 5 Prisma queries |
| `/(public)/ara/page.tsx` (Search) | Server-side Prisma + dynamic params |
| `/(public)/[city]/[service]/page.tsx` | Dynamic city/service pages |
| `/(public)/blog/page.tsx` + `blog/[slug]/page.tsx` | Blog pages |
| `/(public)/yazilar/page.tsx` + `yazilar/[slug]/page.tsx` | Blog-alt pages |
| `/(public)/islerim/page.tsx`, `isler/[id]/page.tsx` | Job pages |
| `/(public)/is-ver/page.tsx`, `is-ilanlari/page.tsx` | Job creation/listing |
| `/(public)/dashboard/teklifler/page.tsx` | Dashboard offers |
| `/(public)/dashboard/takvim/page.tsx` | Dashboard calendar |
| `/admin/kullanicilar/page.tsx`, `kullanicilar/[id]/page.tsx` | Admin user pages |
| `/admin/komuta-merkezi/page.tsx` | Admin command center |
| `/admin/isler/[id]/page.tsx`, `firmalar/[id]/page.tsx`, `/admin/crm/page.tsx` | Admin pages |

### Problems

- **Zero static pages** — every route is dynamic
- **No ISR** — `revalidate` is never used
- **No `generateStaticParams`** — city pages, blog posts, admin detail pages all render on every request
- **Homepage re-queries on every visit** — 5 Prisma calls + full Server Component render despite data changing rarely
- **Blog/city pages re-render on every request** — content is mostly static but forced dynamic
- **Dashboard runs 6+ Prisma queries** on every page load (for authenticated users only, but still server-costly)
- **Admin pages have no caching** — every admin visit hits the database

### Missed Opportunities

| Optimization | Pages That Would Benefit |
|-------------|--------------------------|
| `generateStaticParams` + ISR | Blog posts, city/[service] pages, sehir/[city] pages |
| `revalidate = 60/300` | Homepage (data changes infrequently) |
| `revalidate = 30` | Search page (category list is static) |
| Static generation | Legal pages (gizlilik, kullanim-kosullari, kvkk, cerez, etc.) — these are fully static |

---

## Database Performance

### Query Patterns

| Page | Queries |
|------|---------|
| Homepage | 5 parallel: `profile.count()`, `profile.findMany(distinct city)`, `profile.aggregate(ratingAvg)`, `category.count()`, `category.findMany(parents with children)` |
| Search page | 2 prisma `findMany` + `count` with complex `where` clauses |
| Dashboard | 6+ parallel: message counts, profile lookup, user record, budget aggregation, analytics queries |
| Admin pages | Varies — typically 3-8 queries per page |

### Indexing

From `prisma/schema.prisma`, explicit indexes exist on:

- `PushSubscription.userId`
- `ProfileViewLog(profileId, createdAt)` and `ProfileViewLog(profileId)`
- `AdminAuditLog(adminId)`, `AdminAuditLog(entity, entityId)`, `AdminAuditLog(createdAt)`
- `ArtisanVideo(userId)`

**Missing indexes** (based on query patterns):

| Table | Columns | Justification |
|-------|---------|---------------|
| `Profile` | `city` | Search page filters by `city` |
| `Profile` | `ratingAvg` | Search sorting by `ratingAvg` |
| `Profile` | `isFeatured` | Search ordering `isFeatured: "desc"` |
| `Profile` | `createdAt` | Search sorting by `createdAt` |
| `Profile` | `premiumUntil` | Search ordering by `premiumUntil` |
| `Profile` | `(city, isFeatured, premiumUntil, createdAt)` | Composite index for search query |
| `Category` | `parentId` | Homepage query for parent categories |
| `Category` | `isActive` | Filtered in homepage/category queries |
| `Message` | `receiverId, isRead` | Dashboard unread count |
| `Message` | `senderId` | Analytics message count |
| `Review` | `profileId` | Dashboard review count |
| `Favorite` | `profileId` | Dashboard favorite count |
| `Job` | `customerId, status` | Dashboard budget query |
| `ProfileCategory` | `profileId` | Profile join queries |
| `ProfileCategory` | `categoryId` | Category-based search |

### Caching

- **No Redis/Memcached** — every query hits PostgreSQL directly
- **No Prisma `cache` / result caching** — every Server Component re-fetches
- **No React `cache()` usage** — no request deduplication within the same render
- **No data cache in Next.js** — `next: { revalidate }` not used anywhere

### Search Query Concern

The search page builds complex `OR`/`AND` conditions with `contains` + `mode: "insensitive"`. These translate to PostgreSQL `ILIKE '%term%'` queries which cannot use standard B-tree indexes. On large datasets, this will cause sequential scans.

---

## Caching Strategy

### Current Configuration

| Layer | Status |
|-------|--------|
| **Service Worker** | Active — caches `/_next/static` (cache-first), navigations (stale-while-revalidate), other assets (cache-first with network update) |
| **HTTP Cache-Control** | Blog and `/yazilar` routes explicitly set `no-cache, no-store, must-revalidate` + `CDN-Cache-Control: no-cache` |
| **Next.js Data Cache** | Not configured |
| **Prisma / DB cache** | None |
| **React cache()** | Not used |
| **Redis / external cache** | None |

### Problems

1. **Blog routes opt out of CDN caching** — despite being mostly static content, `/blog` and `/yazilar` are set to `no-cache`. Since these pages also have `force-dynamic`, every blog visit hits the server + database.

2. **No stale-while-revalidate on non-blog routes** — no CDN cache headers for homepage, search, or other public pages.

3. **Service Worker doesn't cover API routes** — explicitly skipped (`if (url.pathname.startsWith("/api/")) return`). API responses are never cached client-side.

4. **Service Worker cache name is `montajimvar-v3`** — suggests the cache has been versioned at least 3 times (good practice), but no TTL/expiry logic for cached responses.

5. **Navigation SW strategy is network-first** — no offline support beyond the static `/offline.html` fallback. If network is slow, the SW waits for the network instead of serving a stale cached page.

---

## Client-Side JavaScript

### Bundle Composition

The per-page JS bundle is inflated by:

1. **Framer Motion** (~150 KB) — pulled in by DashboardLayout, MobileBottomNav, corporate page components, and the dashboard page. Every dashboard page download includes Framer Motion.

2. **Leaflet** (~50 KB) — loaded on search page via `SearchViewToggle`/`SearchMap`. Even the list view downloads the map library.

3. **Lucide React** — imported in 68+ files. Each admin page typically imports 5-15 icons. Tree-shaking works at build time, but many admin pages are entirely client components.

4. **SearchForm (362 lines)** — full client component with form state, URL sync, city select, category filter, rating filter, sort options. Runs on every search page visit.

### "use client" Spread

**100+ client component files** across the project. Key concerns:

- **Server Components importing client components at the top level** — the dashboard page (`src/app/(public)/dashboard/page.tsx`) imports `motion` directly, pulling the entire Framer Motion bundle
- **Admin pages are universally client-rendered** — most admin pages use `"use client"` at the file level, not just for interactive islands
- **No lazy loading (`dynamic()`)** for below-fold components, heavy third-party libraries (Leaflet), or admin-only components
- **All auth pages** (giris, kayit, sifre-unuttum, sifre-sifirla, email-dogrula) are `"use client"` — these don't typically need client-side rendering

### Loading Strategy

- **No component-level code splitting** via `next/dynamic`
- **No route group splitting** for admin vs public bundles
- **No preload/prefetch strategy** beyond Next.js defaults
- **All client components on a page are in one JS bundle** — no streaming/chunking optimization

---

## CSS Bundle

### Current State

- Tailwind CSS v4 (JIT mode) — generates only used classes
- `globals.css` = 444 lines including:
  - Design system tokens (`@theme` with ~80 custom properties)
  - Base layer (html, body, selection, reduced-motion, focus-visible)
  - Utility classes (`.container-app`, `.card`, `.btn-primary`, `.btn-secondary`, `.btn-accent`)
  - Admin design system (~40 CSS custom properties + utility classes)
  - Animation keyframes (5 animations)
  - Hero section styles

### Analysis

| Metric | Estimate |
|--------|----------|
| Total CSS (uncompressed) | ~15-20 KB |
| Total CSS (minified + gzip) | ~4-6 KB |
| Unused CSS (potential) | Low — Tailwind JIT removes unused |
| Animation keyframes | 5 custom + Tailwind's built-ins |
| Admin tokens | ~40 custom properties, likely included in all page bundles |

Tailwind v4 does an excellent job with JIT compilation — the CSS bundle is probably lean. However, admin-specific tokens and utility classes are served to public pages too (or vice versa). Since there's no CSS route-group separation, the full `globals.css` loads on every page.

---

## Performance Score Estimate

Based on typical Lighthouse 2026 scoring for a Next.js app with these characteristics:

| Metric | Estimated Score | Notes |
|--------|----------------|-------|
| **First Contentful Paint (FCP)** | ~1.8-2.5s | External Google Fonts + no font preload + heavy client JS |
| **Largest Contentful Paint (LCP)** | ~2.5-4.5s | `force-dynamic` pages wait for server response + DB queries before sending HTML |
| **Interaction to Next Paint (INP)** | ~100-250ms | Framer Motion animations + heavy admin client components |
| **Cumulative Layout Shift (CLS)** | ~0.1-0.3 | Font swap (Inter → system → Inter) + no `size-adjust` |
| **Speed Index** | ~2.5-4.0s | SSR with DB on every request |
| **Time to First Byte (TTFB)** | ~500-2000ms | Serverless function cold starts + DB queries |
| **Total Blocking Time (TBT)** | ~150-400ms | Large client bundle (Framer Motion + Leaflet) |
| **Lighthouse Performance** | **55-70 / 100** | Significant optimization headroom |

### Vercel-Specific Factors

- Serverless function cold starts add 500-2000ms to TTFB on infrequently visited pages
- Blog/city pages (cold start + DB query + `force-dynamic`) are the worst offenders
- No ISR means every visit triggers a full Serverless Function invocation

---

## Critical Issues

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| C1 | **`force-dynamic` on 16 pages with no ISR** | Every visit = server render + DB query; no caching | **High** — remove `force-dynamic` where possible, add `revalidate` |
| C2 | **Google Fonts via `<link>` not `next/font`** | External render-blocking request; no preload; CLS from font swap | **Low** — switch to `next/font` |
| C3 | **No database indexes on key query columns** | Sequential scans on search queries as data grows; slow dashboards | **Medium** — add composite indexes |
| C4 | **No data caching layer (Redis/Prisma/React cache)** | Every Server Component re-fetches; no deduplication | **Medium** — implement Prisma `cache` + React `cache()` |
| C5 | **Dashboard page pulls Framer Motion into Server Component** | Forces all dashboard pages to download ~150 KB for animations | **Low** — wrap motion components in a thin client wrapper |

---

## High Priority Issues

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| H1 | **No ISR on blog/city pages** | Content that changes weekly is rendered on every request | **Medium** — add `revalidate: 3600` + `generateStaticParams` |
| H2 | **Search page has no pagination caching** | Every search page variant = fresh DB query with `ILIKE` scans | **Medium** — add `stale-while-revalidate` CDN headers + Prisma `result` cache |
| H3 | **Admin pages entirely client-rendered** | No SSR for admin = slower initial load; no SEO needed but bundle is large | **Medium** — split admin into route group with separate bundle |
| H4 | **No image size/quality optimization config** | Larger-than-necessary images served; no WebP/AVIF negotiation | **Low** — configure `formats`, `deviceSizes`, `minimumCacheTTL` |
| H5 | **100+ "use client" files** | Excessive client-side JS; many could be Server Components with client islands | **High** — audit and convert |

---

## Medium Priority Issues

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| M1 | **Search `ILIKE` queries don't scale** | At 10K+ profiles, `contains` + `mode: "insensitive"` becomes slow | **High** — add PostgreSQL `pg_trgm` extension + GIN index |
| M2 | **No component-level lazy loading** | Leaflet (~50 KB) loads even in list view; below-fold sections load eagerly | **Low** — wrap Leaflet + heavy sections in `next/dynamic(..., { ssr: false })` |
| M3 | **21 missing database indexes** | Query performance degrades linearly with data growth | **Medium** — add indexes defined in analysis above |
| M4 | **Homepage runs 5 DB queries with no cache** | Every homepage visit = 5 Prisma queries; data changes infrequently | **Low** — use React `cache()` + `revalidate: 300` |
| M5 | **Blog routes set `no-cache` on CDN** | Blog content is mostly static but never cached at edge | **Low** — change to `stale-while-revalidate` with 1-hour stale |
| M6 | **Route-level code splitting not configured** | Admin CSS tokens sent to public pages; public components sent to admin | **Medium** — use route groups more aggressively |

---

## Low Priority Issues

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| L1 | **Manrope loads 4 weights** | All weights downloaded even if some unused on certain pages | **Low** — audit Manrope weight usage; reduce to 2-3 weights |
| L2 | **No `preload`/`prefetch` hints for critical resources** | Browser discovers resources late in the loading sequence | **Low** — add `<link rel="preload">` for hero image + critical CSS |
| L3 | **Service Worker has no TTL/expiry logic** | Cached responses persist indefinitely until SW version change | **Low** — add `max-age` to cache.put responses |
| L4 | **No streaming/Suspense boundaries** | Full page waits for all data before sending HTML | **Low** — wrap slow data fetches in `<Suspense>` with loading fallbacks |
| L5 | **Custom animations in CSS + Framer Motion doubling** | CSS keyframes for fade-in/scale-in + Framer Motion for same effects | **Low** — consolidate on one animation strategy |
| L6 | **Legal pages are dynamic** | Gizlilik, KVKK, kullanim-kosullari are static content but not cached | **Trivial** — add `generateStaticParams` or `revalidate` |

---

## Recommendations

Ordered by impact-to-effort ratio:

### 1. Switch Google Fonts to `next/font` (Critical C2)
**Impact:** High · **Effort:** Low

```tsx
// src/app/layout.tsx
import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
});
```
- Eliminates external font request (self-hosted via Vercel CDN)
- Enables `font-display: optional` (avoids FOUT/FOIT)
- `size-adjust` fallback reduces CLS
- Automatic preloading of font files

### 2. Add ISR + Remove `force-dynamic` Where Possible (Critical C1)
**Impact:** Very High · **Effort:** Medium

| Route | Strategy |
|-------|----------|
| Homepage | `revalidate: 300` (5 min) — remove `force-dynamic` |
| Blog list | `revalidate: 3600` (1 hr) — remove `force-dynamic` |
| Blog post | `generateStaticParams` + `revalidate: 3600` |
| City/service pages | `generateStaticParams` + `revalidate: 86400` (24 hr) |
| Legal pages | `export const dynamic = "force-static"` — never changes |
| Search | Keep dynamic (user-specific) but add CDN `stale-while-revalidate` |
| Dashboard | Keep dynamic (auth-protected) — optimize queries instead |
| Admin | Keep dynamic — no cache benefit for admin pages |

### 3. Add Database Indexes (Critical C3)
**Impact:** High · **Effort:** Medium

Add the following to `prisma/schema.prisma`:

```prisma
model Profile {
  // ...existing fields...
  @@index([city])
  @@index([ratingAvg])
  @@index([isFeatured])
  @@index([premiumUntil])
  @@index([city, isFeatured, premiumUntil, createdAt])
}

model Message {
  // ...existing fields...
  @@index([receiverId, isRead])
  @@index([senderId])
}

model Category {
  // ...existing fields...
  @@index([parentId])
  @@index([isActive])
}

model Review {
  // ...existing fields...
  @@index([profileId])
}
```

Then create a migration: `npx prisma migrate dev --name add-performance-indexes`

### 4. Add Query Caching Layer (Critical C4)
**Impact:** High · **Effort:** Medium

```tsx
// src/lib/cache.ts
import { cache } from "react";

export const getCachedHomeData = cache(async () => {
  const [profileCount, cities, ratingAgg, categoryCount, parentCategories] =
    await Promise.all([...]);
  return { profileCount, ... };
});
```

And for Prisma:

```tsx
// Use Prisma's built-in result caching with next: { revalidate }
// Or add a simple in-memory cache for frequently accessed data
```

### 5. Lazy-Load Leaflet & Heavy Components (Medium M2)
**Impact:** Medium · **Effort:** Low

```tsx
import dynamic from "next/dynamic";

const SearchMap = dynamic(() => import("@/components/SearchMap"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});
```

### 6. Add PostgreSQL Full-Text Search (Medium M1)
**Impact:** Medium · **Effort:** High

Replace `contains` + `mode: "insensitive"` with:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_profile_company_name_trgm ON "Profile" USING GIN (companyName gin_trgm_ops);
CREATE INDEX idx_profile_description_trgm ON "Profile" USING GIN (description gin_trgm_ops);
```

Update Prisma queries to use `search` (full-text) or raw SQL for the search endpoint.

### 7. Configure Image Optimization (High H4)
**Impact:** Medium · **Effort:** Low

```js
// next.config.js
images: {
  formats: ["image/avif", "image/webp"],
  deviceSizes: [480, 640, 768, 1024, 1280, 1536],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 86400, // 24 hours
  remotePatterns: [
    { protocol: "https", hostname: "*.supabase.co" },
    { protocol: "https", hostname: "*.googleusercontent.com" },
  ],
},
```

### 8. Reduce "use client" Usage (High H5)
**Impact:** Medium · **Effort:** High

- Convert auth pages to Server Components with client-only form components
- Create thin client wrappers for Framer Motion animations instead of importing `motion` directly
- Keep admin pages as route group with separate bundle, but extract data fetching to Server Components
- Use `dynamic()` for interactive elements within otherwise static pages

### 9. Add Suspense Boundaries (Low L4)
**Impact:** Low-Medium · **Effort:** Low

```tsx
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div>
      <HeroV5 />
      <Suspense fallback={<MetricsSkeleton />}>
        <VerifiedMetricsWrapper />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse" />}>
        <BlogSection />
      </Suspense>
    </div>
  );
}
```

This improves TTFB and Speed Index by streaming content as it becomes available.

---

## Summary

| Area | Current State | Target |
|------|--------------|--------|
| TTFB | 500-2000ms | <300ms (with ISR) |
| LCP | 2.5-4.5s | <2.0s |
| FCP | 1.8-2.5s | <1.2s (with next/font) |
| Lighthouse Score | ~55-70 | 85+ |
| DB Queries per Page | 5-8 | 1-3 (with cache) |
| Client Bundle (Dash) | ~200-250 KB | ~80-100 KB |
| Client Bundle (Admin) | ~200-300 KB | ~100-150 KB |

### Quick Wins (Estimated < 2 hours)

1. Switch to `next/font` (C2) — ~30 min
2. Add `revalidate: 300` to homepage (C1) — ~5 min
3. Add image format/size config (H4) — ~10 min
4. Lazy-load Leaflet on search page (M2) — ~15 min
5. Add `cache()` to homepage data fetch (C4/M4) — ~15 min
6. Add Suspense boundaries to homepage (L4) — ~20 min

### Week-Long Projects

1. Full ISR rollout across all public pages (C1/H1)
2. Database indexing migration + `pg_trgm` full-text search (C3/M1)
3. Admin bundle split + route group optimization (H3/H5)
4. "use client" audit — convert 50% to Server Components (H5)
