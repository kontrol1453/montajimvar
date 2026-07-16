# Monitoring & Observability — Montajım Var

## 1. Monitoring Stack

| Katman | Araç | Aktif |
|---|---|---|
| Error tracking | Sentry | ✅ |
| Performance | Vercel Analytics | ✅ |
| User behavior | Microsoft Clarity | ✅ |
| Web analytics | Google Analytics 4 | ✅ |
| Uptime (P2) | UptimeRobot / BetterUptime | ⏳ |
- App logs | `pm2 logs` (Pi) | ✅ |
- Server metrics | `pm2 monit` (Pi) | ✅ |
- DB metrics | Neon dashboard | ✅ |
- Storage metrics | Supabase dashboard | ✅ |
- Tracing (P2) | Sentry Performance | ⚠ trace rate düşük |

## 2. Alerting (Current)

| Metrik | Kanal | Tetik |
|---|---|---|
| Server error | Sentry email | new error |
| Fatal error | Sentry email | captured: fatal |
| Deploy fail | GitHub email | workflow fail |

## 3. Alerting (P2 Target)

| Metrik | Kanal | Tetik |
|---|---|---|
| 500 error rate | Slack | > 1% / 5 dak |
| Response time p95 | Slack | > 2s |
| Uptime | Slack + email | 3 başarısız ping |
- DB connection pool | Slack | > 80% used |
| Memory (Pi) | Slack | > 80% |
| Disk space (Pi) | Slack | > 90% |
- Sentry anomaly | Email | spike detected |
| Cron failure | Email | cronjob didn't run |
| Backup failure | Email | pg_dump failed |

## 4. Alerts Channels (P2)

### Discord/Slack Webhook

```bash
# .env
ALERT_DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
```

```typescript
// src/lib/alerts.ts (P2)
async function alert(level: "info"|"warn"|"critical", msg: string) {
  await fetch(process.env.ALERT_DISCORD_WEBHOOK!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `[${level.toUpperCase()}] ${msg}` }),
  });
}
```

## 5. Dashboards (P2)

### Sentry

- Error rate (24h, 7d)
- Top errors
- Release health
- p95/p99 API performance
- Affected users

### Custom (Grafana + Postgres exporter / Prometheus) — P3

- Requests per second
- Response time histogram
- Active sessions
- API top latency
- DB slow query log
- Cache hit ratio (P3 Redis)

## 6. SLI / SLO (P2)

| SLI | SLO | Measurement |
|---|---|---|
| Availability | 99.5% monthly | `health` ping success |
| API p95 latency | 2s | Sentry traces |
| API p99 latency | 5s | Sentry traces |
| Error rate | < 1% | Sentry 500s / total |
- Time to first byte | 600ms | Vercel Analytics |
| LCP | 2.5s | Vercel Analytics |
| MTTR (mean time to recovery) | < 30 dak | Manual log |
| Deploy frequency | weekly | GitHub Releases |

## 7. Logs Schema (Structured, P2)

Replace `console.log`:

```typescript
// src/lib/logger.ts (P2)
type LogLevel = "debug" | "info" | "warn" | "error";
interface LogEntry {
  level: LogLevel;
  msg: string;
  meta?: Record<string, unknown>;
  ts: string;
  userId?: number;
  reqId?: string;
}
```

Destinations:
- Dev: `console.log` (nice format)
- Prod: stdout JSON → PM2 capture → filterable

## 8. Health Endpoint

### `/api/health`

```json
{
  "status": "ok",
  "timestamp": "2026-07-17T01:30:00.000Z",
  "service": "montajimvar",
  "version": "0.1.0"
}
```

### `/api/health/deep` (P2 — checks everything)

```json
{
  "status": "ok" | "degraded",
  "checks": {
    "database": { "status": "ok", "latency": 23 },
    "supabase": { "status": "ok" },
    "sentry": { "status": "ok" }
  }
}
```

## 9. Uptime Monitoring (P2)

### UptimeRobot config

- URL: `https://test.montajimvar.xyz/api/health`
- Interval: 5 dakika
- Alert on: 3 başarısız
- Alert via: email + Slack
- Regions: 3 (EU/US/Asia)

## 10. Incidents Response

| Seviye | Yanıt Süresi | Comms |
|---|---|---|
| P0 (data breach, auth bypass) | 15 dak | Incident page, halt deploy |
| P1 (major outage) | 1 saat | Status page, comms |
| P2 (degraded) | 4 saat | Investigate, log |
| P3 (minor) | 24 saat | Backlog |

## 11. Review

Her Monday: review metrikler. Her 3 ay: SLO review.
