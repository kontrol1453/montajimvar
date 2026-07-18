# SEO Audit Report — Montajım Var

**Project:** Montajım Var (montajimvar.xyz)
**Date:** July 2026
**Platform:** Next.js 16 (App Router), Vercel (Edge/CDN)

---

## Summary

| Category | Status | Issues |
|----------|--------|--------|
| Metadata / Titles | ✅ Good | 0 |
| OpenGraph | ✅ Good | 1 minor |
| Twitter Cards | ⚠️ Partial | 2 |
| Structured Data (LD+JSON) | ✅ Good | 0 |
| Sitemap | ✅ Good | 0 |
| Robots.txt | ✅ Good | 0 |
| Canonical URLs | ⚠️ Partial | 1 |
| Heading Hierarchy | ⚠️ Needs Audit | 2 |
| Image Alt Text | ⚠️ Inconsistent | 1 |
| Internal Linking | ✅ Good | 0 |
| URL Structure | ✅ Good | 0 |
| Performance / Caching | ⚠️ Partial | 2 |

---

## Detailed Findings

### ✅ Metadata & Titles

- **Root layout** (`src/app/layout.tsx`): Title = *"Montajım Var - Profesyonel Montaj Platformu"*, description set. Manifest, appleWebApp, icons configured.
- **Homepage** (`src/app/(public)/page.tsx`): Overrides metadata with same title + OG-specific description. Correct pattern.
- **Search page** (`src/app/(public)/ara/page.tsx`): Dynamic `generateMetadata` based on query params (category, city). Dynamic title e.g. *"Mobilya - Firma Ara | Montajım Var"*.
- **Blog listing** (`src/app/(public)/blog/page.tsx`): Static metadata — *"Blog - Montajım Var"*.
- **Blog post** (`src/app/(public)/blog/[slug]/page.tsx`): Dynamic metadata using `metaTitle`/`metaDesc` from DB. Falls back to `title + " - Montajım Var Blog"`.
- **Company profile** (`src/app/(public)/firma/[id]/page.tsx`): Dynamic — *"{companyName} - {city} | Montajım Var"* with description truncation at 160 chars.
- **City pages** (`src/app/(public)/sehir/[city]/page.tsx`): Dynamic metadata via `generateMetadata`. Falls back to *"{cityName} Montaj Hizmetleri - Montajım Var"*.
- **City+Service pages** (`src/app/(public)/[city]/[service]/page.tsx`): Dynamic metadata with `metaTitle`/`metaDesc` from `CityServicePage` model.
- **Legal pages**: Static titles (gizlilik, kullanim-kosullari, kvkk, cerez, etc.).

**Verdict:** All major page types have proper metadata. Dynamic patterns scale with content.

### ✅ OpenGraph

- **Root layout** (`layout.tsx:30-37`): `og:title`, `og:description`, `og:type="website"`, `og:locale="tr_TR"`, `og:siteName="Montajım Var"`.
- **Homepage**: OG-specific description provided separately.
- **Company profile**: Full OG metadata including `og:type="profile"`, `og:url`, `og:image`.
- **Blog post**: OG image from `coverImage` when present.
- **City page**: OG title/description from `generateMetadata`.

**Verdict:** Well implemented. OG image URL format may need verification for absolute URLs.

### ⚠️ Twitter Cards

- **Present:** Only on `firma/[id]/page.tsx:52-56` — `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`.
- **Missing:** Root layout, homepage, blog, search, auth, legal pages.
- **Impact:** Twitter and many social platforms prefer `twitter:card` tags. Without them, link previews may degrade.
- **Fix:** Add Twitter Card metadata to the root layout metadata export so it applies globally, with page-level overrides where needed.

### ✅ Structured Data (LD+JSON)

- **WebSite** with `SearchAction` (`layout.tsx:73-94`): Correct schema with `potentialAction`/`SearchAction` targeting `/ara?q={search_term_string}`.
- **Organization** (`layout.tsx:95-108`): Name, URL, logo, description in Turkish.
- **CollectionPage** for city+service pages (`[city]/[service]/page.tsx:51-60`): `@type: CollectionPage` with `Service` and `areaServed`.
- **BreadcrumbList:** Not found in codebase — recommended for deep pages (firma/[id], blog/[slug]).

**Verdict:** SearchAction and Organization structured data are best practices. Add BreadcrumbList for pages deeper than 2 levels.

### ✅ Sitemap (`src/app/sitemap.ts`)

- **Dynamic** with `force-dynamic` — always fetches fresh data.
- **Routes included:**
  - Static: Home, /ara, /blog, /yardim, /gizlilik, /kullanim-kosullari, /auth/giris, /auth/kayit
  - Categories: `/ara?kategoriler={slug}` (priority 0.7)
  - Company profiles: `/firma/{id}` (priority 0.8, weekly)
  - Blog posts: `/blog/{slug}` (priority 0.6, monthly)
  - City/service pages: `/{slug}` (priority 0.6, monthly)
- **Base URL:** `process.env.NEXT_PUBLIC_APP_URL` with fallback to `https://montajimvar.xyz`.

**Verdict:** Comprehensive. Consider adding `lastModified` from actual content dates. Category pages use current date — should use content date.

### ✅ Robots.txt (`src/app/robots.ts`)

