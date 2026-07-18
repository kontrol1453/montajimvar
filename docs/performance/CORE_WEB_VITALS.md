# Core Web Vitals Target & Plan

## Targets

| Metric | Target | Current (est.) | Gap |
|--------|--------|----------------|-----|
| LCP | < 2.5s | ~3.5-4.5s (font blocking, no preload) | HIGH |
| CLS | < 0.1 | ~0.15-0.25 (font swap, no size attrs) | MODERATE |
| INP | < 200ms | ~300-500ms (40 client components) | HIGH |
| TTFB | < 800ms | ~400-600ms (server, Vercel) | OK |
| FCP | < 1.8s | ~2.5-3.5s | HIGH |
| Speed Index | < 3.0s | ~4.0-5.0s | HIGH |

## LCP Optimization

**Root cause**: Google Fonts loaded via external CSS link blocks critical render path. Largest element (hero heading/image) waits for font + CSS download.

**Fix**:
1. `next/font` for Inter + Manrope — zero render blocking
2. Preload hero image with `priority` prop on `<Image>`
3. Inline critical CSS for above-fold content

## CLS Optimization

**Root cause**: Font swap causes layout shift. Images without explicit width/height. No aspect-ratio containers.

**Fix**:
1. `next/font` eliminates font-driven CLS (uses `size-adjust`)
2. Add explicit w/h to all `<Image>` components
3. Add `aspect-ratio` CSS to hero sections

## INP Optimization

**Root cause**: 40 client components with JS event handlers. framer-motion animation handlers. No code-splitting on heavy components.

**Fix**:
1. `next/dynamic` for below-fold client components
2. Defer third-party scripts
3. Reduce client component count — prefer server components
4. Lazy-load framer-motion

## Implementation Priority

### Sprint 1 (this phase)
- [x] `next/font` migration (Inter + Manrope)
- [x] Security headers in next.config.js
- [ ] Add w/h to all Image components
- [ ] Add `next/dynamic` for heavy client components
- [ ] Add bundle analyzer

### Sprint 2
- [ ] Implement ISR on static pages
- [ ] Add CDN cache headers
- [ ] Lazy-load framer-motion
- [ ] Add critical CSS extraction
