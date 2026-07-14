# MONTAJIM VAR — Public Site V5 Audit Report

**Date:** 2026-07-14  
**Scope:** Public-facing website (excluding admin, API routes, mobile)  
**Status:** Initial Audit Complete  
**Target:** WCAG 2.2 AA, professional UX/UI, conversion optimization

---

## 1. EXECUTIVE SUMMARY

Montajım Var is a Next.js 16 (App Router) project with Tailwind CSS v4, TypeScript, Prisma (SQLite), next-auth, and a v5 homepage design currently active. The public site has two parallel section sets (v4 legacy, v5 active), with the homepage using all v5 components. The codebase has significant **text contrast failures**, **design token fragmentation**, **unused legacy components**, **hardcoded colors**, and **inconsistent visual architecture**. The most critical issue is `--color-text-tertiary: #98a2b3` which has only ~2.9:1 contrast on white surfaces, failing WCAG AA.

---

## 2. TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| Language | TypeScript 5.x |
| CSS | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| UI Icons | lucide-react |
| Animation | framer-motion |
| Auth | next-auth v4 |
| Database ORM | Prisma 5.x (SQLite via `dev.db`) |
| Email | nodemailer |
| Notifications | web-push |
| Maps | leaflet |
| Toast | sonner |

---

## 3. PROJECT ARCHITECTURE

```
src/
├── app/
│   ├── (public)/       # Public route group (Navbar + Footer layout)
│   │   ├── v5/         # V5 homepage components (active)
│   │   ├── [city]/     # City pages
│   │   ├── ara/        # Search page
│   │   ├── auth/       # Auth pages
│   │   ├── blog/       # Blog list/single pages
│   │   ├── dashboard/  # User dashboard (protected)
│   │   ├── ...         # Other public pages
│   │   ├── page.tsx    # Homepage (v5 composition)
│   │   ├── layout.tsx  # Public layout (Navbar, Footer, etc.)
│   │   ├── HomeHero.tsx         # LEGACY - v4 hero
│   │   ├── HomeServices.tsx     # LEGACY - v4 services
│   │   ├── HomeStats.tsx        # LEGACY - v4 stats
│   │   ├── HowItWorksV4.tsx     # LEGACY - v4 workflow
│   │   ├── PlatformFeatures.tsx # LEGACY - v4 features
│   │   ├── ProductShowcase.tsx  # LEGACY - v4 showcase
│   │   ├── CorporateSection.tsx # LEGACY - v4 corporate
│   │   ├── WhySection.tsx       # LEGACY - v4 why
│   │   ├── FaqSection.tsx       # LEGACY - v4 FAQ
│   │   ├── FinalCta.tsx         # LEGACY - v4 final CTA
│   │   └── TrustBand.tsx        # LEGACY - v4 trust bar
│   ├── globals.css    # Global styles + @theme tokens
│   └── layout.tsx     # Root layout
├── components/
│   ├── ui/            # Shared UI primitives (Button, Card, Input, etc.)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MobileBottomNav.tsx
│   └── ...
└── lib/
    ├── prisma.ts
    ├── auth.ts
    └── utils.ts
```

---

## 4. ROUTE INVENTORY (Public Only)

| Route | Auth Required | Persona | Page Component | Status |
|---|---|---|---|---|
| `/` | No | All | `(public)/page.tsx` (v5) | Active |
| `/ara` | No | Customer | Search | Active |
| `/blog` | No | All | Blog list | Active |
| `/blog/[slug]` | No | All | Blog post | Active |
| `/is-ver` | No/Yes | Customer | Create job | Active |
| `/auth/giris` | No | All | Login | Active |
| `/auth/kayit` | No | Installer/User | Register | Active |
| `/kurumsal` | No | Corporate | Corporate solutions | Active |
| `/ekip-ol` | No | Installer | Installer landing | Active |
| `/isler` | No | Customer | Job listing | Active |
| `/dashboard/*` | Yes | All | User dashboard | Active |
| `/yardim` | No | All | Help center | Active |
| `/iletisim` | No | All | Contact | Active |
| `/kvkk` | No | All | KVKK page | Active |
| `/gizlilik` | No | All | Privacy | Active |
| `/cerez` | No | All | Cookie policy | Active |
| `/kullanim-kosullari` | No | All | Terms | Active |
| `/guvenlik` | No | All | Security | Active |
| `/is-sagligi` | No | All | OHS | Active |
| `/on-bilgilendirme` | No | All | Pre-info form | Active |
| `/is-ilanlari` | No | All | Job ads | Active |
| `/firma` | No | Corporate | Company profiles | Active |
| `/tasarim-a` through `/tasarim-f`, `/tasarim-yeni` | No | - | Design tests | Likely stale |
| `/[city]` | No | Customer | City pages | Active |

