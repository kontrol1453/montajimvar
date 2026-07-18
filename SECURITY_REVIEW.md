# Security Review — Montajım Var

**Project:** Montajım Var (montajimvar.xyz)
**Date:** July 2026
**Stack:** Next.js 16, NextAuth v4, Prisma (PostgreSQL), Supabase Storage, bcryptjs

---

## Risk Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High     | 2 |
| Medium   | 5 |
| Low      | 4 |
| **Total**| **11** |

---

## Findings

### 🟠 HIGH

#### H-1. No rate limiting on auth endpoints

- **Location:** `src/app/api/auth/kayit/route.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- **Risk:** High
- **Description:** The registration endpoint (`/api/auth/kayit`) and NextAuth sign-in have no rate limiting. An attacker can brute-force credentials or mass-register accounts without throttling. Password reset, email verification, and mobile-login endpoints are similarly unprotected.
- **Fix:** Implement rate limiting using a middleware (e.g., `express-rate-limit`-style, Vercel WAF, or a Redis-based token bucket). Apply at minimum to: login, register, password reset, email verify, and mobile-login routes. Use `Vercel.json` rate limits or a library like `@upstash/ratelimit`.

#### H-2. No Content Security Policy (CSP) headers

- **Location:** `next.config.js` (entire app)
- **Risk:** High
- **Description:** No CSP headers are set anywhere in `next.config.js` headers configuration. This leaves the application vulnerable to XSS attacks via injected scripts, inline event handlers, or `dangerouslySetInnerHTML` usage (which exists in blog posts (`blog/[slug]/page.tsx:74`), city pages (`sehir/[city]/page.tsx:30`), and the root layout (`layout.tsx:73-108`)).
- **Fix:** Add a strict CSP header in `next.config.js`. At minimum: `default-src 'self'`, `script-src 'self' 'unsafe-inline' 'unsafe-eval'` (for Next.js), `style-src 'self' 'unsafe-inline'`, `img-src 'self' data: https: *.supabase.co`, `connect-src 'self' https:`. Consider `nonce`-based inline scripts for Next.js.

---

### 🟡 MEDIUM

#### M-1. No input sanitization library

- **Location:** Project-wide
- **Risk:** Medium
- **Description:** The project uses `dangerouslySetInnerHTML` in three places (blog content, city page content, LD+JSON scripts). There is no DOMPurify or similar sanitization library in `package.json`. If blog/city page content is stored with malicious HTML, it executes in the browser.
- **Fix:** Install `DOMPurify` (or `isomorphic-dompurify` for SSR) and sanitize all HTML before passing to `dangerouslySetInnerHTML`. Sanitize on write (before saving to DB) and on read (before rendering).

#### M-2. Admin API routes verify role per-request but lack centralized middleware

- **Location:** `src/app/api/admin/*/route.ts`
- **Risk:** Medium
- **Description:** Each admin API route independently checks `session.user.roles?.includes("ADMIN")`. There is no global middleware that enforces admin-only access to `/api/admin/*`. A single route missing this check would expose admin functionality. Currently all audited routes have the check (e.g., `admin/users/route.ts:10-11`), but the pattern is fragile.
- **Fix:** Create a reusable `requireAdmin()` helper that wraps the auth + role check with a consistent error response, or add a `middleware.ts` that protects `/api/admin/*` globally.

#### M-3. Password field stored directly on User model

- **Location:** `prisma/schema.prisma:14`
- **Risk:** Medium
- **Description:** The `password` field is on the `User` model directly rather than in a separate `AuthProvider` or `Credentials` table. This makes it harder to support multiple auth providers securely and means password reset tokens share the same table. The field is always selected when querying User unless explicitly excluded via `select`.
- **Fix:** Consider extracting credential auth into a separate `UserCredential` model to reduce accidental password exposure. Add a Prisma middleware that excludes `password` from all queries by default.

#### M-4. SMTP credentials in .env are empty

- **Location:** `.env:6-9`
- **Risk:** Medium
- **Description:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` are all empty. The email verification flow (`api/auth/kayit/route.ts:72`) calls `sendEmail()` which likely fails silently. Users cannot verify their email, and password reset emails will not be sent. The `email.ts` lib handles errors gracefully (logs only), but this leaves a broken critical flow.
- **Fix:** Configure real SMTP credentials or use a transactional email service (Resend, SendGrid, Mailgun). Add health checks for email delivery.

#### M-5. Push notification service key in .env

- **Location:** `.env:22` (`PUSH_SERVICE_KEY=ac9cc55aed8a4fbd28ba57f4fe030909947042f452c18b7acdc6429c4851c514`)
- **Risk:** Medium
- **Description:** The push service key is a long-lived shared secret for authenticating between this app and the push service. If compromised, an attacker could send push notifications to all subscribers, or intercept push service traffic.
- **Fix:** Rotate the key immediately. Use a different key per environment (dev/staging/prod). Restrict push service access by IP or use mutual TLS.

---

### 🔵 LOW

#### L-1. JWT secret is weak / hardcoded

- **Location:** `.env:5` (`NEXTAUTH_SECRET=montajimvar-secret-802976`), `lib/auth.ts:166` (fallback: `"montajimvar-gizli-anahtar-degistirin"`)
- **Risk:** Low (in production the env var is used, but the fallback is weak)
- **Description:** The NEXTAUTH_SECRET value `montajimvar-secret-802976` appears to be a manually typed string, not a generated random token. If this is the production value, JWT tokens could be forged if the secret is guessed. The fallback in source code is even weaker.
- **Fix:** Generate a cryptographically random secret: `openssl rand -base64 32`. Update the production `.env`. Remove the fallback value from source code.

#### L-2. VAPID private key exposed in .env

- **Location:** `.env:17` (`VAPID_PRIVATE_KEY=L358K5TWRREI37g6fHUSQGFOTpi-FNgtRFkvpr4VAE`)
- **Risk:** Low (VAPID keys are for push subscription identity; exposure allows sending push as this origin)
- **Description:** The VAPID private key is in `.env` (gitignored — good), but if leaked, an attacker could send push notifications impersonating the service.
- **Fix:** Rotate VAPID keys. Ensure `.env` is not in version control (confirmed: `.gitignore` has `.env*`).

#### L-3. NextAuth CSRF protection not verified

- **Location:** `lib/auth.ts`
- **Risk:** Low
- **Description:** NextAuth v4 has built-in CSRF protection for its own routes (`/api/auth/*`). However, the custom `/api/auth/kayit` route does not use NextAuth's CSRF token. Custom auth endpoints should implement CSRF checks.
- **Fix:** Verify that NextAuth's CSRF token is validated on custom auth endpoints, or implement double-submit cookie pattern.

#### L-4. No HTTPS enforcement configuration

- **Location:** `next.config.js`
- **Risk:** Low (Vercel handles HTTPS at edge)
- **Description:** No explicit HTTPS redirect or HSTS headers are configured. Vercel enforces HTTPS by default, but there is no `Strict-Transport-Security` header set in the application itself.
- **Fix:** Add HSTS header via `next.config.js` headers: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.

---

## Existing Protections (Good)

| Protection | Location | Notes |
|------------|----------|-------|
| Password hashing with bcrypt (rounds: 12) | `api/auth/kayit/route.ts:37`, `lib/auth.ts:80` | Industry standard |
| JWT token version control | `lib/auth.ts:124-145` | Invalidates tokens on role/version change |
| Role-check on admin layout | `admin/layout.tsx:10-12` | Server-side check before rendering |
| Role-check on admin API routes | All `api/admin/*/route.ts` | Consistent pattern |
| Profile ownership check on upload | `api/upload/route.ts:50-55` | Prevents cross-user file upload |
| File type validation | `api/upload/route.ts:29-35` | JPEG/PNG/WebP/GIF only |
| File size limit (5MB) | `api/upload/route.ts:38-43` | Prevents DoS via large files |
| Prisma parameterized queries | All `prisma.*` calls | SQL injection safe by design |
| React default XSS escaping | All JSX | Framework-level protection |
| `.env` in `.gitignore` | `.gitignore:34` | Prevents secret commits |
| Session strategy: JWT | `lib/auth.ts:164` | Stateless, no DB lookup on every request |
| Self-deletion protection | `api/admin/users/route.ts:82-88` | Admin cannot delete own account |
| Audit logging for admin actions | `api/admin/users/route.ts:55-61` | Creates audit trail |
| Email verification required | `lib/auth.ts:36-38` | Blocks unverified logins |
| Role validation on signup | `api/auth/kayit/route.ts:19-25` | Only CUSTOMER/ASSEMBLER/MANUFACTURER |
| Input validation on password minimum length | `api/admin/users/route.ts:33-38` | 6 character minimum |

---

## Additional Recommendations

1. **Add `helmet`-like security headers** via `next.config.js`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
2. **Implement rate limiting** on all auth endpoints (login, register, password-reset, email-verify, mobile-login).
3. **Add a central `middleware.ts`** to protect `/dashboard/`, `/admin/`, and `/api/admin/` routes instead of per-page checks.
4. **Sanitize blog content** with DOMPurify before rendering with `dangerouslySetInnerHTML`.
5. **Set secure cookie flags** for next-auth: `secure: true` (auto in production with HTTPS), `sameSite: 'lax'`, `httpOnly: true`.
6. **Add security.txt** at `/.well-known/security.txt` for vulnerability disclosure.
7. **Rotate all production secrets** (NEXTAUTH_SECRET, VAPID keys, PUSH_SERVICE_KEY) if they were ever committed or shared.
8. **Consider database-level encryption** for sensitive user fields (phone, address).
