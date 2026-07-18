# Montajım Var — UI Changelog

## Globals.css Changes

### Phase 1 — Complete Restructure (`403ca83`)
Migrated from dark-themed legacy CSS variables to a light design system.

#### @theme Section — All Design Tokens
- Removed legacy `--clr-*` dark/light theme variables
- Removed theme-dependent `.bg-dark-bg`, `.bg-dark-card`, `.border-dark-border`, `.text-muted-text`, `.text-sub-text`, `.text-white` overrides
- Added comprehensive color system:
  - **Brand**: `--color-primary: #0B5FFF`, `--color-accent: #00C853`
  - **Surface**: `--color-surface: #ffffff`, `--color-surface-secondary: #f5f7fa`, `--color-surface-tertiary: #eef0f4`
  - **Text**: `--color-text-primary: #101828`, `--color-text-secondary: #475467`, `--color-text-tertiary: #98a2b3`, `--color-text-white: #ffffff`
  - **Border**: `--color-border-light: #eaecf0`, `--color-border-default: #d0d5dd`
  - **Shadow system**: card, card-hover, elevated, button
  - **Semantic colors**: success, warning, danger, info, premium (plus -soft variants)
- Added typography scale: `.heading-xl`, `.heading-lg`, `.heading-md` (with Manrope font-family)
- Added `.container-app` (max-width 1440px, responsive padding)
- Added `.card` system (base with hover lift effect)
- Added `.btn-primary`, `.btn-secondary`, `.btn-accent` button variants
- Added `.section-label` style (pill badge for section introductions)
- Added animations: `fade-in-up`, `fade-in`, `count-up`
- Retained legacy backward-compat classes mapping old names to new tokens

### Phase 2 — v4-faz2 (`398ae73`)
- Made heading sizes responsive with `clamp()`: `.heading-xl` → `clamp(2rem, 5vw, 3rem)`, `.heading-lg` → `clamp(1.75rem, 4vw, 2.5rem)`, `.heading-md` → `clamp(1.5rem, 3vw, 2rem)`
- Added `.gradient-text` (primary→accent gradient for emphasis)
- Added `.section-dark` for dark-background sections (CorporateOperations)
- Added `prefers-reduced-motion` media query for accessibility
- Added `.animate-scale-in` animation

### Phase 3 — Admin Design Tokens (`d6d225c`)
- Added admin-specific tokens: `--admin-surface`, `--admin-border`, `--admin-text-*`, `--admin-sidebar-*`, `--admin-radius-*`, `--admin-z-*`
- Added admin utility classes: `.admin-surface`, `.admin-border`, `.admin-text-primary`, `.admin-ring`, `.admin-content`
- Added `.focus-visible:focus-visible` keyboard-only focus ring
- Added `::selection` styling with primary-soft background

### Phase 4 — Final Current State
- Expanded button system: `.btn` base class + `.btn-sm`, `.btn-md`, `.btn-lg`, `.btn-xl` sizes + `.btn-outline`, `.btn-ghost`, `.btn-danger`, `.btn-success`, `.btn-premium` variants
- Added form system: `.form-input`, `.form-label`, `.form-error`, `.form-help`, `.form-select`, `.form-textarea` with error states and focus rings
- Added badge system: `.badge` base + `.badge-sm`, `.badge-md` + `.badge-neutral`, `.badge-info`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-premium`
- Added alert system: `.alert` base + `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-danger`
- Added skeleton loading: `.skeleton` + `shimmer` animation
- Added empty state: `.empty-state`, `.empty-state-icon`, `.empty-state-title`, `.empty-state-description`
- Added animations: `slide-in-right`, `spin`
- Added `.skip-link` for keyboard accessibility
- Removed deprecated legacy classes: `bg-dark-bg`, `bg-dark-section`, `border-dark-border`, `bg-montaj`, `text-montaj` mappings for hero section
- Consolidated shadow system under `--shadow-*` tokens
- Removed legacy brand color `--color-montaj: #ff7a00` and its derivatives
- Added `--space-*` spacing scale for admin
- Added `--z-*` z-index scale
- Added `--container-max` and `--container-narrow`

---

## Auth Pages Fixes

### Giriş Yap (`src/app/(public)/auth/giris/page.tsx`)
- Replaced `text-white` → design system heading (`h3`, `body-small`)
- Replaced `text-montaj` → `text-[var(--color-primary)]`
- Replaced legacy button classes → `btn btn-secondary btn-lg`, `btn btn-primary btn-lg`
- Replaced `bg-dark-card` → `card`
- Replaced `bg-red-900/20 text-red-400` → `alert alert-danger` with `role="alert"`
- Replaced legacy form inputs → `form-input`, `form-label` classes
- Fixed Google SVG icon with proper brand colors (hardcoded `fill` paths: `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`)
- Added proper ARIA attributes (`role="alert"` on error message)
- Used CSS variable references instead of hardcoded colors

