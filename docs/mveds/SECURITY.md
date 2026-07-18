# Security — Montajım Var

## 1. Security Posture (2026-07-17)

| Category | Status |
|---|---|
| **OWASP Top 10 (2021)** | P0/P1 closed, P2 backlog |
| **AuthN** | NextAuth v5, bcrypt 12, JWT HS256, tokenVersion invalidation |
| **AuthZ** | Middleware + inline checks, fail-closed `hasPermission` |
| **Input Validation** | zod schemas on all auth endpoints |
| **Output Encoding** | DOMPurify on 11 `dangerouslySetInnerHTML` sites |
| **Secrets** | Env-only, no fallbacks, HMAC-signed cookies |
| **Headers** | HSTS, CSP (frame-ancestors none), XFO, XCTO, Referrer-Policy, Permissions-Policy |
| **Rate Limiting** | 10/min auth, 100/min API (per IP, in-memory) |
| **File Upload** | MIME whitelist, 5MB, crypto-random names, ownership check |
| **Audit** | Admin stub, P2 expand |
| **Monitoring** | Sentry (server/client/edge) |

## 2. Threat Model (STRIDE)

| Threat | Mitigation |
|---|---|
| **Spoofing** | NextAuth JWT, tokenVersion, HMAC cookies |
| **Tampering** | CSP, HMAC cookies, signed URLs (Supabase) |
| **Repudiation** | Admin audit log (expand P2), Sentry breadcrumbs |
| **Information Disclosure** | Rate limit, generic error messages, no stack traces |
| **DoS** | Rate limit (middleware), 5MB upload limit, Prisma connection pool |
| **Elevation of Privilege** | Middleware admin guard, fail-closed permissions, tokenVersion |

## 3. Key Controls

### Authentication
- **Credentials**: bcryptjs 12 rounds, email verified required
- **OAuth**: Google (Auth.js), role cookie HMAC-SHA256
- **Session**: JWT 30d default, 24h absolute timeout (P2), sliding
- **Refresh**: 7d mobile, rotation on use
- **Lockout**: 5 failed → 15 min (P2 implemented in auth.ts)

### Authorization
- **Middleware** (`src/middleware.ts`): route protection + rate limit
- **Inline**: `roles.includes("ADMIN")` or `await hasPermission(role, feature)`
- **Fail-closed**: `hasPermission` returns `false` on unknown/error

### Data Protection
- **At rest**: Neon (AES-256), Supabase (AES-256)
- **In transit**: TLS 1.2+ everywhere
- **PII**: email, phone, name — encrypted at rest, minimal logging
- **Secrets**: `.env` only, no fallbacks, rotation playbook

### Application Security
| Control | Implementation |
|---|---|
| XSS | React auto-escape + DOMPurify for `dangerouslySetInnerHTML` |
| CSRF | NextAuth built-in + SameSite=Lax cookies |
| SQLi | Prisma parametrized queries only |
| Clickjacking | `X-Frame-Options: DENY`, `frame-ancestors 'none'` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Referrer leak | `strict-origin-when-cross-origin` |

## 4. Security Testing

| Test | Frequency | Tool |
|---|---|---|
| SAST | Per PR | ESLint security rules + `npm audit` |
| Dependency scan | Weekly | `npm audit`, GitHub Dependabot |
| Secrets scan | Per commit | GitHub secret scanning (P2 enable) |
| Penetration test | Quarterly | External (P2 budget) |
| OWASP ZAP | Per release | CI (P2) |

## 5. Incident Response

| Phase | Action |
|---|---|
| **Detect** | Sentry alert → Slack → on-call |
| **Contain** | Rotate secret, block IP, disable feature flag |
| **Eradicate** | Deploy fix, invalidate sessions (`tokenVersion++`) |
| **Recover** | Verify health, restore from backup if needed |
| **Post-mortem** | 24h → ADR + action items |

## 6. Compliance

| Standard | Status |
|---|---|
| **KVKK** (Turkey PDPL) | Privacy pages, consent banner, deletion endpoint P2 |
| **GDPR** | Same + DPA with subprocessors (P2) |
| **PCI-DSS** | Not applicable (no card storage, mock payment) |

## 7. Security Documentation Index

| Doc | Path |
|---|---|
| Security Baseline | `docs/security/00_security_baseline.md` |
| OWASP Top 10 Review | `docs/security/01_owasp_top10_review.md` |
| Auth & AuthZ | `docs/security/02_authentication_authorization.md` |
| Input Validation | `docs/security/03_input_validation_sanitization.md` |
| File Upload | `docs/security/04_file_upload_security.md` |
| API Security | `docs/security/05_api_security.md` |
| Database Security | `docs/security/06_database_security.md` |
| Session & Cookies | `docs/security/07_session_cookies.md` |
| Security Headers | `docs/security/08_security_headers.md` |
| Audit Logging | `docs/security/09_audit_logging.md` |
| GDPR/KVKK | `docs/security/10_compliance_gdpr_kvkk.md` |
| Monitoring | `docs/security/11_security_monitoring.md` |
| Dependencies | `docs/security/12_dependencies_supply_chain.md` |
| Secrets Management | `docs/security/13_secrets_management.md` |

---

*Last review: 2026-07-17 • Next: 2026-10-17*