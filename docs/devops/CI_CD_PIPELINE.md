# CI/CD Pipeline — Montajım Var

## 1. Pipeline Overview

```
Push to feature/*
  ↓
[CI: Quality Gate]
  ├ Install deps (npm ci)
  ├ Lint (eslint)
  ├ Type check (tsc --noEmit)
  ├ Unit tests (vitest)
  ├ Build (next build)
  ├ Security audit (npm audit)
  ├ Bundle size check
  └ Preview deploy
  ↓
PR opened
  ↓
[CI: Same as above + Integration tests]
  ↓
[Manual review + QA]
  ↓
Merge to develop
  ↓
[CI: Staging deploy]
  ↓
Release branch cut: release/v1.0.0
  ↓
[CI: Release candidate build]
  ↓
QA Sign-off
  ↓
Merge to main + tag v1.0.0
  ↓
[CD: Production deploy → test.montajimvar.xyz]
  ↓
[CI: Smoke tests + health check]
  ↓
[CI: Tag GitHub release]
```

## 2. GitHub Actions Workflows

### 2.1 CI Workflow (`.github/workflows/ci.yml`)

Triggers: push to `feature/*`, `bugfix/*`; PR to `develop`/`main`

```yaml
name: CI

on:
  push:
    branches: [feature/*, bugfix/*, develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test:unit -- --reporter=verbose
      - run: npm run build
      - run: npm audit --audit-level=high --omit=dev
        continue-on-error: true
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next
          retention-days: 7
```

### 2.2 Staging Deploy (`.github/workflows/staging.yml`)

Trigger: merge to `develop`

### 2.3 Production Deploy (`.github/workflows/production.yml`)

Trigger: tag push `v*.*.*`

## 3. Quality Gates

| Gate | Tool | Required |
|---|---|---|
| Install | `npm ci` | ✅ |
| Lint | `eslint` | ✅ (0 errors) |
| Typecheck | `tsc --noEmit` | ✅ (0 errors) |
| Unit tests | `vitest` | ✅ |
| Build | `next build` | ✅ (0 errors) |
| Security | `npm audit` | ⚠ Advisor |
| Bundle | `@next/bundle-analyzer` | ⚠ Limit 600KB |
| Coverage | `vitest --coverage` | ⚠ Min 60% |

## 4. Secrets in CI

In GitHub Actions, secrets via repository-level encrypted vars:

- `DATABASE_URL` (test instance)
- `NEXTAUTH_SECRET`
- `PI_SSH_KEY` (production deploy)
- `SENTRY_DSN`
- `SUPABASE_*`

Production deploy uses `PI_SSH_KEY` (no plaintext password).

## 5. Preview Deployments

GitHub-hosted feature branch → URL pattern:
```
<preview-name>.preview.montajimvar.xyz
```

Strategies (P2):
- **Vercel preview** — automatic
- **Coolify** on Pi — manual, URL per branch
- **Ngrok tunnel** — emergency only

## 6. Notifications

- ✅ GitHub Actions → Discord/Slack webhook
- ✅ Failure → email
- ✅ Success → silent (only on prod release)
- ✅ Sentry → release annotation
