# Roadmap — Montajım Var

## Vision 2026

> **Q4 2026**: Platform Ready for Scale — HA infrastructure, staging/preview automation, 80% test coverage, SOC2-aligned security.

## Quarterly Themes

| Quarter | Theme | Key Outcomes |
|---|---|---|
| **Q3 2026** | **Operationalize DevOps** | Docker, staging, preview automation, backup cron, Lighthouse CI, structured logs |
| **Q4 2026** | **Scale Readiness** | Redis rate limit, HA (load balancer + 2x Pi), SLO dashboards, SOC2 prep |
| **Q1 2027** | **Market Expansion** | Mobile app (React Native), English locale, enterprise SSO (SAML/OIDC) |
| **Q2 2027** | **Ecosystem** | Public API, webhook platform, partner integrations (ERP, accounting) |

## Milestones

| Milestone | Target | Criteria |
|---|---|---|
| M1: DevOps Operational | 2026-08-31 | Docker compose, staging deploy, preview per PR, backup cron, smoke tests |
| M2: 80% Coverage | 2026-09-30 | Unit + integration + E2E (Playwright) |
| M3: HA Infrastructure | 2026-10-31 | 2x Pi behind Nginx, health checks, zero-downtime deploy |
| M4: SOC2 Controls | 2026-12-31 | Access logging, encryption at rest, vendor risk, incident response |

## Feature Backlog (High-Level)

| Epic | Priority | Est. Sprint |
|---|---|---|
| Docker + Compose | P1 | 11 |
| Staging Environment | P1 | 11 |
| Preview Automation | P1 | 11 |
| Backup Cron (pg_dump → S3) | P1 | 11 |
| Lighthouse CI | P2 | 12 |
| Redis Rate Limiter | P2 | 12 |
| Structured Logging (JSON) | P2 | 12 |
| Playwright E2E | P2 | 12 |
| HA (2nd Pi + LB) | P2 | 13 |
| SLO Dashboard (Grafana) | P3 | 13 |
| Mobile App (React Native) | P3 | 14 |
| Enterprise SSO | P3 | 14 |

## Dependencies

- **Docker** unblocks staging/preview/CI parity
- **Staging** unblocks QA sign-off gate
- **Preview** unblocks "no merge without preview" rule
- **Redis** unblocks multi-instance rate limiting

## Review Cadence

- **Weekly**: Sprint review + roadmap adjust
- **Monthly**: Roadmap + capacity planning
- **Quarterly**: Theme reset + milestone check