---

## 5. COMPONENT INVENTORY

### 5.1 Duplicate/Legacy Components

| Component | Legacy (v4) | Current (v5) | Status |
|---|---|---|---|
| Hero | `HomeHero.tsx` | `v5/HeroV5.tsx` | **v5 in use** |
| Trust Bar | `TrustBand.tsx` | `v5/TrustBar.tsx` | **v5 in use** |
| Services | `HomeServices.tsx` | `v5/ServiceDiscovery.tsx` | **v5 in use** |
| Workflow | `HowItWorksV4.tsx` | `v5/ProductWorkflow.tsx` | **v5 in use** |
| Stats | `HomeStats.tsx` | `v5/VerifiedMetrics.tsx` | **v5 in use** |
| Features | `PlatformFeatures.tsx` | `v5/PlatformCapabilities.tsx` | **v5 in use** |
| Showcase | `ProductShowcase.tsx` | (none direct) | **Legacy only** |
| Why | `WhySection.tsx` | `v5/WhyMontajimVar.tsx` | **v5 in use** |
| FAQ | `FaqSection.tsx` | `v5/FAQv5.tsx` | **v5 in use** |
| Final CTA | `FinalCta.tsx` | `v5/FinalConversionCTA.tsx` | **v5 in use** |
| Corporate | `CorporateSection.tsx` | `v5/CorporateOperations.tsx` | **v5 in use** |
| Audience | `(audience cards)` | `v5/AudienceGateway.tsx` | **v5 in use** |
| AI | `(AI in features)` | `v5/AITeaser.tsx` | **v5 in use** |
| Blog | - | `BlogSection.tsx` | **Active** |

**13 legacy homepage components are orphaned** — no longer imported by the current `page.tsx`, creating maintenance burden.

### 5.2 Shared UI Primitives

Located in `src/components/ui/`:
- `Button.tsx` — Admin-oriented (uses `--admin-*` tokens)
- `Card.tsx` — Admin-oriented
- `Input.tsx` — Not checked
- `FormField.tsx` — Not checked
- `Badge.tsx` — Not checked
- `Typography.tsx` — Admin-oriented (`PageTitle`, `SectionTitle`, `PageContainer`, `Stack`)

**No public-facing UI primitives exist.** All v5 components hand-code their own button/card styles, leading to inconsistencies.

---

## 6. CRITICAL VISUAL PROBLEMS

### P0 — Text Contrast Failures

| Token | Hex Value | Background | Contrast Ratio | WCAG AA |
|---|---|---|---|---|
| `--color-text-tertiary` | `#98a2b3` | `#ffffff` (surface) | **2.9:1** | **FAIL** |
| `--color-text-tertiary` | `#98a2b3` | `#f5f7fa` (secondary) | **2.7:1** | **FAIL** |
| `text-white/80` | rgba(255,255,255,0.8) | `#0a1628` (dark) | ~8.6:1 | PASS |
| `text-white/70` | rgba(255,255,255,0.7) | `#0a1628` (dark) | ~7.5:1 | PASS |
| `text-white/50` | rgba(255,255,255,0.5) | `#0a1628` (dark) | ~5.4:1 | PASS (large only) |
| `text-white/40` | rgba(255,255,255,0.4) | `#0a1628` (dark) | ~4.3:1 | **FAIL small text** |
| `text-white/30` | rgba(255,255,255,0.3) | `#0a1628` (dark) | ~3.2:1 | **FAIL** |
| `disabled:opacity-50` | varies | varies | varies | **FAIL** |

