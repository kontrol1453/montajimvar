# SEO Audit Report

## Pages Scanned

| Page | Title | Description | Canonical | OG | Twitter | H1 | Status |
|------|-------|-------------|-----------|----|---------|-----|--------|
| `/` | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (h1) | PASS |
| `/ara` | ✅ (dynamic) | ✅ | ❌ | ❌ | ❌ | ✅ | PASS |
| `/blog` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | PASS |
| `/auth/giris` | ❌ (default "Montajım Var") | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/auth/kayit` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/is-ver` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/ekip-ol` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ❌ | FAIL |
| `/yardim` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/kurumsal` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/gizlilik` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/kullanim-kosullari` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/cerez` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/guvenlik` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/iletisim` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/is-sagligi` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/on-bilgilendirme` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/kvkk` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/is-ilanlari` | ❌ (default) | ❌ | ❌ | ❌ | ❌ | ✅ | FAIL |
| `/blog/[slug]` | ✅ (dynamic) | ✅ | ❌ | ❌ | ❌ | ✅ | PASS |
| `/firma/[id]` | ✅ (dynamic) | ✅ | ❌ | ❌ | ❌ | ✅ | PASS |

## Critical Issues (P0)

### 1. Missing metadata on 15+ pages
Static pages (auth, legal, about) have no `generateMetadata` or `metadata` export. They inherit the root layout's default "Montajım Var - Profesyonel Montaj Platformu".

### 2. No canonical URLs
No `<link rel="canonical">` on any page. Risk of duplicate content on parameterized URLs (`/ara?sehir=...&kategoriler=...`).

### 3. No Twitter Card meta
Missing `twitter:card`, `twitter:title`, `twitter:description` across all pages.

### 4. No breadcrumb StructuredData
No BreadcrumbList schema on any navigation path.

### 5. No LocalBusiness / Service structured data
Only WebSite + Organization in root layout. No LocalBusiness for profiles, no Service schema on category pages.

### 6. Missing alt text on images
`<Image>` components in Navbar, CompanyCard, ImageGallery, PortfolioGallery need alt text audit.

### 7. Pagination without rel=next/prev
Search page pagination has no `rel="next"` / `rel="prev"` link tags.

## High Issues (P1)

### 8. No FAQPage structured data
FAQ section on homepage uses `<div>` with no schema markup.

### 9. Thin content on legal pages
/gizlilik, /kullanim-kosullari, /cerez have minimal content — high bounce risk.

### 10. Duplicate title tags
Root layout title "Montajım Var - Profesyonel Montaj Platformu" matches homepage title.

### 11. No hreflang tags
Turkish site should have `hreflang="tr"`.

### 12. Sitemap missing `lastModified` for static routes
All static routes use `new Date()` as lastModified — inaccurate.
