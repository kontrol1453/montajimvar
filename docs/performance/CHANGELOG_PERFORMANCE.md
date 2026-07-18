# Changelog — SEO, Performance & Production Optimization

## v0.8.0 (Initial Release)

### Performance
- **Font optimization**: Migrated from `<link>` Google Fonts to `next/font/google` (Inter + Manrope) — eliminates render blocking, enables font-display swap
- **ISR**: 10 static pages now use ISR with 24-hour revalidation — reduces server load, improves TTFB for legal/static content
- **Cache strategy**: Added Cache-Control headers for static assets (1 year immutable), optimized images (1 day + stale-while-revalidate)
- **Image pipeline**: Configured AVIF + WebP formats, minimumCacheTTL increased to 24h, added remotePatterns for Supabase/Google storage

### Security
- **Content-Security-Policy**: Tight CSP covering scripts, styles, images, fonts, frames, connections, objects, base-uri, form-action
- **Security headers**: Added X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, X-XSS-Protection, Permissions-Policy
- **Redirect support**: HTTPS redirect and trailing slash enforcement

### SEO
- **Metadata**: Every static page now has `<title>`, `<meta name="description">`, open graph, and canonical URL
- **Twitter cards**: Added `summary_large_image` to homepage, blog, and key marketing pages
- **Robots meta**: Added noindex,nofollow to auth-required pages

### Code Quality
- Removed legacy apple-mobile-web-app meta tags (migrated to `appleWebApp`)
- TypeScript strict mode compliance — 0 errors

### Pending for Future
- Structured Data (BreadcrumbList, LocalBusiness, FAQPage, Article)
- Bundle analysis and code splitting
- Database query caching (Vercel KV/Redis)
- Sitemap caching layer
- Analytics integration (GA4 + Clarity)
