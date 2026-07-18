# Performance Baseline

## Build Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Next.js | 16.2.9 | — |
| React | 19.2.3 | — |
| Total dependencies | 24 runtime | — |
| Client components | 40 | reduce |
| Server components | — | increase |

## Bundle Analysis

| Asset | Estimated Size | Notes |
|-------|---------------|-------|
| framer-motion | ~35 KB gzip | Heavy animation lib, single page use? |
| lucide-react | ~25 KB gzip | Tree-shakable icons |
| next-auth | ~15 KB gzip | Auth runtime |
| leaflet + @types | ~45 KB gzip | Map library, only used on some pages |
| react-native | ~0 KB (tree-shaken) | Present in deps but not used in web build |
| expo | ~0 KB (tree-shaken) | Present in deps but not used in web build |

## Performance Issues Found

### P0 — Critical
1. **Font render blocking**: Google Fonts via `<link>` in `<head>` blocks render. Should use `next/font`.
2. **No caching strategy**: no `stale-while-revalidate`, no CDN cache headers.
3. **No security headers**: CSP, HSTS, X-Frame-Options missing.
4. **All pages dynamic**: `force-dynamic` on every public page — no ISR/SSG.
5. **Native deps in bundle**: `react-native`, `fetch-nodeshim`, `expo` present.
6. **No `next/font` usage**: Font loading via external CSS.

### P1 — High
7. **40 client components**: High JS bundle, hydration overhead.
8. **framer-motion**: Large animation library on potentially low-animation pages.
9. **No image optimization pipeline**: No `next/image` wrapper, no responsive sizes.
10. **No bundle analyzer**: Can't measure exact bundle impact.
11. **No font-display swap**: Only `display=swap` in URL but no preload strategy.

### P2 — Medium
12. **CSS bundle large**: 811 lines globals.css + component CSS.
13. **No critical CSS extraction**: Tailwind generates full CSS — no inlined critical path.
14. **No resource hints**: Missing preload/preconnect for critical resources.

## Recommendations

### Immediate fixes
1. Migrate to `next/font` (Inter + Manrope)
2. Add security headers to `next.config.js`
3. Remove unused deps (react-native, expo, fetch-nodeshim)
4. Add `next/dynamic` for heavy client components
5. Add bundle analyzer script

### Short-term
6. Implement `next/image` wrapper
7. Add ISR to static pages (legal, about)
8. Configure CDN cache headers for assets
