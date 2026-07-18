# VISUAL BUGS INVENTORY
## Montajım Var Platform — Phase 9-10 Audit
### Version 1.0

---

## Overview

This document catalogs every visual defect identified in the Montajım Var codebase. 
Defects were identified through static code analysis of components, CSS, and page structures.
Severity is classified as:

| Severity | Definition |
|----------|------------|
| **Critical** | Makes content invisible, unreadable, or breaks core functionality |
| **High** | Significant visual inconsistency or usability friction |
| **Medium** | Noticeable but non-blocking visual issue |
| **Low** | Minor polish issue |

---

## CRITICAL VISUAL DEFECTS

### C-01: White Text on Light Backgrounds (Auth Pages)

| Field | Value |
|-------|-------|
| **Location** | `src/app/(public)/auth/giris/page.tsx:77`, `src/app/(public)/auth/kayit/page.tsx:97` |
| **Description** | Auth pages use `<h1 className="text-2xl font-bold text-white">` for headings inside a `Card` component. If the Card renders a white/light background, the white text becomes invisible. The Card component from `@/components/ui/Card` wraps content — its background color is not explicitly controlled, creating a white-on-white risk. |
| **Severity** | **CRITICAL** |
| **Affected Browsers** | All |
| **Root Cause** | Mixed CSS systems: auth pages use legacy dark-theme classes (`text-white`, `bg-dark-card`) while the Card component may use design system tokens (`--color-surface: #ffffff`) |
| **Suggested Fix** | Ensure Card background is explicitly dark (`bg-[var(--color-dark)]` or `#1a1a1a`) or change heading text to use `text-[var(--color-text-primary)]` |

### C-02: Legacy Orange Brand Color in Auth Pages

| Field | Value |
|-------|-------|
| **Location** | `src/app/(public)/auth/giris/page.tsx:137`, `src/app/(public)/auth/kayit/page.tsx:84,156,158,188` |
| **Description** | Auth pages use `.text-montaj`, `.bg-montaj`, `.hover:bg-montaj-dark`, `border-montaj` which reference the OLD brand color `--color-montaj: #ff7a00` (orange). The design system primary is now `--color-primary: #0B5FFF` (blue). This creates an inconsistent brand experience — users see orange buttons/links on auth pages and blue everywhere else. |
| **Severity** | **CRITICAL** |
| **Affected Browsers** | All |
| **Root Cause** | Auth pages were built during the old orange brand era and not updated to the blue design system |
| **Suggested Fix** | Replace all `text-montaj` → `text-[var(--color-primary)]`, `bg-montaj` → `bg-[var(--color-primary)]`, `border-montaj` → `border-[var(--color-primary)]` |

### C-03: Card Background Uncertainty on Auth Pages

| Field | Value |
|-------|-------|
| **Location** | `src/app/(public)/auth/giris/page.tsx:75`, `kayit/page.tsx:95` |
| **Description** | Both auth pages wrap content in `<Card className="w-full max-w-md">` and `<Card className="w-full max-w-lg">`. The Card component's background and text colors are not explicitly set for the dark theme context. Auth pages assume a dark background (`bg-dark-card` is not applied to Card wrapper itself), while the design system Card uses `background: var(--color-surface)` which is white. |
| **Severity** | **CRITICAL** |
| **Affected Browsers** | All |
| **Suggested Fix** | Add explicit dark styling to Card when used in auth context, or remove the legacy dark theme assumption |

---

## HIGH VISUAL DEFECTS

### H-01: Mixed CSS Systems Throughout Pages

| Field | Value |
|-------|-------|
| **Location** | Multiple files across `(public)/` and `app/` |
| **Description** | The codebase has THREE coexisting CSS approaches: (1) Design system tokens via `var(--color-*)`, (2) Legacy classes like `bg-dark-bg`, `text-muted-text`, `border-dark-border`, (3) Direct hex colors like `#0B5FFF`, `#00C853`. This causes inconsistent appearance across pages. |
| **Severity** | **HIGH** |
| **Affected Browsers** | All |
| **Specific Files** | `ara/page.tsx:123-124` uses `text-white` + `bg-dark-card`; `is-ver/page.tsx:16-18` uses `text-white` + `text-muted-text`; Dashboard uses `var(--color-*)` tokens |
| **Suggested Fix** | Migrate all legacy classes to design system tokens in a systematic pass |

