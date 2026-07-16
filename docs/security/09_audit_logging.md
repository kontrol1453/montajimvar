# Audit Logging

## Mevcut Durum

### Sentry (Server + Client + Edge)

| Bileşen | Konfigürasyon |
|---------|--------------|
| `@sentry/nextjs` | `next.config.js` withSentryConfig |
| DSN | `process.env.SENTRY_DSN` (.env) |
| Tunnel | `/monitoring` route (CSP bypass için) |
| Source maps | `hideSourceMaps: true` |
| Tree shake | `removeDebugLogging: true` |
| Environment | `NODE_ENV` |

### Admin Audit Log (DB)

`src/lib/admin-audit.ts` — minimal stub:

```typescript
// Mevcut: admin işlemlerini DB'ye loglar
// Eksik: çoğu admin route'ta çağrılmıyor
```

## Audit Log Kapsamı

### Uygulanmış

| Event | Kaynak | Seviye |
|-------|--------|--------|
| Server error | Sentry captureException | Error |
| Client error | Sentry captureException | Error |
| Edge error | Sentry captureException | Error |
| Admin audit (stub) | `admin-audit.ts` | Info |

### Eksik (P2)

| Event | Önerilen Kaynak | Seviye |
|-------|-----------------|--------|
| Login (success) | `auth.ts` authorize | Info |
| Login (failure) | `auth.ts` authorize | Warn |
| Logout | NextAuth events | Info |
| Register | `/api/auth/kayit` | Info |
| Password reset request | `/api/auth/sifre-sifirla` | Info |
| Password reset confirm | `/api/auth/sifre-sifirla/[token]` | Info |
| Role change | `/api/admin/users/[id]/roles` | Critical |
| User delete | `/api/admin/users/[id]` | Critical |
| User ban/suspend | `/api/admin/users/[id]/ban` | Critical |
| File upload | `/api/upload` | Info |
| Payment | `/api/jobs/[id]/payment` | Critical |
| Dispute open/close | `/api/admin/disputes` | Warn |
| Blog publish | `/api/admin/blog` | Info |
| Permission change | `/api/admin/permissions` | Critical |
| Export (CSV/PDF) | `/api/admin/export` | Warn |
| Rate limit hit | middleware | Warn |
| Session invalidation (tokenVersion) | `auth.ts` jwt callback | Warn |

## Önerilen Audit Log Şeması

```sql
CREATE TABLE audit_log (
  id          SERIAL PRIMARY KEY,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  userId      INTEGER REFERENCES "User"(id),
  action      TEXT NOT NULL,           -- 'login_success', 'role_change', ...
  resource    TEXT,                    -- '/api/admin/users/123'
  ip          TEXT,
  userAgent   TEXT,
  severity    TEXT NOT NULL,           -- 'info', 'warn', 'critical'
  metadata    JSONB,
  adminId     INTEGER REFERENCES "User"(id)  -- eylemi yapan admin
);
```

## Önerilen Audit Helper

```typescript
// src/lib/audit-log.ts (P2)
export async function logAudit({
  userId, action, resource, severity = 'info', metadata = {}
}: AuditInput) {
  await prisma.auditLog.create({
    data: { userId, action, resource, severity, metadata, timestamp: new Date() }
  });
  if (severity === 'critical') {
    Sentry.captureMessage(`AUDIT: ${action}`, 'critical');
  }
}
```

## Log Retention

| Seviye | Süre | Öneri |
|--------|------|-------|
| Sentry | 90 gün | Sentry default |
| Audit log (DB) | 1 yıl | P2 — cron job ile arşiv |
| Rate limit log | 24 saat | Memory Map (zaten) |

## P2 Eylemler

- [ ] `audit_log` Prisma model + migration
- [ ] `src/lib/audit-log.ts` helper
- [ ] 18 admin route'a audit log çağrısı
- [ ] Login/register/reset event'leri logla
- [ ] Admin panel /admin/audit-logs sayfası (mevcut gibi görünüyor, içini doldur)
- [ ] Sentry alert rules (critical audit → Slack/email)
- [ ] Log retention cron job
