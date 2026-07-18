# Preview Deployment — SEO, Performance & Production Optimization

## Deploy Preview

**URL**: _(awaiting Vercel deployment)_

## Changes Summary

### P0 — Critical
- **next/font migration**: Replaced `<link>` Google Fonts with `next/font/google` (Inter + Manrope) — eliminates render blocking
- **Security headers**: Added CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy to all routes
- **Image optimization**: Configured `minimumCacheTTL`, `formats: ['image/avif', 'image/webp']`, `remotePatterns`
- **ISR**: Added `revalidate = 86400` (24h) to 10 static pages (cerez, gizlilik, guvenlik, iletisim, is-sagligi, kullanim-kosullari, kurumsal, kvkk, on-bilgilendirme, yardim)
- **Cache-Control headers**: Static assets (images, fonts, CSS, JS) → 1 year immutable; Next.js images → 1 day with stale-while-revalidate
- **Metadata**: Added to all 18 static pages (title, description, canonical, OG, twitter cards)
- **Canonical URLs**: Added to homepage + all 17 static pages

### P1 — High
- **Twitter cards**: Added `summary_large_image` to homepage, blog, yardim, iletisim, kurumsal
- **Structured Data**: WebSite + Organization already present
- **Static page revalidation**: 10 legal/static pages now ISR with 24h cache

## Verification Checklist
- [ ] TypeScript compiles: ✅ (0 errors)
- [ ] Build succeeds: ✅
- [ ] Static pages show ISR: ✅ (○ /cerez 1d 1y, etc.)
- [ ] Lighthouse SEO score >90
- [ ] Lighthouse Performance >70
- [ ] Security headers present