### Kaydol (`src/app/(public)/auth/kayit/page.tsx`)
- Replaced `text-white` → `h3`, `body-small`
- Replaced `bg-dark-card` → `card`
- Replaced legacy button classes → `btn btn-secondary btn-lg`, `btn btn-primary btn-lg`
- Replaced form inputs → `form-input`, `form-label`, `form-select`
- Replaced error div → `alert alert-danger` with `role="alert"`
- Replaced Google button inline styles → `btn btn-secondary btn-lg w-full gap-2`
- Fixed Google SVG icon with hardcoded brand colors
- Success state uses `card` and `h3` with design system tokens

### Şifre Unuttum (`src/app/(public)/auth/sifre-unuttum/page.tsx`) — Partial
- Updated to use `Card`, `Input`, `Button` UI components
- **Not yet migrated**: `text-white`, `text-muted-text`, `text-montaj`, `text-green-400`, `bg-red-900/20 text-red-400` still present
- Uses `Card` component but with `className` overrides that reference legacy tokens

### Şifre Sıfırla (`src/app/(public)/auth/sifre-sifirla/page.tsx`) — Partial
- Updated to use `Card`, `Input`, `Button` UI components
- **Not yet migrated**: `text-white`, `text-muted-text`, `text-montaj`, `text-sub-text`, `text-green-400`, `text-red-400`, `bg-red-500/20`, `bg-green-500/20` still present
- Uses `Card` component with legacy class overrides

---

## UI Components Updated

### Button.tsx
- Migrated from `bg-montaj` / `bg-dark-card` to design system admin tokens (`--admin-primary`, `--admin-surface`)
- Added `xl` size variant (not present in admin, but `.btn-xl` exists in CSS)
- Added `forwardRef` for ref forwarding
- Added `premium`, `outline` variants
- Added `aria-busy` on loading state
- Added `leadingIcon` and `trailingIcon` props
- Loading state uses inline spinner SVG instead of hardcoded class
- Changed `focus:ring-*` patterns → `focus-visible:ring-*` for accessibility

### Card.tsx
- Migrated from `bg-dark-card border-dark-border` → admin design system tokens
- Added `variant` prop: `"default"` (shadow-sm), not yet using the CSS `.card-*` variants
- Added `padding` prop options: `"sm"`, `"md"`, `"lg"`, `false`
- Added `flush` prop for removing border-radius
- Added `...rest` spread for additional HTML attributes

### Input.tsx
- Migrated from `bg-dark-card text-white border-dark-border` → admin design system tokens
- Added `helperText` prop for contextual help text
- Added `aria-invalid` linking to error state
- Added `aria-describedby` linking to error/helper text IDs
- Error message uses `role="alert"` with design system color token
- Updated focus ring: `focus:ring-montaj` → `focus:ring-[var(--admin-primary)]/50`
- Error input border: `border-red-500` → `border-[var(--admin-danger)]`

### Badge.tsx
- Migrated from dark theme inline classes → badge CSS classes with admin tokens
- Added variant mapping: `neutral`, `info`, `success`, `warning`, `danger`, `premium`, `default` (deprecated → neutral)
- Added `size` prop: `"sm"`, `"md"`
- Removed `"default"` variant in favor of `"neutral"`

### FormField.tsx
- **New component** for admin form fields with built-in label, error, helper text
- Uses `htmlFor`/`id` linking with generated IDs from label text
- `aria-invalid` and `aria-describedby` for accessibility
- `role="alert"` on error messages
- Required indicator with `aria-hidden` asterisk

### Typography.tsx
- **New component**: `PageTitle`, `SectionTitle`, `PageContainer`, `Stack`
- Uses `h3` and `h4` classes (from design system CSS)
- `PageTitle` renders as `h1` with optional description and actions toolbar
- `SectionTitle` renders as `h2` with optional description and actions
- `PageContainer` provides responsive max-width container
- `Stack` provides consistent vertical spacing

---

## Layout Changes

### Public Layout (`src/app/(public)/layout.tsx`)
- Added skip-to-content link (`<a href="#main-content" class="skip-link">`) as first focusable element
- Main element has `id="main-content"` and `tabIndex={-1}` for programmatic focus
- Root layout font loading maintained (Google Fonts: Inter, Manrope)

### Admin Shell
- Skip-to-content link added
- Admin-specific layout tokens wired into CSS

---

## Search Page Fix (`src/app/(public)/ara/page.tsx`)
- Replaced `text-white` heading → `h2` design system class
- Removed legacy `bg-dark-card` class from filter card → `card`
- Search form container uses `card` class instead of `bg-dark-card`

---

