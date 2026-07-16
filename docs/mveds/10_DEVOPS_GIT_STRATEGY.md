# Git Strategy — Montajım Var

## 1. Branching Model (GitFlow Lite)

```
main            ← production-ready, always deployable
├ develop       ← integration branch for next release
├ feature/*     ← feature work
├ release/*     ← release prep
├ hotfix/*      ← production emergency fixes
└ bugfix/*      ← non-emergency bug fixes
```

## 2. Branch Rules

| Branch | Prefix | Lifetime | Merge to |
|---|---|---|---|
| `main` | — | forever | — |
| `develop` | — | forever | `main` (at release) |
| `feature/<area>-<short-desc>` | `feature/` | 1-7 gün | `develop` |
| `release/v<semver>` | `release/` | 1-3 gün | `main` + `develop` |
| `hotfix/<desc>` | `hotfix/` | <24 saat | `main` + `develop` |
| `bugfix/<desc>` | `bugfix/` | <7 gün | `develop` |

### Examples

```
feature/security-middleware
feature/admin-crm-export
feature/marketplace-review-photos
release/v1.0.0
hotfix/auth-jwt-expiry-bug
bugfix/admin-table-pagination
```

## 3. Current State Cleanup

Mevcut dallar:

| Branch | Aksiyon |
|---|---|
| `master` | **Yeniden adlandır** → `main` |
| `feat/admin-command-center` | PR aç, `develop`'a merge et |
| `feature/admin-v3`, `feature/admin-v4-command-center` | Sil (stale) |
| `feature/homepage-v5` | PR aç veya sil |
| `test/preview-20260710` | Sil |
| `opencode/gentle-lagoon` | PR aç veya sil |

## 4. Branch Protection Rules (GitHub)

`main` ve `develop` için:

- ✅ Require PR before merge
- ✅ Require approvals: 1 (P2: 2)
- ✅ Dismiss stale approvals on new push
- ✅ Require status checks: build, lint, typecheck, test
- ✅ Require branches up-to-date before merge
- ✅ Require signed commits (P2)
- ✅ Require linear history (squash + merge)
- ❌ Allow force pushes
- ❌ Allow deletions

## 5. Commit Message Convention

Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

| Type | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic |
| `refactor` | No behavior change |
| `perf` | Performance |
| `test` | Tests |
| `chore` | Build, deps, tooling |
| `ci` | CI/CD |
| `revert` | Revert previous |

Examples:
```
feat(security): add middleware rate limiting
fix(auth): handle expired JWT gracefully
docs(devops): add backup strategy
chore(deps): bump next to 16.2.10
```

## 6. PR (Pull Request) Process

### Required

- PR title: conventional commit
- PR description uses `PULL_REQUEST_TEMPLATE.md`
- Linked issue (e.g., `Closes #123`)
- Screenshots/recordings for UI changes
- Test plan with reproduction steps
- At least 1 approval
- All status checks pass

### squash + merge

- squash commits into single commit
- merge commit message = PR title + description

## 7. SSH Key Authentication

### Problem

`deploy-local.bat` uses `plink -pw 123456 pi@192.168.0.38` — cleartext password.

### Fix

1. Generate SSH key (no passphrase for Pi deploy):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/montajimvar-pi -N ""
   ```
2. Copy public key to Pi:
   ```bash
   ssh-copy-id -i ~/.ssh/montajimvar-pi.pub pi@192.168.0.38
   ```
3. Update `deploy-local.bat`:
   - Remove `-pw 123456`
   - Add `-i C:\Users\User\.ssh\montajimvar-pi`
4. Disable password auth on Pi:
   ```bash
   sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
   sudo systemctl restart ssh
   ```

## 8. Tagging Strategy

Every release:
```bash
git tag -a v1.0.0 -m "Release v1.0.0 - production launch"
git push origin v1.0.0
```

GitHub Release notes auto-generated from `CHANGELOG.md`.

## 9. Migration Plan (from current state)

1. Rename `master` → `main` (GitHub UI + local)
2. Create `develop` from `main`
3. Set `main` as default branch in GitHub
4. Apply branch protection on `main` + `develop`
5. Open PRs for stale feature branches (or delete)
6. Generate SSH key, swap deploy script
7. Tag current commit as `v0.1.0` (pre-release baseline)
8. Set up PR template