- **Disallowed:** `/dashboard/`, `/admin/`, `/api/` — correct.
- **Allowed:** `/` for all user agents.
- **Sitemap:** Points to `${baseUrl}/sitemap.xml`.

**Verdict:** Correct. No user-agent-specific rules (fine for indexing).

### ⚠️ Canonical URLs

- **Present:** Only in `firma/[id]/page.tsx:40-42` — `alternates.canonical`.
- **Missing:** Blog posts, city pages, search pages, legal pages.
- **Impact:** Duplicate content risk for pages accessible via multiple URL patterns (e.g., query param variations on `/ara`).
- **Fix:** Add `alternates.canonical` to all dynamic pages, especially `/ara` (many filter permutations) and blog posts.

### ⚠️ Heading Hierarchy

- **Homepage:** Uses `heading-xl`, `heading-lg`, `heading-md` classes. Must verify these map to `<h1>`–`<h3>` elements, not styled `<div>`s.
- **Search page:** Single `<h1>` — "Tüm Firmalar" (static). The dynamic category title is in the metadata only, not the visible `<h1>`.
- **Blog listing:** `<h1>` — "Montajım Var Blog". Post titles are `<h2>` — correct.
- **Blog post:** `<h1>` — post title. Body content uses `dangerouslySetInnerHTML` — heading hierarchy within HTML depends on editors.
- **Firma page:** Needs verification for `h1`—`h6` usage across detail sections.
- **Fix:** Audit every template for a single `<h1>`, no skipped levels, and semantic tags.

### ⚠️ Image Alt Text

- **Navbar avatar:** `alt=""` (decorative — correct).
- **Blog cover image:** `alt=""` (decorative — should be descriptive of the actual image content).
- **CompanyGallery, PortfolioGallery:** Not audited — alt text usage unknown.
- **Fix:** Audit all `<img>`/`<Image>` components. Meaningful images need descriptive `alt` text. Ensure gallery images have alt text.

### ✅ Internal Linking

- **Navbar:** Links to /, /ara, /#nasil-calisir, /kurumsal, /ekip-ol, /blog. Auth-conditional links to /dashboard, /dashboard/mesajlar, /islerim, /dashboard/favoriler, /dashboard/uyelik, /admin.
- **Footer:** Links to service search pages, /yardim, /iletisim, /guvenlik, legal pages.
- **Search page:** Links to /firma/{id} for each result.
- **Blog:** Links to /blog/{slug}.
- **Dashboard:** Links to all dashboard sub-routes.
- **Verdict:** Strong internal linking structure. No orphan pages detected.

### ✅ URL Structure

- Clean, Turkish SEO-friendly slugs:
  - `/ara?q=Mobilya&sehir=İstanbul` — search with filters
  - `/firma/123` — company profile
  - `/blog/mobilya-montaji-rehberi` — blog post
  - `/istanbul/mobilya-montaji` — city+service pages
  - `/sehir/İstanbul` — city landing
- No query parameter bloat. Filters use short param names (`q`, `sehir`, `siralama`, `sayfa`, `kategoriler`).
- Auth pages under `/auth/`: clean and logical.

### ⚠️ Performance & Caching

- **CDN:** Vercel Edge Network — global CDN. Good.
- **Cache headers** (`next.config.js`):
  - `/blog`, `/blog/:path*`, `/yazilar`, `/yazilar/:path*` → `no-cache, must-revalidate`
  - No other routes set explicit Cache-Control headers.
- **Dynamic rendering:** Blog pages, company profiles, city pages use `force-dynamic` or `revalidate=0` — always server-rendered. No ISR configured.
- **Asset caching:** Supabase storage images use `cacheControl: "31536000"` (1 year) — good.
- **Fix:** Consider ISR (`revalidate`) for blog posts and city pages to improve TTFB. Add Cache-Control for static pages (legal, about). Verify `/ara` page performance with many filters.

### ✅ Language & Locale

- `lang="tr"` on `<html>` — correct.
- `og:locale="tr_TR"` — correct.
- Content is primarily Turkish — consistent.

---

## SEO Scorecard

| Area | Score | Priority |
|------|-------|----------|
| Metadata/Titles | 10/10 | — |
| OpenGraph | 9/10 | Low |
| Twitter Cards | 4/10 | Medium |
| Structured Data | 8/10 | Low |
| Sitemap | 9/10 | Low |
| Robots.txt | 10/10 | — |
| Canonical URLs | 5/10 | Medium |
| Heading Hierarchy | 6/10 | Medium |
| Image Alt Text | 6/10 | Medium |
| Internal Linking | 9/10 | Low |
| URL Structure | 10/10 | — |
| Performance/Caching | 7/10 | Medium |
| **Overall** | **7.8/10** | |

---

## Top Recommendations (Priority Order)

1. **Add Twitter Cards** to root layout metadata (`twitter:card="summary_large_image"`)
2. **Add canonical URLs** to all dynamic pages (blog posts, city pages, search with filters)
3. **Verify heading hierarchy** across all templates — ensure proper `<h1>`–`<h6>` elements
4. **Implement ISR** (`revalidate: 3600`) on blog and city pages for better caching
5. **Add BreadcrumbList** structured data to deep pages (`/firma/{id}`, `/blog/{slug}`, `/{city}/{service}`)
6. **Improve image alt text** coverage — audit gallery and blog components
7. **Add Cache-Control headers** for static pages (legal, about, help)
