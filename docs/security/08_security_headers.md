# HTTP Security Headers

## Mevcut Headers (next.config.js)

Tüm route'lara `/(.*)` source ile uygulanır:

| Header | Değer | Amaç |
|--------|-------|------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | HSTS — HTTPS zorunlu |
| `Content-Security-Policy` | (aşağıda) | XSS, clickjacking, data exfiltration |
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer sızıntısı |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Sensör erişimini kapat |

### Middleware Headers (ek olarak)

`src/middleware.ts` her response'a ekler:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## CSP (Content-Security-Policy)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval'
  https://*.googleapis.com https://*.gstatic.com
  https://*.clarity.ms https://*.googletagmanager.com
  https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline' https://*.googleapis.com;
img-src 'self' data: blob:
  https://*.supabase.co https://*.googleusercontent.com
  https://lh3.googleusercontent.com https://*.clarity.ms;
font-src 'self' https://*.gstatic.com;
connect-src 'self'
  https://*.supabase.co https://*.clarity.ms
  https://*.google-analytics.com https://*.sentry.io
  https://va.vercel-scripts.com;
frame-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
```

### CSP Direktif Analizi

| Direktif | Durum | Risk |
|----------|-------|------|
| `default-src 'self'` | ✓ | Default deny |
| `script-src 'unsafe-inline'` | ⚠ P2 | Next.js inline script'ler için gerekli; nonce-based CSP ile kaldırılabilir |
| `script-src 'unsafe-eval'` | ⚠ P2 | Dev modu için; prod'da kaldırılabilir |
| `style-src 'unsafe-inline'` | ⚠ P2 | Tailwind/Next.js inline stiller |
| `object-src 'none'` | ✓ | Flash/Java applet engelli |
| `frame-ancestors 'none'` | ✓ | Clickjacking tamamen engelli |
| `form-action 'self'` | ✓ | Cross-origin form submit engelli |
| `base-uri 'self'` | ✓ | `<base>` tag injection engelli |
| `connect-src sentry.io` | ✓ | Sentry hata raporlama |
| `img-src supabase.co` | ✓ | Profil/blog görselleri |

## Cache Headers

| Kaynak | Cache-Control |
|--------|---------------|
| Statik dosyalar (jpg, css, js...) | `public, max-age=31536000, immutable` |
| `_next/image` | `public, max-age=86400, stale-while-revalidate=604800` |
| `/favicon.ico` | `public, max-age=86400, immutable` |
| `/manifest.json` | `public, max-age=3600` |
| `/blog`, `/yazilar` | `no-cache, no-store, must-revalidate` |

## P2 İyileştirmeler

| # | Madde | Öneri |
|---|-------|-------|
| 1 | `unsafe-inline` script-src'ten kaldır | Next.js nonce-based CSP (middleware setHeader) |
| 2 | `unsafe-eval` prod'da kaldır | Production build'da gerekmez |
| 3 | `Cross-Origin-Opener-Policy` | `same-origin` — clickjacking ek koruma |
| 4 | `Cross-Origin-Embedder-Policy` | `require-corp` — CORP gerekiyorsa |
| 5 | SRI (Subresource Integrity) | Clarity/GA4 external script'ler için |
| 6 | `Reporting-Endpoints` | CSP violation report endpoint |
