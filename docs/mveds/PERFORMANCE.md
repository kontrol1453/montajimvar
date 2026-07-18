# Performance — Montajım Var

## 1. Current Baselines (2026-07-17)

| Metric | Value | Target | Status |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | 2.1s | ≤2.5s | ✅ |
| **INP/FID** (Interaction to Next Paint) | 180ms | ≤200ms | ✅ |
| **CLS** (Cumulative Layout Shift) | 0.05 | ≤0.1 | ✅ |
| **TTFB** (Time to First Byte) | 420ms | ≤600ms | ✅ |
| **FCP** (First Contentful Paint) | 1.3s | ≤1.8s | ✅ |
| **Bundle (first load)** | 380KB gz | ≤600KB | ✅ |
| **API p95** | ~1.2s | ≤2s | ✅ |
| **Build time** | 39s | ≤60s | ✅ |

*Source: Vercel Analytics + Sentry + local Lighthouse (desktop)*

## 2. Optimization Strategies Applied

### Next.js Configuration (`next.config.js`)
- **Images**: AVIF/WebP, `minimumCacheTTL: 86400`, remote patterns (Supabase, Google)
- **Bundle Analyzer**: `@next/bundle-analyzer` (ANALYZE=true)
- **Sentry**: `withSentryConfig` (source maps hidden, tunnel route)
- **Cache Headers**: Static assets 1yr immutable, HTML no-cache

### Code-Level
- **RSC-first**: Data fetching in Server Components, minimal client JS
- **Dynamic imports**: Heavy components (charts, maps) lazy-loaded
- **Font optimization**: `next/font/google` (Inter + Manrope, `display: swap`)
- **Script strategy**: Third-party (Clarity, GA4) deferred, CSP-allowed
- **Image optimization**: `next/image` with Supabase domains, blur placeholders

### Database
- **Composite indexes** on frequent query paths (city+category, user+status)
- **Prisma**: `select` only needed fields, `include` minimal
- **Connection pool**: Neon serverless (auto-scale)

## 3. Performance Budgets (Enforced in CI — P2)

| Budget | Limit | Enforcement |
|---|---|---|
| First-load JS | 600KB gz | `@next/bundle-analyzer` + CI fail |
| Total CSS | 100KB | Same |
| Font total | 150KB | `next/font` subsetting |
| Image weight (above fold) | 200KB | Manual review |
| API response (p95) | 2s | Sentry alert |
| LCP | 2.5s | Vercel Analytics alert |
| CLS | 0.1 | Vercel Analytics alert |

## 4. Monitoring & Alerting

| Tool | Metrics |
|---|---|
| **Vercel Analytics** | Core Web Vitals (LCP, INP, CLS), TTFB, navigation timing |
| **Sentry** | API latency (p50/p95/p99), error rate, throughput |
| **Microsoft Clarity** | Session replay, heatmaps, rage clicks |
| **Google Analytics 4** | Custom events, funnel conversion |

## 5. Optimization Backlog (P2)

| Task | Impact | Effort |
|---|---|---|
| Nonce-based CSP (remove `unsafe-inline`) | High | Medium |
| Service Worker caching (offline-first) | Medium | Medium |
| Critical CSS inlining | Medium | Low |
| Font subsetting (Turkish only) | Low | Low |
| Image CDN (Supabase → Cloudflare Images) | Medium | High |
| Redis cache for API responses | High | Medium |
| Edge middleware for auth (reduce origin hits) | Medium | Medium |

## 6. Lighthouse CI (P2)

```yaml
# .github/workflows/lighthouse.yml (to add)
- uses: treosh/lighthouse-ci-action@v11
  with:
    urls: https://test.montajimvar.xyz
    budgetPath: ./lighthouse-budget.json
    uploadArtifacts: true
```

```json
// lighthouse-budget.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

## 7. Performance Documentation Index

| Doc | Path |
|---|---|
| Performance Audit | `docs/performance/PERFORMANCE_AUDIT.md` |
| Lighthouse Report | `docs/performance/LIGHTHOUSE_REPORT.md` |
| Bundle Analysis | `docs/performance/BUNDLE_ANALYSIS.md` |

---

*Last measured: 2026-07-17 • Next: Sprint 12 (Lighthouse CI)*