## İş Ver Page Fix (`src/app/(public)/is-ver/page.tsx`)
- Replaced `text-white` heading → `h2` design system class
- Replaced `text-muted-text` → `body-small`

---

## Blog Section Fix (`src/app/(public)/BlogSection.tsx`)
- **Not yet fully migrated** — uses legacy CSS variables (`var(--color-dark)`, `var(--color-surface-secondary)`, `var(--color-primary)`, `var(--color-primary)`)
- Uses `card` class but overrides with legacy tokens via inline `var()` references
- Hidden when no blog posts exist (returns `null`)

---

## V5 Section Components Created

New homepage components in `src/app/(public)/v5/`:
- `HeroV5.tsx` — Search bar, category pills, CTAs, trust signals, mock panel
- `TrustBar.tsx` — 4-column trust row
- `AudienceGateway.tsx` — 4-card audience selector
- `ServiceDiscovery.tsx` — Category grid with DB-driven tags
- `ProductWorkflow.tsx` — 4-step process with speed stat
- `PlatformCapabilities.tsx` — 10-capability grid with status badges
- `CorporateOperations.tsx` — B2B dark section
- `VerifiedMetrics.tsx` — Live DB stats
- `AITeaser.tsx` — AI feature preview
- `WhyMontajimVar.tsx` — Differentiator cards
- `FAQv5.tsx` — Accordion with schema.org LD+JSON
- `FinalConversionCTA.tsx` — Final CTA card
- `_lib/v5.constants.ts` — All copy, icons, and type definitions

All v5 components use design system: `.container-app`, `.heading-xl/lg`, `.section-label`, `.btn-primary/secondary`, `.card` conventions, `aria-labelledby` on sections, semantic heading hierarchy.

---

## Files Modified

| File | Summary |
|------|---------|
| `src/app/globals.css` | Complete design system restructure: tokens, typography, components, admin layer |
| `src/app/(public)/page.tsx` | Updated to use v5 section components with DB-driven data |
| `src/app/(public)/layout.tsx` | Added skip-to-content link |
| `src/app/(public)/auth/giris/page.tsx` | Migrated to design system: card, form-input, btn, alert, ARIA |
| `src/app/(public)/auth/kayit/page.tsx` | Migrated to design system: card, form-input, btn, alert, ARIA |
| `src/app/(public)/auth/sifre-unuttum/page.tsx` | Partial migration: Card/Input/Button components used, legacy classes remain |
| `src/app/(public)/auth/sifre-sifirla/page.tsx` | Partial migration: Card/Input/Button components used, legacy classes remain |
| `src/app/(public)/ara/page.tsx` | Fixed heading to `h2`, removed `bg-dark-card` |
| `src/app/(public)/is-ver/page.tsx` | Fixed heading to `h2`, description to `body-small` |
| `src/components/ui/Button.tsx` | Full redesign: admin tokens, xl size, forwardRef, aria-busy, leading/trailing icons |
| `src/components/ui/Card.tsx` | Full redesign: variant/padding/flush props, admin tokens, HTML attr spread |
| `src/components/ui/Input.tsx` | Full redesign: helperText, ARIA attributes, admin tokens |
| `src/components/ui/Badge.tsx` | Full redesign: CSS badge system, admin tokens, deprecate "default" variant |
| `src/components/ui/FormField.tsx` | New component with full ARIA and design system integration |
| `src/components/ui/Typography.tsx` | New component: PageTitle, SectionTitle, PageContainer, Stack |
| `src/app/(public)/v5/*` | 12 new section components + constants file |

### Files Still Using Legacy Patterns
| File | Issue |
|------|-------|
| `src/app/(public)/auth/sifre-unuttum/page.tsx` | `text-white`, `text-muted-text`, `text-montaj`, `text-green-400` |
| `src/app/(public)/auth/sifre-sifirla/page.tsx` | `text-white`, `text-muted-text`, `text-montaj`, `text-sub-text` |
| `src/app/(public)/BlogSection.tsx` | `var(--color-dark)`, `var(--color-surface-secondary)` |
| `src/app/(public)/[city]/[service]/page.tsx` | `bg-dark-card`, `bg-dark-bg`, `text-white`, `text-montaj` |
| `src/app/(public)/yardim/page.tsx` | `bg-dark-card`, `bg-dark-section`, `text-white`, `text-muted-text`, `bg-montaj` |
| `src/app/(public)/isler/[id]/page.tsx` | Extensive `bg-dark-card`, `text-white`, `text-muted-text`, `bg-montaj` patterns |
| `src/app/(public)/isler/[id]/JobDetailClient.tsx` | Legacy dark theme classes throughout |
| `src/app/admin/NotificationBell.tsx` | `text-montaj`, `bg-montaj` in notification badge |
| Various admin pages | Inline `bg-[var(--admin-primary)] text-white` button patterns (acceptable for admin) |
