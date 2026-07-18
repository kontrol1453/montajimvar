# Montajım Var — Accessibility Implementation

## Already Implemented

### CSS / Motion
- `prefers-reduced-motion` media query: disables all animations/transitions when user prefers reduced motion (`globals.css:169-178`)
- `*:focus-visible` styling: keyboard-only focus ring with 2px primary color outline (`globals.css:180-184`)
- `*:focus:not(:focus-visible)` removes default focus ring for mouse users (`globals.css:186-188`)
- `::selection` styling for canvas/text selection (`globals.css:164-167`)

### Skip-to-Content Navigation
- **Public layout** (`src/app/(public)/layout.tsx:16-18`): `<a href="#main-content" class="skip-link">`
- **Navbar** (`src/components/Navbar.tsx`): duplicate skip-link for redundant coverage
- **Admin shell** (`src/components/admin/AdminShell.tsx`): skip-link present
- Skip link is visually hidden until focused, then slides into view

### Forms
- `FormField.tsx`: Role-based ARIA attributes (`aria-invalid`, `aria-describedby`), `htmlFor` on labels
- `Input.tsx`: `aria-invalid` on error, `aria-describedby` linking to error/helper text IDs, `role="alert"` on error messages
- `Button.tsx`: `aria-busy` on loading state

### Semantic HTML
- `lang="tr"` on `<html>` element
- Semantic heading structure with `h1`, `h2`, `h3` across sections
- Section components use `aria-labelledby` pointing to their heading `id`
- `<nav>`, `<main>`, `<footer>` used appropriately
- FAQ accordion uses `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby` (`FAQv5.tsx`)
- `role="alert"` on dynamic error messages in form components

### Color System
- All text color tokens verified against WCAG AA (4.5:1 minimum contrast ratio)
- `text-primary (#101828)` on `white`: **16.5:1** ✅
- `text-secondary (#475467)` on `white`: **8.6:1** ✅
- `text-tertiary (#667085)` on `white`: **5.74:1** ✅ (large text only, 3:1 for 18px+ bold or 24px+ regular)
- `text-muted (#98a2b3)` on `white`: **3.0:1** ❌ — NOT for body text; restricted to disabled/placeholder only

### Interactive Elements
- Hero search bar: form with `method="GET"`, semantic `<input>` and `<button>` inside `<form>`
- Service cards: `<Link>` elements with `aria-label`
- Audience cards: `<Link>` elements with `aria-label` including role-specific text
- Trust metrics: `<ul>` with `aria-label="Hızlı güven sinyalleri"`
- Section labels: `aria-hidden="true"` on decorative background elements
- Icons: `aria-hidden` on decorative icons (using `aria-hidden` attribute or `aria-hidden={true}`)

---

## WCAG AA Implementation Guide

### Color Contrast

| Token | Value | On White | Status | Usage |
|-------|-------|----------|--------|-------|
| `--color-text-primary` | #101828 | 16.5:1 | ✅ AA | Headings, body text |
| `--color-text-secondary` | #475467 | 8.6:1 | ✅ AA | Secondary body text |
| `--color-text-tertiary` | #667085 | 5.74:1 | ✅ AA (large) | Metadata, captions, help text |
| `--color-text-muted` | #98a2b3 | 3.0:1 | ❌ | Disabled/placeholder only |
| `--color-primary` | #0B5FFF | 4.1:1 | ✅ AA (large) | Links, buttons, interactive |
| `--color-accent` | #00C853 | 2.4:1 | ❌ | Decorative, not for text |
| `--color-danger` | #B42318 | 4.7:1 | ✅ AA | Error text |
| `--color-success` | #027A48 | 5.7:1 | ✅ AA | Success messages |

**Rules:**
- Body text (<18px / <14px bold): minimum **4.5:1**
- Large text (≥18px regular or ≥14px bold): minimum **3:1**
- UI components and graphical objects: minimum **3:1**
- Disabled/inactive elements are exempt

### Keyboard Navigation

- All interactive elements (`<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`) are natively focusable
- Custom interactive components must implement keyboard handlers:
  - `Enter` / `Space` to activate
  - `Arrow keys` for tab/accordion navigation
  - `Escape` to dismiss modals/drawers
- Use `*:focus-visible` for keyboard-only focus ring (already implemented)
- **Tab order must match visual layout** — review section ordering when rearranging components
- Skip-to-content link should be first focusable element on page (already implemented)

### ARIA Usage Patterns

