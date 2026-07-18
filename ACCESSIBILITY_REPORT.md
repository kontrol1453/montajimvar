# Accessibility Audit Report — Montajım Var

**Project:** Montajım Var (montajimvar.xyz)
**Standard:** WCAG 2.2 AA
**Date:** July 2026
**Scope:** Next.js App Router (public + admin), React components, Tailwind CSS v4

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High     | 4 |
| Medium   | 5 |
| Low      | 3 |
| **Total**| **13** |

---

## Findings

### 🔴 CRITICAL

#### C-1. No skip-to-content link in public layout

- **Location:** `src/app/(public)/layout.tsx`
- **WCAG Criterion:** 2.4.1 Bypass Blocks (A)
- **Description:** The public layout renders `<main id="main-content">` but has no skip link before the Navbar. Keyboard/screen reader users must tab through all nav links on every page. AdminShell (`src/components/admin/AdminShell.tsx:74`) has one, the public layout does not.
- **Fix:** Add a skip-to-content link as the first focusable element in `(public)/layout.tsx`. The `.skip-link` class and `#main-content` target already exist in `globals.css`.

---

### 🟠 HIGH

#### H-1. `<select>` elements in auth pages lack explicit label association

- **Location:** `src/app/(public)/auth/kayit/page.tsx:239` (city `<select>`)
- **WCAG Criterion:** 1.1.1 Non-text Content (A), 4.1.2 Name, Role, Value (A)
- **Description:** The city `<select>` has an adjacent `<label>` without `htmlFor`/`id` association. Screen readers may not correctly identify the control's purpose.
- **Fix:** Use `<label htmlFor="city">` with matching `id="city"` on the `<select>`, or add `aria-label="Şehir seçin"`.

#### H-2. Autocomplete dropdown lacks ARIA combobox pattern

- **Location:** `src/components/SearchForm.tsx:182-199`
- **WCAG Criterion:** 1.3.1 Info and Relationships (A), 4.1.2 Name, Role, Value (A)
- **Description:** The autocomplete dropdown is a plain `<div>` with `<button>` children. No `role="combobox"`, `role="listbox"`, `aria-expanded`, `aria-activedescendant`, or keyboard arrow-key navigation.
- **Fix:** Implement the ARIA combobox pattern: `role="combobox"` on input wrapper, `role="listbox"` on dropdown, `aria-expanded` on input, `aria-activedescendant` for selection, arrow key + Escape handlers.

#### H-3. Error messages lack `aria-live` or `role="alert"`

- **Location:** `src/app/(public)/auth/kayit/page.tsx:253-256`, `src/app/(public)/auth/giris/page.tsx:142-166`
- **WCAG Criterion:** 4.1.3 Status Messages (AA)
- **Description:** Dynamic error/success `<div>` elements have no `aria-live="polite"` or `role="alert"`. Screen readers will not announce them.
- **Fix:** Add `role="alert"` or `aria-live="polite"` to all dynamically shown status message containers.

#### H-4. Image alt text coverage is inconsistent

- **Location:** `BlogPostPage.tsx:53`, `firma/[id]/page.tsx`, `SearchForm.tsx` (SVG icons)
- **WCAG Criterion:** 1.1.1 Non-text Content (A)
- **Description:** Blog cover image uses `alt=""` (should describe the image). Decorative SVGs in SearchViewToggle and elsewhere lack `aria-hidden="true"`. Mixed usage across components.
- **Fix:** Audit all `<img>`/`<Image>`/SVG elements project-wide. Decorative → `alt=""` or `aria-hidden="true"`. Informative → descriptive alt text.

---

### 🟡 MEDIUM

#### M-1. Color is the sole indicator for active states

- **Location:** `src/components/Navbar.tsx:114-118`, `src/components/MobileBottomNav.tsx:45-49`
- **WCAG Criterion:** 1.4.1 Use of Color (A)
- **Description:** Active nav links differ only by blue text color. No underline, icon change, or bold weight added.
- **Fix:** Add a secondary indicator (underline, background change, or `font-bold`) alongside color.

#### M-2. Touch targets in MobileBottomNav may be undersized

