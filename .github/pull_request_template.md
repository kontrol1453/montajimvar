---
name: CI Quality Gate
about: Required to pass before merge
title: 'CI check'
---

## CI Quality Gate

| Check | Status |
|---|---|
| Install (`npm ci`) | ⏳ |
| Lint (`npm run lint`) | ⏳ |
| Type check (`tsc --noEmit`) | ⏳ |
| Build (`npm run build`) | ⏳ |
| Unit tests | ⏳ |
| Security audit | ⏳ |
| Coverage ≥ 60% | ⏳ |
| Bundle ≤ 600KB | ⏳ |

All checks must be ✅ before merge.
