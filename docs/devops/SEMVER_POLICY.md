# Semantic Versioning Policy — Montajım Var

Bu doküman [Semantic Versioning 2.0.0](https://semver.org/) üzerine Montajım Var'a uygulanmıştır.

## 1. Version Format

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: breaking API, schema, or UI change
- **MINOR**: backward-compatible new feature
- **PATCH**: backward-compatible bug fix

Örnekler:
- `1.0.0` — production launch
- `1.1.0` — marketplace review photos feature
- `1.1.1` — fix for avatar upload regression
- `2.0.0` — auth rewrite (breaking)
- `1.2.0-beta.1` — pre-release tag

## 2. Pre-release Tags

| Format | Use |
|---|---|
| `X.Y.Z-alpha.N` | internal test |
| `X.Y.Z-beta.N` | external beta |
| `X.Y.Z-rc.N` | release candidate |

Örnek: `1.0.0-rc.1` → `1.0.0-rc.2` (fix found) → `1.0.0` (release)

## 3. Build Metadata

`X.Y.Z+<hash>` — `1.0.0+abc1234` (commit hash).

## 4. Tagging

```bash
# Annotated tag (imzalı)
git tag -a v1.0.0 -m "Release v1.0.0 - production launch"
git push origin v1.0.0

# GitHub Release oluşturma (CI otomatik)
# → Edit notes → publish
```

## 5. Version Bump Rules

| Change Type | Bump | Example |
|---|---|---|
| Bug fix | PATCH | 1.0.0 → 1.0.1 |
| New feature, backward-compatible | MINOR | 1.0.0 → 1.1.0 |
- Breaking change | MAJOR | 1.0.0 → 2.0.0 |
| Pre-release | tag | 1.1.0 → 1.1.1-rc.1 |
| Hotfix (from main) | PATCH | 1.0.0 → 1.0.1 |

## 6. package.json Version

`package.json` `version` field her release'de güncellenir. CI doğrular:

```yaml
- name: Verify version matches tag
  run: |
    PKG_VER=$(node -p "require('./package.json').version")
    TAG_VER=${GITHUB_REF#refs/tags/v}
    if [ "$PKG_VER" != "$TAG_VER" ]; then
      echo "Version mismatch: package.json=$PKG_VER tag=$TAG_VER"
      exit 1
    fi
```

## 7. CHANGELOG.md Format

```markdown
## [1.0.0] - 2026-07-17

### Added
- Production launch with marketplace, CRM, AI vision

### Changed
- Auth strategy: JWT with tokenVersion invalidation

### Removed
- Legacy SQLite support

### Fixed
- Rate limit on mobile-login (#123)

### Security
- DOMPurify for dangerouslySetInnerHTML (P0)
- HMAC-signed Google OAuth role cookie

### Breaking
- API response shape: `{ data }` → `{ data, meta }`
- Min Node version: 20.11

### Migration Notes
- `prisma migrate deploy` required
- Set `REFRESH_TOKEN_SECRET` env var

### Known Issues
- Account lockout on 5 failed attempts (15 min)
```

## 8. Release Cadence

| Tür | Sıklık |
|---|---|
| PATCH | ihtiyaç oldukça (haftada 1-2) |
| MINOR | her 2-4 hafta |
- MAJOR | her 6-12 ay, planlanmış |

## 9. Hotfix Path

```
main (v1.0.0)
  ↓ hotfix/auth-bug branch
  ↓ fix + tests
  ↓ PR → main + develop
  ↓ tag v1.0.1
  ↓ deploy
```

## 10. Y-Stream Support

Yalnızca **en son** minor sürüm desteklenir. Yani `1.2.x` çıktığında `1.1.x` bakımı durur. İstisna: security fix'lar son 2 minor'a backport.