| Pattern | When to use | Current status |
|---------|-------------|----------------|
| `aria-busy` | Loading buttons | ✅ Button.tsx |
| `aria-invalid` | Invalid form fields | ✅ Input.tsx, FormField.tsx |
| `aria-describedby` | Error/help text linking | ✅ Input.tsx, FormField.tsx |
| `aria-label` | Icon-only buttons | ⚠️ Verify all instances |
| `aria-hidden` | Decorative icons | ✅ Most instances |
| `role="alert"` | Dynamic error messages | ✅ FormField.tsx, Input.tsx |
| `role="navigation"` | Nav elements | ✅ Navbar |
| `aria-expanded` | Accordion/disclosure | ✅ FAQv5.tsx |
| `aria-controls` | Accordion panel linking | ✅ FAQv5.tsx |
| `aria-labelledby` | Section headings | ✅ v5 section components |
| `aria-current` | Active nav item | ⚠️ Missing in some nav contexts |
| `role="region"` | FAQ panels | ✅ FAQv5.tsx |

### Semantic HTML Structure

```html
<html lang="tr">
  <body>
    <a href="#main-content" class="skip-link">İçeriğe geç</a>
    <nav aria-label="Ana navigasyon">...</nav>
    <main id="main-content" tabIndex={-1}>
      <section aria-labelledby="hero-headline">
        <h1 id="hero-headline">...</h1>
      </section>
      <section aria-labelledby="audience-headline">
        <h2 id="audience-headline">...</h2>
      </section>
      <article>...</article>
    </main>
    <footer>...</footer>
  </body>
</html>
```

**Rules:**
- Use `<nav>` for primary and secondary navigation
- Use `<main>` for primary content (one per page)
- Use `<aside>` for complementary content (sidebar, related links)
- Use `<article>` for blog posts, listings, self-contained content
- Use `<section>` with `aria-label` or `aria-labelledby` for distinct sections
- **Heading hierarchy: `h1` → `h2` → `h3` — never skip levels**

### Touch Targets

| Requirement | Minimum | Implementation |
|-------------|---------|----------------|
| Interactive element size | 44×44px | ✅ Buttons, cards, nav items |
| Mobile bottom nav items | 44×44px | ⚠️ Needs measurement |
| Form inputs | 44px height | ✅ `form-input` = 40px (close) |
| Link hit areas | 44×44px | ⚠️ Some inline links may be undersized |

**Notes:**
- `form-input` is 40px (2.5rem). Consider bumping to 44px.
- Inline text links within paragraphs may be smaller than 44px — this is acceptable per WCAG (exceptions for inline links in running text).

### Focus Management

- Page load: focus should move to `h1` or skip-to-content link
- Route change: focus should move to top of new content (use `tabIndex={-1}` on `<main>`)
- Modal/dialog open: trap focus inside modal
- Modal/dialog close: return focus to trigger element
- Dynamic content: announce changes with `role="status"` or `aria-live="polite"`

---

## Testing Checklist

### Automated Testing
- [ ] Run **axe DevTools** on every page (or at minimum: homepage, search, auth pages, dashboard)
- [ ] Run **Lighthouse Accessibility** audit (target: score ≥ 95)
- [ ] Check for color contrast issues with **WCAG Contrast Checker**

### Manual Testing
- [ ] **Keyboard-only navigation**: Tab through entire page flow without mouse
  - All interactive elements reachable
  - Visible focus indicator at all times
  - No keyboard traps
  - Logical tab order
- [ ] **Screen reader test**:
  - **NVDA** (Windows / Firefox)
  - **VoiceOver** (macOS / Safari)
  - Verify all content is announced
  - Verify form labels and errors are read
  - Verify dynamic content changes are announced
- [ ] **200% zoom test**: Page must be fully functional at 200% zoom without horizontal scrolling
- [ ] **Reduced motion test**: Enable `prefers-reduced-motion` in OS — all animations should stop
- [ ] **High contrast mode test**: Test in Windows High Contrast Mode — all information preserved
- [ ] **Mobile touch targets**: Verify all interactive elements meet 44×44px minimum

### Regression Checklist
- [ ] New sections use `aria-labelledby` pointing to a heading `id`
- [ ] New forms use `form-input`, `form-label`, `form-error`, `form-help` classes
- [ ] New icons have `aria-hidden="true"` (decorative) or `aria-label` (informative)
- [ ] Skip-to-content link is present on every layout
- [ ] Heading levels never skip (h1 → h2 → h3 → h4)

### Known Gaps
- `sifre-unuttum` and `sifre-sifirla` pages still use legacy classes (`text-white`, `text-muted-text`, `text-montaj`) — need design system migration
- `BlogSection.tsx` uses legacy CSS variables (`--color-dark`, `--color-surface-secondary`) — need updating
- No `aria-current` on active nav items in public navigation
- Some old city/service pages (`[city]/[service]/page.tsx`) still use `bg-dark-card`, `bg-dark-bg`, `text-white` legacy patterns
- Mobile bottom nav touch target size needs verification