### P0 — `--color-text-tertiary` Usage (Partial List)

The token `#98a2b3` is used extensively across ALL v5 components:

- `HeroV5.tsx` — trust signals list items
- `TrustBar.tsx` — description text
- `AudienceGateway.tsx` — subtitle text, tag text
- `ServiceDiscovery.tsx` — tag badges, metadata text
- `ProductWorkflow.tsx` — step number, bullet text
- `PlatformCapabilities.tsx` — "Yakında" badge text
- `VerifiedMetrics.tsx` — helper text, disclaimer
- `WhyMontajimVar.tsx` — SLA reference text
- `FAQv5.tsx` — chevron icon
- `FinalConversionCTA.tsx` — trust indicators
- `BlogSection.tsx` — date/readtime, excerpt text
- `Footer.tsx` — all link text (#98a2b3 on dark bg: OK there)

### P0 — Color Inheritance Bugs

- `CorporateOperations.tsx` uses `section-dark` which sets white text, but some nested elements lack explicit color (relying on cascade from `.hero-section *` or `.section-dark`) — potential for invisible text when sections overlap styles
- `BlogSection.tsx` uses hardcoded `var(--color-dark)` for headings instead of themed tokens
- `MobileBottomNav.tsx` uses `text-[var(--color-text-tertiary)]` for inactive state

---

## 7. TEXT VISIBILITY PROBLEMS (Detailed)

### 7.1 Tertiary Text Everywhere

The `#98a2b3` token appears in 12+ components as the primary color for:
- Supporting/helper text
- Metadata/date text
- Badge labels
- Icon colors for non-interactive elements
- Subtitles
- Disclaimers
- Footer links (on dark bg this is OK)

**Fix**: Change `--color-text-tertiary` to at least `#6b7280` (~4.6:1 on white) or remove it and use `--color-text-secondary` (`#475467`, ~7.3:1) for readable text. Reserve tertiary for truly decorative elements only.

### 7.2 Disabled State Visibility

`Button.tsx` uses `disabled:opacity-50` which makes text ~50% opacity → on any background this reduces contrast by half. For white buttons on primary bg, this drops contrast from ~4:1 to ~2:1.

### 7.3 Hero Section on Dark Backgrounds

- `hero-section` CSS class forces `color: #ffffff !important` on all children
- `text-white/40` and `text-white/30` in dashboard mockup labels
- `text-white/50` for persona card descriptions
- These low-opacity whites create contrast ratios between 3:1 and 5:1

### 7.4 Gradient Text

`gradient-text` uses `-webkit-text-fill-color: transparent` which relies on the background gradient being visible. On some backgrounds this may render invisible.

---

## 8. ACCESSIBILITY PROBLEMS

| Issue | Location | Severity |
|---|---|---|
| `text-tertiary` contrast failure (2.9:1) | All v5 components | **Critical** |
| No visible `:focus-visible` styles on public site | Navbar, all sections | High |
| FAQ `<details>` lacks proper aria attributes | `FAQv5.tsx` | Medium |
| No `aria-expanded` on FAQ summary | `FAQv5.tsx` | Medium |
| No `aria-controls` on FAQ | `FAQv5.tsx` | Medium |
| No `aria-current` on Navbar links | `Navbar.tsx` | Medium |
| No `aria-label` on search/link elements | Multiple | Medium |
| No `alt` text on decorative persona icons | Multiple components | Low |
| Mobile menu lacks focus trap | `Navbar.tsx` | Medium |
| Keyboard navigation for FAQ details not optimized | `FAQv5.tsx` | Low |
| No skip-to-content link | Root layout | Medium |

---

## 9. RESPONSIVE PROBLEMS

| Issue | Location | Severity |
|---|---|---|
| Dashboard mockup hidden on mobile (`hidden lg:block`) | `HeroV5.tsx` | Low (intentional) |
| No horizontal overflow prevention on edge cases | Various | Medium |
| Card grids at 320px may squeeze text | All card sections | Medium |
| Footer grid collapses to single column | `Footer.tsx` | Low (acceptable) |
| Section padding inconsistent between v5 and old sections | Various | Low |
| No explicit mobile typography scale | All components | Medium |
| Touch target sizes not verified for 48px minimum | Navbar mobile links | Medium |

---

## 10. UX PROBLEMS

| Issue | Severity |
|---|---|
| Homepage has 14+ sections — too long for conversion funnel | High |
| Hero V5 has no dashboard preview (placeholder text: "Ürün ekran görüntüsü buraya eklenecek") | High |
| BlogSection renders NULL if no posts (fast but blank) | Low |
| "Platformu Keşfet" CTA links to `#platform` anchoring far down the page | Medium |
| No sticky/highlighted navigation for current section | Low |
| FAQ opens first item by default (always visible) | Medium |
| Two parallel FAQ implementations (v4 + v5) | Low |
| AI teaser section may be premature for current product stage | Medium |
| "v5" badge in hero section label looks like version number to users | Low |
| "Montajcı Kaydı" appears in mobile menu but "Giriş Yap" is the auth CTA — inconsistent | Medium |
| No demo request form — only a link to /kurumsal#teklif | Medium |

---

## 11. CONVERSION PROBLEMS

| Issue | Severity |
|---|---|
| Primary CTA "Ücretsiz İş Oluştur" vs old "İş Oluştur" — inconsistency | Medium |
| "Platformu Keşfet" CTA has unclear value prop outcome | Medium |
| No installer-specific primary CTA in hero | Medium |
| Trust signals (Emanet ödeme, Doğrulanmış ekipler, 81 il) are weak/generic | Medium |
| No social proof (real testimonials, case studies) | High |
| Statistics show **real 2.8 avg rating** → **negative social proof** | **Critical** |
| No phone/demo request in hero section for corporate visitors | Medium |
| Multiple CTAs competing: "İş Oluştur", "Montajcı Bul", "Kurumsal Çözümler", "Ekip Olarak Katıl" | Medium |

---

## 12. TRUST AND CREDIBILITY PROBLEMS

| Issue | Severity |
|---|---|
| `VerifiedMetrics` shows real `avgRating` (~2.8 from DB) which is **negative social proof** | **Critical** |
| AI Teaser features are labeled "Yakında" — honest but still premature | Medium |
| Dashboard mockup in V5 hero is empty placeholder | High |
| "7/24 Destek" trust metric claim — unverifiable | Medium |
| "Canlı Ekip Takibi" listed as "available" — needs verification | Medium |
| "AI Fiyat Tahmini" listed as "soon" — feature scope uncertainty | Low |
| Statistics disclaimer says "12 Temmuz 2026" — hardcoded date will stale | Low |
| HeroV5 section label says "Montajım Var · v5" — internal version shown to users | Low |

---

## 13. SEO PROBLEMS

| Issue | Severity |
|---|---|
| No `hreflang` tags despite Turkish-only content | Low |
| Blog pages have no-cache headers (next.config.js) — may affect SEO crawling | Medium |
| No breadcrumb structured data on inner pages | Low |
| Homepage heading hierarchy: h1 → h2 → h3 is correct in v5 | OK |
| No `meta keywords` (debatable SEO value) | Low |
| Page titles could be more specific per route | Medium |

---

## 14. PERFORMANCE PROBLEMS

| Issue | Severity |
|---|---|
| framer-motion loaded on all v5 sections (mostly client components) | Medium |
| Google Fonts (Inter, Manrope) loaded via external stylesheet — no font-display swap | Medium |
| No image optimization for blog cover images (uses `<img>` not `<Image>`) | Low |
| `getHomeData()` runs 5 Prisma queries on every homepage visit (dynamic) | Medium |
| HeroV5 and other sections are not server components (but many are already server components) | Varies |
| 13 legacy unused components still in bundle (tree-shaken but present) | Low |

---

## 15. CODE QUALITY PROBLEMS

| Issue | Location | Severity |
|---|---|---|
| 13 orphaned v4 homepage components | `(public)/*.tsx` | Medium |
| Hardcoded hex colors in v4 components | Legacy files | Low (not used) |
| `var(--color-dark)` vs `var(--color-text-primary)` inconsistency | Multiple | Medium |
| `btn-primary` class defined in globals.css but `Button.tsx` uses inline admin classes | All v5 sections | Medium |
| Navbar uses CSS variables but also hardcodes some text colors | `Navbar.tsx` | Medium |
| `section-dark` CSS class uses different bg than `hero-section` | globals.css | Low |
| Two separate FAQ data sources (`FAQS` vs `FAQ_ITEMS`) | constants files | Low |
| `cn()` utility is simply `filter(Boolean).join(" ")` — no clsx | `utils.ts` | Low |
| `ProductShowcase.tsx` has inline mockup JSX as functions | Very large component | Medium |
| `_lib/v5.constants.ts` is 469 lines — large for constants | Constants file | Low |

---

## 16. PROPOSED INFORMATION ARCHITECTURE

Based on the audit, the optimal homepage section order for conversion:

```
1.  [NEW] Announcement Bar          — optional, if active promo
2.  Header (Navbar)                 — sticky, CTA: İş Oluştur
3.  [IMPROVED] Hero                 — headline + CTA hierarchy + persona doors
4.  [IMPROVED] Trust Indicators     — 4 compact badges (escrow, verified, SLA, cities)
5.  [IMPROVED] Persona Gateway      — 3 persona cards (Customer, Installer, Corporate)
6.  [IMPROVED] Services             — 8 service categories from DB
7.  [IMPROVED] How It Works         — 4-step simplified workflow
8.  [IMPROVED] Platform Capabilities — 8 features with status badges
9.  [IMPROVED] Corporate Solutions  — B2B value prop + CTA
10. [IMPROVED] Real Statistics      — Remove avgRating, show real metrics
11. [AS-IS] Why Montajım Var       — 5 trust pillars
12. [IMPROVED] AI Teaser            — clearly labeled "Yakında"
13. [AS-IS] Blog Section            — 3 latest posts
14. [IMPROVED] FAQ                  — accessible accordion, 4-5 questions
15. [IMPROVED] Final CTA            — primary conversion action
16. [IMPROVED] Footer               — clean 4-column layout
```

Remove the duplicate "Platform Preview" (ProductShowcase) and merge its value into the capabilities section.

---

## 17. PROPOSED DESIGN SYSTEM IMPROVEMENTS

### 17.1 Semantic Color Tokens

```
Current:                              Proposed:
--color-text-primary: #101828         --color-foreground: #101828
--color-text-secondary: #475467       --color-muted-foreground: #5b6778  (new, ~4.7:1)
--color-text-tertiary: #98a2b3        --color-text-tertiary: REMOVE or #6b7280
--color-surface: #ffffff              --color-background: #ffffff
--color-surface-secondary: #f5f7fa    --color-muted: #f5f7fa
--color-border-light: #eaecf0         --color-border: #eaecf0
--color-border-default: #d0d5dd       --color-input: #d0d5dd
```

### 17.2 Fix Text Contrast Roadmap

1. Change `#98a2b3` to `#6b7280` (Tailwind gray-500) → ~4.6:1 on white (WCAG AA for small text)
2. Update `text-white/40` → `text-white/60` minimum in dashboard mockups
3. Update `text-white/50` → `text-white/65` minimum
4. Ensure `disabled:opacity-50` has sufficient contrast in all color variants
5. Remove `!important` cascade from `hero-section` CSS class
6. Standardize on semantic tokens vs hardcoded `var(--color-*)`

---

## 18. IMPLEMENTATION ROADMAP

### Phase 0 — Safety (Already Complete ✅)
- Codebase analyzed
- Git status: `feature/admin-v4-command-center` branch, uncommitted changes detected
- No destructive operations planned

### Phase P0 — Critical (Estimated: 1-2 batches)
1. Fix `--color-text-tertiary` contrast from `#98a2b3` to `#6b7280`
2. Fix all hero mockup low-opacity text (`white/40` → `white/60`, etc.)
3. Fix `disabled:opacity-50` contrast across button variants
4. Verify no invisible text on any section

### Phase P1 — High (Estimated: 3-4 batches)
1. Improve semantic token architecture in globals.css
2. Add `:focus-visible` styles to public site components
3. Fix Navbar active states and mobile accessibility
4. Improve Hero V5: replace empty placeholder, simplify personas
5. Remove "v5" badge from hero label
6. Add keyboard accessibility to FAQ accordion (aria-expanded, aria-controls)
7. Remove hidden avgRating from VerifiedMetrics (or use conditional rendering)
8. Standardize CTA terminology in constants

### Phase P2 — Medium (Estimated: 2-3 batches)
1. Remove orphaned legacy v4 components (verify nothing imports them)
2. Clean up duplicate constants, merge `homepage.constants.ts` into v5 constants
3. Improve CorporateOperations phone/contact conversion path
4. Remove stale design-test routes (tasarim-a through tasarim-f, tasarim-yeni) or hide from sitemap
5. Improve Footer: verify all links work, add proper hreflang if needed
6. Update BlogSection to use `next/image` for cover images

### Phase P3 — Optimization (Future)
1. SEO: BreadcrumbList structured data on subpages
2. Performance: font-display swap, image optimization
3. Code: merge duplicate constants, type cleanup
4. Animations: reduce framer-motion overhead on non-essential animations
5. Add `prefers-reduced-motion` support throughout

---

## 19. RISK ANALYSIS

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Changing `--color-text-tertiary` breaks visual balance | Low | Medium | Test all usage locations, keep slightly muted tone |
| Removing v4 orphaned components breaks imports | Low | High | Check `git grep` for import references before deleting |
| CSS variable changes affect admin area | Low | High | Use separate token namespace (already done via `--admin-*`) |
| Homepage section resequencing breaks anchor links | Medium | Medium | Verify all `#hash` links point to correct sections |
| Route changes break SEO | Low | High | Use 301 redirects if removing routes |
| Statistical data (rating) removal hides real data | Low | Medium | Keep count-based metrics, hide summary rating |

---

## 20. FILES EXPECTED TO CHANGE

### P0 Changes:
- `src/app/globals.css` — Fix `--color-text-tertiary`, fix disabled opacity, update hero section
- `src/app/(public)/v5/HeroV5.tsx` — Fix white/40 text, remove "v5" badge
- `src/app/(public)/v5/VerifiedMetrics.tsx` — Conditionally hide avgRating

### P1 Changes:
- `src/app/globals.css` — Add semantic color tokens, add focus-visible
- `src/components/ui/Button.tsx` — Fix disabled contrast, add public-side variant
- `src/components/Navbar.tsx` — Add aria-current, focus-visible, improved mobile menu
- `src/app/(public)/v5/FAQv5.tsx` — Add aria attributes, keyboard support
- `src/app/(public)/v5/_lib/v5.constants.ts` — Standardize CTA terminology
- `src/app/(public)/page.tsx` — Section resequencing if needed

### P2 Changes:
- Delete orphaned v4 sections if safe
- `src/app/(public)/BlogSection.tsx` — next/image
- `src/app/(public)/v5/CorporateOperations.tsx` — Add contact/demo path
- `src/components/Footer.tsx` — Verify all links

---

## AUDIT COMPLETE

**Total issues found:** 40+  
**P0 (Critical):** 4  
**P1 (High):** 8  
**P2 (Medium):** 12  
**P3 (Optimization):** 8+  
**Legacy cleanup:** 13 orphaned components
