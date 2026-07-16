# MONTAJIM VAR — Platform Constitution (Platform Anayasası)

> Bu doküman, Montajım Var platformununın tek doğruluk kaynağıdır (Single Source of Truth). Tüm oturumlar, sprintler ve mimari kararlar bu anayasaya referans verir. Anayasa, OpenCode'un her yeni oturumunda yüklenen ilk dokümandır.

| Alan | Değer |
|---|---|
| Sürüm | 1.0 — 2026-07-17 |
| Sahiplik | Teknik Lead (bu dokümanı imzalar) |
| Değişiklik | RFC süreci — anayasa değişikliği için tüm mühendislerin onayı |
| Öncelik | Bu doküman > diğer tüm dokümanlar > sprint planları |

---

## 1. Ürün Vizyonu

**Montajım Var**, kurumsal firmalar ile doğrulanmış montaj ekiplerini buluşturan bir Türkiye platformudur. Birincil değer önerisi: güvenli, hızlı ve denetlenebilir montaj hizmeti eşleştirmesi.

- **Müşteri**: Firma sahipleri (mobilya, klima, tabela, AVM, fuar, elektrik)
- **Sağlayıcı**: Doğrulanmış montaj ekipleri (ASSEMBLER) ve üreticiler (MANUFACTURER)
- **Akış**: Kayıt → Profil → İlan → Teklif → Mesaj → İş → Ödeme → Yorum → İhtilaf

---

## 2. Yazılım Mimarisi Prensipleri

1. **Next.js App Router** — RSC öncelikli, client component minimal
2. **TypeScript Strict** — `any` yasak, `unknown` tercih, `as` yalnızca gerektiğinde
3. **Prisma ORM** — raw SQL yok, her tablo Prisma modeline sahip
4. **PostgreSQL** (Neon) — sunucusuz, TLS zorunlu
5. **Supabase Storage** — imzalı URL'ler, 15dk TTL
6. **Auth.js v5** — JWT strateji, `tokenVersion` ile invalidasyon
7. **Single instance** (Raspberry Pi) — scale yok; mimari buna göre
8. **Defensive coding** — her API route: auth → validate → authorize → execute → audit

**Yasaklar**:
- ❌ `dangerouslySetInnerHTML` without DOMPurify
- ❌ `Math.random()` for security-sensitive values
- ❌ `|| "fallback"` for secrets (env zorunlu)
- ❌ `any` type without justification comment
- ❌ Direct DB access without Prisma

---

## 3. Kodlama Standartları

- **Indentation**: 2 space
- **Naming**: `camelCase` function/variable, `PascalCase` component/type/interface, `SCREAMING_SNAKE` constants
- **Imports**: order = external → `@/` internal → relative
- **Error handling**: try/catch, Sentry capture, user-friendly message
- **Comments**: yalnızca "neden" için, "ne" için değil. Kod kendini anlatmalı
- **No dead code** — `depcheck` sprint sonunda çalıştırılır

---

## 4. UI/UX İlkeleri

- **Mobile-first**, RTL/LTR destekli
- **Design System** — `src/components/ui/*` içinde, değiştirilebilir değil
- **Contrast** — WCAG AA minimum (4.5:1)
- **Touch target** — minimum 44px
- **Loading states** — her async iş için skeleton/spinner
- **Form validation** — client-side early feedback, server-side zod authoritative
- **Toast** — `sonner` kullan, native alert yasak

---

## 5. Design System Kuralları

- **Renk paleti**: CSS variables (`--color-*`), Tailwind tema
- **Typography**: Inter (body) + Manrope (display)
- **Spacing**: 4px grid
- **Icons**: `lucide-react` only
- **Motion**: `framer-motion` subtle, ≤ 200ms duration
- **Dark mode**: destek yok (P2 backlog)

---

## 6. Veritabanı Tasarım Standartları

- Her tabloda `id` (Int, autoincrement) PK
- `createdAt` / `updatedAt` — tüm modellerde
- **Soft delete** → `deletedAt: DateTime?` (P2, uygulanacak)
- **Index** — sık sorgulanan alanlar için composite
- **Foreign keys** — Prisma relation zorunlu
- **Migrations** — `prisma migrate dev` local, `migrate deploy` prod
- **Seed** — `prisma/seed.ts` (idempotent)

---

## 7. API Standartları

- **REST** — `GET/POST/PUT/PATCH/DELETE` standart
- **Response**: `{ data: T } | { error: string }`
- **Status codes**: 200/201/400/401/403/404/409/429/500
- **Validation**: `zod` — `src/lib/validation.ts` schemas
- **Auth**: `auth()` → session → `roles.includes("ADMIN")` or `hasPermission`
- **Rate limit**: middleware — 10/min auth, 100/min API
- **Error leak**: stack trace client'a dönmez, Sentry'e gider
- **Versioning**: URL prefix yok (henüz); breaking change → migration playbook

---

## 8. Güvenlik Politikaları

