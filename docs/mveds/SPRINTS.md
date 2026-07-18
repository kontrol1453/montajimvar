# Sprints — Montajım Var

## Sprint Template

| Sprint | Dates | Goal | Key Deliverables | Status |
|---|---|---|---|---|
| **Sprint 10** | 2026-07-16 → 2026-07-23 | DevOps Foundation + Platform Constitution | CI/CD workflows, 17 DevOps docs, vitest, health endpoint, Platform Constitution, production deploy | ✅ Done |
| **Sprint 11** | 2026-07-24 → 2026-07-30 | Containerize + Staging + Preview | Dockerfile, docker-compose, staging env, preview automation, backup cron | 📅 Planned |
| **Sprint 12** | 2026-07-31 → 2026-08-06 | Observability + Quality | Lighthouse CI, Playwright E2E, structured logs, Redis rate limit | 📅 Planned |
| **Sprint 13** | 2026-08-07 → 2026-08-13 | HA Infrastructure | 2nd Pi, Nginx LB, zero-downtime deploy, SLO dashboards | 📅 Planned |
| **Sprint 14** | 2026-08-14 → 2026-08-20 | SOC2 Prep + Mobile | Access logging, encryption audit, React Native scaffold | 📅 Planned |

## Sprint Ceremonies

| Ceremony | When | Duration | Participants |
|---|---|---|---|
| Sprint Planning | Wednesday 09:00 | 60 min | All |
| Daily Standup | Daily 09:30 | 15 min | Devs |
| Sprint Review | Tuesday 16:00 | 45 min | All |
| Retrospective | Tuesday 17:00 | 30 min | Devs |
| Roadmap Sync | Monthly 1st Wed | 60 min | Leads |

## Sprint 10 Retrospective (2026-07-17)

### ✅ What Went Well
- 17 DevOps docs created in single sprint
- Platform Constitution established as north star
- CI/CD workflows + vitest + health endpoint operational
- Security P0/P1 100% closed
- Production deploy successful (test.montajimvar.xyz)

### ⚠️ What Needs Improvement
- Preview/staging environments only documented, not implemented
- Test coverage still low (5% overall)
- Docker absent — local ≠ CI ≠ prod parity risk
- No Lighthouse CI / performance regression guard
- Single Pi = SPOF

### 🎯 Action Items for Sprint 11
1. Dockerfile + docker-compose (local dev parity)
2. Staging environment (separate Neon branch + Supabase project)
3. Preview deployment per PR (Coolify on Pi or ngrok fallback)
4. Automated backup cron (pg_dump → S3)
5. Lighthouse CI in GitHub Actions

## Sprint 11 Plan (Draft)

| Task | Owner | Est. Days |
|---|---|---|
| Dockerfile (multi-stage, node:20-alpine) | DevOps | 1 |
| docker-compose.yml (app + push service) | DevOps | 1 |
| Staging: Neon branch DB + Supabase project | DevOps | 1 |
| Preview: Coolify install on Pi + GitHub webhook | DevOps | 2 |
| Backup cron (pg_dump → S3, encrypted) | DevOps | 1 |
| Lighthouse CI workflow | DevOps | 1 |
| Update CI to use Docker | DevOps | 1 |
| Document: OPERATIONS.md (runbooks) | Tech Lead | 1 |

---

*Next sprint planning: 2026-07-23*