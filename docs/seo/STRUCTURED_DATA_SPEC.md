# Structured Data Specification

## Current State
- WebSite schema in root layout ✅
- Organization schema in root layout ✅
- SearchAction on WebSite ✅
- Everything else: MISSING

## Implementation Plan

### 1. BreadcrumbList — All Pages
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://montajimvar.xyz" },
    { "@type": "ListItem", "position": 2, "name": "Sayfa Adı", "item": "https://montajimvar.xyz/page" }
  ]
}
```
Add to: every `(public)/[route]/page.tsx` that has breadcrumbs.

### 2. LocalBusiness — Profile Pages
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Firma Adı",
  "description": "...",
  "url": "https://montajimvar.xyz/firma/123",
  "telephone": "...",
  "image": "...",
  "address": { "@type": "PostalAddress", "addressLocality": "İstanbul", "addressCountry": "TR" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.5", "reviewCount": "42" },
  "priceRange": "₺"
}
```

### 3. Service — Category/Search Pages
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Mobilya Montajı",
  "provider": { "@type": "Organization", "name": "Montajım Var" },
  "areaServed": { "@type": "City", "name": "İstanbul" }
}
```

### 4. FAQPage — Help/FAQ Pages
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{ "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }]
}
```
Add to: homepage FAQ section, /yardim page.

### 5. Article — Blog Pages
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Blog Başlığı",
  "description": "...",
  "author": { "@type": "Organization", "name": "Montajım Var" },
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-01",
  "image": "..."
}
```

### 6. AggregateRating — Profile Cards
```json
{
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "itemReviewed": { "@type": "LocalBusiness", "name": "Firma" },
  "ratingValue": "4.5",
  "reviewCount": "42",
  "bestRating": "5"
}
```

## Implementation Order

1. LocalBusiness on /firma/[id] — highest SEO value
2. FAQPage on homepage — rich result eligibility
3. Article on /blog/[slug] — rich result eligibility
4. BreadcrumbList — all pages
5. Service on /ara and /sehir pages
6. AggregateRating on profile cards