### H-02: Google SVG Icon Loses Brand Colors

| Field | Value |
|-------|-------|
| **Location** | `giris/page.tsx:87-106`, `kayit/page.tsx:107-126` |
| **Description** | The Google sign-in button uses an SVG icon with `fill="currentColor"` on all paths. This makes the entire icon render in the button's text color (dark/white) instead of Google's brand colors (blue #4285F4, green #34A853, yellow #FBBC05, red #EA4335). Reduces brand recognition. |
| **Severity** | **HIGH** |
| **Suggested Fix** | Use hardcoded fill colors matching Google's brand palette |

### H-03: Dashboard Uses Emoji Instead of Lucide Icons

| Field | Value |
|-------|-------|
| **Location** | `dashboard/page.tsx:197-201` |
| **Description** | Analytics cards use emoji characters (👁️, ⭐, 💬, 📤, ❤️) instead of Lucide React icons used everywhere else in the application. This causes inconsistent rendering across platforms (emoji appearance varies by OS). |
| **Severity** | **HIGH** |
| **Suggested Fix** | Replace emoji with equivalent Lucide icons (Eye, Star, MessageSquare, Send, Heart) |

### H-04: Hardcoded Mock Data in Dashboard

| Field | Value |
|-------|-------|
| **Location** | `dashboard/page.tsx:78-79` |
| **Description** | Dashboard stats include hardcoded placeholder values: `"₺12,450"` for income and `"₺—"` for non-premium users. Also hardcoded trend percentages (`"+12%"`, `"+8%"`, `"3 yeni"`, `"+2"`). These are not real computed values, making the dashboard feel fake. |
| **Severity** | **HIGH** |
| **Suggested Fix** | Replace all hardcoded values with real database queries or computed statistics |

### H-05: Hardcoded Notification Badge Count

| Field | Value |
|-------|-------|
| **Location** | `DashboardLayout.tsx:154` |
| **Description** | Notification bell shows a hardcoded `<span>3</span>` badge count instead of querying actual unread notification count from the database. |
| **Severity** | **HIGH** |
| **Suggested Fix** | Fetch real unread count from database or API |

### H-06: Admin Uses Separate Token System

| Field | Value |
|-------|-------|
| **Location** | `globals.css:44-112` |
| **Description** | Admin defines its own token system (`--admin-primary: #0b5fff`, `--admin-success: #027a48`, etc.) that duplicates many values from the main design system. This creates maintenance burden and potential drift between admin and public styles. |
| **Severity** | **HIGH** |
| **Suggested Fix** | Admin tokens should reference main design system tokens where values are identical |

### H-07: Card.tsx vs .card Class Duplication

| Field | Value |
|-------|-------|
| **Location** | `components/ui/Card.tsx` + `globals.css:195-206` |
| **Description** | Two separate Card implementations: a React component (`Card.tsx`) and a CSS utility class (`.card`). They may have different border radius (CSS uses 12px, component unknown), shadows, and hover effects. Pages use a mix of both approaches. |
| **Severity** | **HIGH** |
| **Suggested Fix** | Unify into single Card component with variants |

---

## MEDIUM VISUAL DEFECTS

### M-01: Search Input Placeholder Not Helpful

| Field | Value |
|-------|-------|
| **Location** | `SearchForm.tsx:173,250` |
| **Description** | Password field uses `placeholder="••••••••"` which is not helpful for users — it doesn't indicate the minimum length or requirements. |
| **Severity** | **MEDIUM** |
| **Suggested Fix** | Use `placeholder="En az 6 karakter"` (matching the minLength) |

### M-02: Different Border Radius Values

| Field | Value |
|-------|-------|
| **Location** | `globals.css:199` (card: 12px), `globals.css:220` (btn-primary: 10px), `globals.css:254` (btn-secondary: 10px) |
| **Description** | Buttons use 10px border-radius while cards use 12px. These should be consistent or use a design system spacing scale. |
| **Severity** | **MEDIUM** |
| **Suggested Fix** | Standardize border-radius to use design system tokens (e.g., `--radius-md: 10px`, `--radius-lg: 12px`) |

### M-03: Auth Form Input Styling Inconsistency

| Field | Value |
|-------|-------|
| **Location** | `giris/page.tsx` (Input component), `kayit/page.tsx:242` (native select) |
| **Description** | Auth pages use the `Input` component for text fields but a native `<select>` with inline Tailwind for the city and role selectors. The select uses `bg-dark-card text-white` theme while Input component may use different styling. |
| **Severity** | **MEDIUM** |
| **Suggested Fix** | Create a Select component matching Input's styling |

### M-04: No Loading Skeleton on Search/Auth Pages

| Field | Value |
|-------|-------|
| **Location** | `ara/page.tsx`, `giris/page.tsx`, `kayit/page.tsx` |
| **Description** | Auth pages and search results have no loading skeleton or shimmer animation when fetching data. The search page has a `loading.tsx` in the ara/ directory but it's unclear if it shows during server data fetching. |
| **Severity** | **MEDIUM** |
| **Suggested Fix** | Implement proper loading skeletons for all data-fetching pages |

### M-05: No Active State Differentiation on Navigation Links

| Field | Value |
|-------|-------|
| **Location** | `DashboardLayout.tsx:96-112` |
| **Description** | The dashboard sidebar highlights active links with color change only. No underline, no icon change, no persistent indicator — relies solely on color which fails for colorblind users. |
| **Severity** | **MEDIUM** |
| **Suggested Fix** | Add left border accent or persistent icon alongside color change |

### M-06: Mobile Bottom Nav Touch Targets May Be Small

| Field | Value |
|-------|-------|
| **Location** | `MobileBottomNav.tsx:38-74` |
| **Description** | Mobile bottom navigation has 5 items in a grid with `py-3 px-2` padding. On small screens (320px), each item gets ~64px width with icons at 22-24px. Touch targets may be below the recommended 44x44px minimum. |
| **Severity** | **MEDIUM** |
| **Suggested Fix** | Ensure each nav item has minimum 44x44px touch target |

---

## LOW VISUAL DEFECTS

### L-01: Inline Styles Used Extensively

| Field | Value |
|-------|-------|
| **Location** | Multiple components |
| **Description** | Many components use `style={{}}` props alongside Tailwind classes. Examples include fontFamily, color values, background colors with opacity. This makes maintenance harder and bypasses Tailwind's optimization. |
| **Severity** | **LOW** |
| **Suggested Fix** | Migrate inline styles to Tailwind utility classes or CSS variables |

### L-02: Admin Breadcrumb Uses Auto-Generated Labels

| Field | Value |
|-------|-------|
| **Location** | `lib/admin-nav.ts:235-239` |
| **Description** | Breadcrumb labels for unknown paths are generated via `humanizeSlug()` which capitalizes hyphenated slugs. This creates labels like "Kullanicilar" instead of the proper Turkish "Kullanıcılar" (missing dotless i handling). |
| **Severity** | **LOW** |
| **Suggested Fix** | Add Turkish locale-aware capitalization or use lookup map |

### L-03: Password Field Uses Non-Standard Placeholder

| Field | Value |
|-------|-------|
| **Location** | `giris/page.tsx:130` |
| **Description** | Password field has `placeholder="••••••••"`. This is non-standard — most users expect a descriptive placeholder like "Şifrenizi girin". |
| **Severity** | **LOW** |
| **Suggested Fix** | Change to `placeholder="En az 6 karakter"` |

### L-04: Page Title Visibility on Dark Backgrounds

| Field | Value |
|-------|-------|
| **Location** | `ara/page.tsx:123` |
| **Description** | Search page uses `<h1 className="text-white">` but the page background is set by the root layout body class which has `background: var(--color-surface-secondary)`. If surface-secondary is light (#f5f7fa), white text is invisible. The search page relies on its wrapper div having a dark background (`bg-dark-card`) but the h1 is outside that wrapper. |
| **Severity** | **LOW** |
| **Suggested Fix** | Ensure the h1 has proper contrast against its container background |

### L-05: İş Ver Page Mixed Styling

| Field | Value |
|-------|-------|
| **Location** | `is-ver/page.tsx:14-24` |
| **Description** | The page uses `text-white` for the heading but `text-muted-text` for the subtitle. The background is `py-8 px-4` with no explicit bg color — relies on the body background. White text may be invisible on light backgrounds. |
| **Severity** | **LOW** |
| **Suggested Fix** | Add explicit dark background container to the page |

---

## PAGE-BY-PAGE SUMMARY

| Page | Critical | High | Medium | Low | Overall |
|------|----------|------|--------|-----|---------|
| Login (`/auth/giris`) | 2 | 1 | 1 | 1 | ⚠️ BROKEN |
| Register (`/auth/kayit`) | 2 | 1 | 1 | 0 | ⚠️ BROKEN |
| Search (`/ara`) | 0 | 1 | 1 | 1 | ⚠️ NEEDS FIX |
| Dashboard (`/dashboard`) | 0 | 2 | 1 | 0 | ⚠️ NEEDS FIX |
| DashboardLayout | 0 | 1 | 1 | 0 | ⚠️ NEEDS FIX |
| İş Ver (`/is-ver`) | 0 | 1 | 0 | 1 | ⚠️ NEEDS FIX |
| Auth pages (general) | 3 | 1 | 2 | 1 | 🔴 BROKEN |
| Admin (general) | 0 | 1 | 0 | 1 | ⚠️ NEEDS FIX |
| Navbar | 0 | 0 | 0 | 1 | ✅ OK-ish |

---

## DESIGN SYSTEM CONSISTENCY CHECKLIST

| Element | Status | Issue |
|---------|--------|-------|
| Primary Color | ⚠️ INCONSISTENT | Auth uses orange (#ff7a00), rest uses blue (#0B5FFF) |
| Border Radius | ⚠️ INCONSISTENT | Cards=12px, Buttons=10px |
| Card Styles | ⚠️ DUPLICATED | CSS .card class + Card.tsx component |
| Button Styles | ⚠️ DUPLICATED | CSS .btn-* classes + Button.tsx component |
| Text Colors | ⚠️ INCONSISTENT | Legacy (text-muted-text, text-sub-text) vs tokens (var(--color-text-secondary)) |
| Background Colors | ⚠️ INCONSISTENT | Legacy (bg-dark-bg, bg-dark-card) vs tokens (var(--color-surface-secondary)) |
| Icon Set | ✅ CONSISTENT | Lucide React used throughout (except dashboard emoji) |
| Typography | ✅ CONSISTENT | Inter + Manrope throughout |
| Shadows | ⚠️ PARTIAL | Design system defines 4 levels, actual usage varies |
| Spacing | ✅ CONSISTENT | Tailwind spacing scale used throughout |

---

## SCREENSHOT QA CHECKLIST

The following screenshots should be captured and compared for visual audit:

- [ ] Login page (desktop + mobile)
- [ ] Register page with role picker (desktop + mobile  )
- [ ] Search page with filters (desktop + mobile)
- [ ] Search page with autocomplete dropdown
- [ ] Search results (list view + map view)
- [ ] Homepage hero section
- [ ] Homepage full scroll capture
- [ ] Dashboard overview
- [ ] Dashboard with analytics (assembler role)
- [ ] Company profile create/edit
- [ ] Messages page
- [ ] Job creation wizard (all 6 steps)
- [ ] Job detail page
- [ ] Admin panel (sidebar expanded + collapsed)
- [ ] Admin users page with DataTable
- [ ] Admin command center
- [ ] Blog listing
- [ ] Blog article
- [ ] Mobile bottom navigation
- [ ] 404 page
- [ ] Offline page

---

*Generated by MVEDS Phase 9-10 Visual Audit — 2026-07-16*