- **Secrets**: `.env` (`.gitignore`'da), Vault (P2)
- **Hardcoded fallback**: ❌ (env eksikse fail-fast)
- **CSP**: strict, nonce-based (P2 hedefi)
- **Rate limit**: auth + API (middleware)
- **Auth**: bcrypt 12 rounds, JWT 24h, token invalidasyon
- **File upload**: DOMPurify + MIME whitelist + crypto random name
- **Audit**: `/admin/audit-logs` (P2 genişletme)
- **OWASP Top 10**: P0/P1 kapalı, P2 backlog

---

## 9. Performans Hedefleri

| Metrik | Hedef | Ölçüm |
|---|---|---|
| LCP | ≤ 2.5s | Vercel Analytics |
| FID/INP | ≤ 200ms | Vercel Analytics |
| CLS | ≤ 0.1 | Vercel Analytics |
| API p95 | ≤ 2s | Sentry |
| Build time | ≤ 60s | CI |
| Bundle size | ≤ 500KB first load | `@next/bundle-analyzer` |
| TTFB | ≤ 600ms | Lighthouse |

---

## 10. Dokümantasyon Kuralları

- **Markdown** — Türkçe içerik, İngilizce kod
- **Pattern**: `docs/<area>/<NN>_<name>.md` (NN: 00..99)
- **Update**: her sprint sonunda dokümantasyon güncellenir
- **Quality**: her dosyada: son güncelleme, sahiplik, sürüm
- **Truth**: kod > doküman — doküman yanlışsa kod doğrudur

---

## 11. Sprint ve Geliştirme Süreçleri

- **Sprint**: 1 hafta, Çarşamba başlar
- **Branch**: `feature/<area>-<desc>` (örn: `feature/security-middleware`)
- **PR**: her değişiklik PR üzerinden, ana branch'a direkt commit yasak
- **Review**: en az 1 onay (self-merge yasak, P2)
- **DoD** (Definition of Done): build pass + test pass + lint pass + typecheck pass + preview URL + doc updated
- **Demo**: her sprint sonunda canlıda preview

---

## 12. Code Review Kontrol Listesi

Before merge:
- [ ] Build pass (0 TS error)
- [ ] Lint pass (0 error)
- [ ] Tests pass (if affected)
- [ ] No `any` without justification
- [ ] No `dangerouslySetInnerHTML` without sanitize
- [ ] No hardcoded secrets
- [ ] No `Math.random()` for security
- [ ] Docs updated (if architecture change)
- [ ] Preview URL generated
- [ ] QA approved

---

## 13. Definition of Done (DoD)

A task is complete iff ALL:
1. Code implemented and committed
2. Build passes — `npm run build` 0 error
3. Lint passes — `npm run lint` 0 error
4. Typecheck passes — `tsc --noEmit` 0 error
5. Tests pass (if applicable)
6. Preview deployed to test.montajimvar.xyz
7. Documentation updated
8. PR created and reviewed
9. User approval received

---

## 14. Release Politikası

- **Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **MAJOR**: breaking API/schema/UI change
- **MINOR**: backward-compatible feature
- **PATCH**: bug fix
- **Tag**: `v1.0.0` format, `git tag` + GitHub Release
- **Release notes**: `CHANGELOG.md` + GitHub Release Notes
- **Rollback**: son çalışır tag'e revert + redeploy

---

## 15. Teknik Borç Yönetimi

- **TECH_DEBT.md** — her sprintte güncellenir
- **Takip**: her borç için — tarih, etkilenen dosya, öncelik (P1/P2/P3), giderme maliyeti
- **Kota**: her sprintte en az 1 P2 borcu giderilir
- **Limit**: toplam P1+P2 borcu 20'yi geçtiğindefeature freeze
- **Strike-zone**: P3'ler backlog'ta kalabilir

---

## 16. AI Kullanım Kuralları

- **AI code with review** — AI tarafından üretilen kod mutlakagözden geçir
- **Critical path**: auth/payment/admin — AI'a bırakılabilir ama PR review zorunlu
- **Tests**: AI test üretebilir ama coverage manuel doğrulanır
- **Secrets**: AI'a asla production secret verme
- **Hallucination**: AI ürettiği API/library var mı doğrula
- **Tokens**: optimize modal kullanımı, gereksiz context yok

---

## 17. Mimari Karar Kayıtları (ADR)

Her önemli mimari karar için `docs/adrs/<NN>-<title>.md`:

```
# ADR-001: JWT yerine db session?

## Context
...

## Decision
...

## Consequences
...
```

---

## 18. OPERATIONAL READİNESS — Dağıtım Yasakları

Aşağıdakiler olmadan **asla production dağıtımı**:
- ❌ Build pass yoksa
- ❌ Migrations test edilmediyse
- ❌ Backup alınmadıysa
- ❌ Rollback planı yoksa
- ❌ Smoke test yapılmadıysa
- ❌ User approval yoksa

---

## 19.宪法 supremacy

Bu anayasa ile diğer dokümanlar arasında çatışma varsa **anayasa kazanı**r. Anayasa değişikliği yalnızca:
1. Teknik Lead'in RFC proposal'ı
2. Tüm mühendislerin onayı
3. `docs/adrs/<NN>-constitution-amend.md` kaydı

ile mümkündür.

---

## 20. İmza

| Rol | Onay |
|---|---|
| Technical Lead | ✅ 2026-07-17 |
| DevOps Architect | ✅ 2026-07-17 |
| Security Champion | ✅ 2026-07-17 |

---

**Referanslar**:
- `docs/mveds/` — tüm sprint genel dokümanları
- `docs/devops/` — operasyonel süreçler
- `docs/adrs/` — mimari karar kayıtları
- `TECH_DEBT.md` — teknik borç kaydı
- `CHANGELOG.md` — release geçmişi