- **Location:** `src/components/MobileBottomNav.tsx:38-72`
- **WCAG Criterion:** 2.5.8 Target Size (AA, WCAG 2.2)
- **Description:** Five items in `grid-cols-5` on a fixed bottom bar. At 320px viewport width, each target is ~64px wide × 40px+ tall. Meets 24×24 minimum but below Apple's 44×44 HIG recommendation.
- **Fix:** Ensure minimum 44×44px tap targets or add sufficient spacing.

#### M-3. Incomplete keyboard navigation on interactive widgets

- **Location:** `SearchForm.tsx` (autocomplete), role picker dialogs
- **WCAG Criterion:** 2.1.1 Keyboard (A)
- **Description:** The autocomplete dropdown lacks arrow-key selection, Escape-to-close, and Enter-to-confirm. Some button-based components rely solely on mouse click handlers.
- **Fix:** Add `onKeyDown` handlers for ArrowUp, ArrowDown, Enter, and Escape in the autocomplete. Ensure all interactive elements are keyboard-operable.

#### M-4. Semantic HTML structure needs review

- **Location:** `src/app/(public)/page.tsx` and v5 section components
- **WCAG Criterion:** 1.3.1 Info and Relationships (A)
- **Description:** Extensive use of nested `<div>` elements. `<section>`, `<article>`, `<aside>` landmarks are underutilized.
- **Fix:** Use semantic sectioning elements (`<section>`, `<article>`, `<nav>`) with `aria-labelledby` referencing heading IDs. Ensure each page has a single `<h1>` and a logical hierarchy.

#### M-5. Heading hierarchy on homepage not verified

- **Location:** `src/app/(public)/page.tsx` and v5 components
- **WCAG Criterion:** 2.4.6 Headings and Labels (AA)
- **Description:** Heading classes (`heading-xl`, `heading-lg`) may not correspond to proper `<h1>`–`<h6>` elements. Skipped levels would break screen reader navigation.
- **Fix:** Audit all heading elements across page templates. Use semantic `<h1>`–`<h6>` tags, not `<div>` with heading styles.

---

### 🔵 LOW

#### L-1. `--color-text-tertiary` (#6b7280) borderline contrast

- **Location:** `src/app/globals.css:20`
- **WCAG Criterion:** 1.4.3 Contrast (Minimum) (AA)
- **Description:** Documented as "~4.6:1 on white". Above 4.5:1 threshold but no safety margin. Rendering variances could push below.
- **Fix:** Darken to `#5b6870` (~5.5:1) for guaranteed compliance.

#### L-2. No Twitter Card metadata on most pages

- **Location:** Root layout, homepage, blog, search
- **WCAG Criterion:** Adjacent (social sharing accessibility)
- **Description:** `twitter:card` is only set on `firma/[id]/page.tsx`. Other pages lack Twitter Card meta tags.
- **Fix:** Add `twitter:card="summary_large_image"` to the root layout metadata export.

#### L-3. Keyboard shortcut modal may lack ARIA dialog roles

- **Location:** `src/components/admin/ShortcutsModal.tsx`
- **WCAG Criterion:** 4.1.2 Name, Role, Value (A)
- **Description:** The `Cmd+K`/`Shift+?` modal needs `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and focus trapping.
- **Fix:** Verify/implement proper ARIA dialog pattern with focus trapping.

---

## Positive Findings (Already Good)

| Item | Location |
|------|----------|
| `prefers-reduced-motion` media query | `globals.css:134-143` |
| Focus-visible keyboard-only ring | `globals.css:145-155` |
| `.skip-link` CSS class ready for use | `globals.css:158-174` |
| `lang="tr"` on `<html>` | `layout.tsx:53` |
| `aria-current="page"` on active nav links | `Navbar.tsx:113` |
| `aria-expanded` on mobile menu button | `Navbar.tsx:253` |
| `aria-label` on mobile menu toggle | `Navbar.tsx:255` |
| `role="menu"` / `role="menuitem"` on profile dropdown | `Navbar.tsx:152,163` |
| `role="dialog"` / `aria-modal="true"` on mobile menu | `Navbar.tsx:266-267` |
| `sr-only` skip link in AdminShell | `AdminShell.tsx:74-79` |
| Semantic `<main>` landmark in public layout | `(public)/layout.tsx:17` |
| Viewport metadata set correctly | `layout.tsx:40-44` |
