# Security Monitoring

## Sentry Konfigürasyonu

### Server-side (next.config.js)

```javascript
withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
});
```

### Özellikler

| Özellik | Durum |
|---------|-------|
| DSN | ✓ (env) |
| Tunnel route | `/monitoring` (CSP bypass) |
| Source maps | Hidden |
| Tree shake | Debug logging removed |
| Release tracking | P2 |
| User context | P2 (session.user.id) |
| breadcrumbs | Otomatik |
| Performance monitoring | Otomatik |
| Replay | P2 |

## İzlenen Metrikler

### Error Tracking

| Metrik | Kaynak | Alarm Eşiği |
|--------|--------|-------------|
| 500 error rate | Sentry | > 1% |
| Error count | Sentry | > 10/dakika |
| New error | Sentry | Any |
| Regression | Sentry | Release compare |

### Performance

| Metrik | Kaynak | Alarm Eşiği |
|--------|--------|-------------|
| LCP | Vercel Analytics | > 2.5s |
| FID | Vercel Analytics | > 100ms |
| CLS | Vercel Analytics | > 0.1 |
| API response time | Sentry | > 2s p95 |

### Güvenlik

| Metrik | Kaynak | Alarm Eşiği |
|--------|--------|-------------|
| Rate limit 429 count | Middleware (memory) | P2 — Prometheus |
| Login failure rate | auth.ts (P2) | > 20% |
| Admin API usage | P2 | Anomali |
| Suspicious IP | P2 | Birden fazla hesap |

## Alerting

### Mevcut

- **Sentry**: Email notification (default)
- **Vercel**: Deployment notifications

### P2 Önerilen

| Alert | Kanal | Tetik |
|-------|-------|------|
| Critical error | Slack webhook | Sentry severity=fatal |
| Rate limit spike | Slack | 429 > 100/dk |
| Admin action | Email | role_change, user_delete |
| Login anomaly | Email | 5 IP'de 1 hesap |
| Deploy failure | Slack | Build error |
| DB connection fail | Slack | Prisma connection error |
| Payment failure | Email | Mock error (prod: iyzico) |

## Dashboard Önerisi (P2)

### Sentry Dashboard

- Error rate (24h, 7d)
- Top errors
- Affected users
- Release health
- Performance (p50, p95, p99)

### Custom Dashboard (Grafana/P2)

- Request volume by route
- Rate limit hits by IP
- Auth success/failure ratio
- Admin API calls by user
- File upload count/size
- DB query slow log

## Incident Response (P2)

### Severity Levels

| Seviye | Tanım | Yanıt Süresi |
|--------|-------|--------------|
| P0 | Data breach, auth bypass | 15 dakika |
| P1 | Critical vuln, major outage | 1 saat |
| P2 | Degraded service | 4 saat |
| P3 | Minor issue, cosmetic | 24 saat |

### Response Steps

1. **Detect**: Sentry alert / manual report
2. **Assess**: Severity, scope, impact
3. **Contain**: Disable feature, rotate secret, block IP
4. **Eradicate**: Fix code, deploy patch
5. **Recover**: Verify fix, restore service
6. **Post-mortem**: Document, prevent

## P2 Eylemler

- [ ] Sentry release tracking (commit SHA)
- [ ] Sentry user context (session.user.id)
- [ ] Sentry Session Replay
- [ ] Slack webhook integration
- [ ] Custom alerts (rate limit, login anomaly)
- [ ] Incident response playbook
- [ ] Status page (status.montajimvar.xyz)
- [ ] Uptime monitoring (UptimeRobot/ BetterUptime)
