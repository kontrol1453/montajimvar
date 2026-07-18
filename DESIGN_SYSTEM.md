# Montajım Var — Design System

> Official design token and CSS architecture reference. All developers **must** follow the principles in this document.

---

## 1. Color System

All colors are defined as CSS custom properties on `:root` via Tailwind's `@theme`. Use only these tokens — never hardcoded hex values.

### 1.1 Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0B5FFF` | Primary buttons, links, active states, focus rings |
| `--color-primary-dark` | `#0948CC` | Button hover, active press |
| `--color-primary-light` | `#3D7FFF` | Hover states on primary elements |
| `--color-primary-soft` | `#E0EBFF` | Soft backgrounds (section-label, outline hover, table row hover) |
| `--color-accent` | `#00C853` | Success actions, confirm buttons, positive indicators |
| `--color-accent-dark` | `#00A844` | Accent hover state |
| `--color-accent-soft` | `#ECFDF3` | Success-soft / accent soft backgrounds |

### 1.2 Neutral / Dark

| Token | Value | Usage |
|-------|-------|-------|
| `--color-dark` | `#101828` | Headings, hero text, dark card backgrounds |
| `--color-dark-secondary` | `#1D2939` | Secondary dark surfaces |

### 1.3 Surface Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-surface` | `#FFFFFF` | Card backgrounds, modal backgrounds, input backgrounds |
| `--color-surface-secondary` | `#F5F7FA` | Page body background, secondary sections |
| `--color-surface-tertiary` | `#EEF0F4` | Skeleton loading, disabled backgrounds, hover on muted areas |
| `--color-surface-muted` | `#F9FAFB` | Subtle background for inset areas |

### 1.4 Text Colors

All text tokens are WCAG AA verified.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#101828` | Headings, body text in cards, primary navigation labels |
| `--color-text-secondary` | `#475467` | Body paragraphs, secondary navigation, meta text |
| `--color-text-tertiary` | `#667085` | Helper text, captions, placeholder text |
| `--color-text-muted` | `#98A2B3` | Disabled text, secondary captions, icon colors |
| `--color-text-disabled` | `#98A2B3` | Explicitly disabled text (same as muted) |
| `--color-text-white` | `#FFFFFF` | Text on dark backgrounds, primary button labels |
| `--color-text-on-primary` | `#FFFFFF` | Text rendered on primary-colored surfaces |

**Usage rules:**
- `text-primary` → headings, page titles, card titles
- `text-secondary` → body text, descriptions, paragraph content
- `text-tertiary` → helper text, secondary metadata, placeholder
- `text-muted` → disabled states, secondary icons
- `text-white` → dark sections, button labels on colored backgrounds

### 1.5 Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border` | `#D0D5DD` | Default borders on inputs, selects, secondary buttons |
| `--color-border-light` | `#EAECF0` | Card borders, table row dividers, light separators |
| `--color-border-muted` | `#F2F4F7` | Subtle divider lines, muted borders |

### 1.6 Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#027A48` | Success text, success icon |
| `--color-success-soft` | `#ECFDF3` | Success alert background |
| `--color-warning` | `#B54708` | Warning text, warning icon |
| `--color-warning-soft` | `#FFFAEB` | Warning alert background |
| `--color-danger` | `#B42318` | Error text, error icon, danger buttons, error borders |
| `--color-danger-soft` | `#FEF3F2` | Danger alert background |
| `--color-info` | `#1849A9` | Info text, info icon |
| `--color-info-soft` | `#EFF8FF` | Info alert background |
| `--color-premium` | `#B54708` | Premium/upgrade text (maps to warning) |
| `--color-premium-soft` | `#FFFAEB` | Premium badge/alert background (maps to warning-soft) |
| `--color-neutral-soft` | `#F2F4F7` | Neutral badge background |

### 1.7 Admin Tokens

These map to the main system tokens but are namespaced for admin context.

**Surface & border:**
| Token | Value | Maps To |
|-------|-------|---------|
| `--admin-surface` | `#FFFFFF` | `--color-surface` |
| `--admin-surface-muted` | `#F5F7FA` | `--color-surface-secondary` |
| `--admin-surface-subtle` | `#FAFBFC` | (subtler than surface-muted) |
| `--admin-border` | `#E4E7EC` | Admin panel borders |
| `--admin-border-muted` | `#EAECF0` | Admin panel muted borders |

**Text:**
| Token | Value | Maps To |
|-------|-------|---------|
| `--admin-text-primary` | `#101828` | Primary admin text |
| `--admin-text-secondary` | `#475467` | Secondary admin text |
| `--admin-text-muted` | `#667085` | Muted admin text |
| `--admin-text-disabled` | `#98A2B3` | Disabled admin text |

**Semantic:**
| Token | Value | Maps To |
|-------|-------|---------|
| `--admin-primary` | `#0B5FFF` | `--color-primary` |
| `--admin-primary-strong` | `#0948CC` | `--color-primary-dark` |
| `--admin-primary-soft` | `#E0EBFF` | `--color-primary-soft` |
| `--admin-success` / `--admin-success-soft` | `#027A48` / `#ECFDF3` | Success pair |
| `--admin-warning` / `--admin-warning-soft` | `#B54708` / `#FFFAEB` | Warning pair |
| `--admin-danger` / `--admin-danger-soft` | `#B42318` / `#FEF3F2` | Danger pair |
| `--admin-info` / `--admin-info-soft` | `#1849A9` / `#EFF8FF` | Info pair |
| `--admin-premium` / `--admin-premium-soft` | `#B54708` / `#FFFAEB` | Premium pair |
| `--admin-neutral-soft` | `#F2F4F7` | Neutral soft |

**Layout tokens:**
| Token | Value |
|-------|-------|
| `--admin-sidebar-width` | `14rem` |
| `--admin-sidebar-width-mobile` | `16rem` |
| `--admin-sidebar-width-collapsed` | `4.5rem` |
| `--admin-header-height` | `3.5rem` |
| `--admin-content-padding-x` | `1.5rem` |

### 1.8 Admin Sidebar Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--admin-sidebar-bg` | `#000000` | Sidebar background (black) |
| `--admin-sidebar-border` | `rgba(255,255,255,0.08)` | Sidebar dividers |
| `--admin-sidebar-text` | `#D4D4D8` | Default nav item text |
| `--admin-sidebar-text-muted` | `#71717A` | Secondary/muted sidebar text |
| `--admin-sidebar-hover` | `rgba(255,255,255,0.06)` | Hover background for nav items |
| `--admin-sidebar-active-bg` | `rgba(255,122,0,0.15)` | Active nav item background |
| `--admin-sidebar-active-text` | `#FF9433` | Active nav item text color (orange) |

---

## 2. Typography System

Two font families:
- **Display (headings):** `Manrope` (via `--font-display`)
- **Body:** `Inter` (via `--font-body`)
- **Monospace:** `ui-monospace, SFMono-Regular, monospace` (via `--font-mono`)

### 2.1 Typography Classes

| Class | Font | Size | Weight | Line-Height | Letter-Spacing | Color | Usage |
|-------|------|------|--------|-------------|----------------|-------|-------|
| `.display` | Manrope | `clamp(2.5rem, 6vw, 4rem)` | 800 | 1.05 | -0.03em | `var(--color-dark)` | Hero sections, landing page headers |
| `.h1` | Manrope | `clamp(2rem, 5vw, 3rem)` | 800 | 1.1 | -0.03em | `var(--color-dark)` | Page titles, top-level headings |
| `.h2` | Manrope | `clamp(1.75rem, 4vw, 2.5rem)` | 700 | 1.15 | -0.02em | `var(--color-dark)` | Section headers, feature sections |
| `.h3` | Manrope | `clamp(1.5rem, 3vw, 2rem)` | 700 | 1.2 | -0.02em | `var(--color-dark)` | Card headers, subsection titles |
| `.h4` | Manrope | `clamp(1.25rem, 2vw, 1.5rem)` | 700 | 1.25 | -0.01em | `var(--color-dark)` | Minor section headers, sidebar headings |
| `.body-large` | Inter | `1.125rem` | 400 | 1.6 | normal | `var(--color-text-secondary)` | Lead paragraphs, hero descriptions |
| `.body` | Inter | `1rem` | 400 | 1.6 | normal | `var(--color-text-secondary)` | Paragraph text, card content |
| `.body-small` | Inter | `0.875rem` | 400 | 1.5 | normal | `var(--color-text-secondary)` | Secondary info, metadata, table cells |
| `.caption` | Inter | `0.75rem` | 500 | 1.4 | 0.02em | `var(--color-text-tertiary)` | Labels, timestamps, badge text, field descriptions |

All heading classes use `var(--color-dark)` for color — this becomes `white` inside `.section-dark` via descendant selector override.

---

## 3. Spacing & Layout

### 3.1 Container Classes

| Class | Max-Width | Padding | Behavior |
|-------|-----------|---------|----------|
| `.container-app` | `1440px` | `2rem` (desktop) / `1rem` (mobile) | Standard page container |
| `.container-narrow` | `768px` | `2rem` (desktop) / `1rem` (mobile) | Narrow content (auth, forms, prose) |

Both containers use `margin: auto` and `width: 100%`. Padding switches to `1rem` at `768px` and below.

### 3.2 Section Padding

| Class | Desktop | Mobile (<768px) | Usage |
|-------|---------|-----------------|-------|
| `.section-padding` | `padding: 5rem 0` | `padding: 3rem 0` | Hero sections, feature sections, full-page sections |
| `.section-padding-sm` | `padding: 3rem 0` | `padding: 3rem 0` | Compact sections, admin page sections |

### 3.3 Admin Content Padding

`.admin-content` applies `padding-left: var(--admin-content-padding-x)` and `padding-right: var(--admin-content-padding-x)` (default `1.5rem`, shrinks to `1rem` at `640px`).

---

## 4. Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Skeleton elements, small containers |
| `--radius-md` | `8px` | Buttons, inputs, selects, alerts |
| `--radius-lg` | `12px` | Cards, modals, dropdowns, drawers |
| `--radius-xl` | `16px` | Large modals, full-page containers |
| `--radius-full` | `9999px` | Badges, pills, avatars, section-labels |

---

## 5. Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)` | Default card elevation |
| `--shadow-card-hover` | `0 4px 12px rgba(16,24,40,0.08), 0 2px 4px rgba(16,24,40,0.04)` | Card hover elevation |
| `--shadow-elevated` | `0 12px 32px rgba(16,24,40,0.1), 0 4px 8px rgba(16,24,40,0.06)` | Dropdowns, elevated cards, popovers |
| `--shadow-button` | `0 1px 2px rgba(16,24,40,0.05)` | Default button shadow |
| `--shadow-drawer` | `-8px 0 32px rgba(16,24,40,0.12)` | Side drawer/panel |
| `--shadow-modal` | `0 20px 60px rgba(16,24,40,0.14), 0 8px 16px rgba(16,24,40,0.08)` | Modal dialogs, large overlays |

---

## 6. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default content |
| `--z-sticky` | `10` | Sticky headers, sticky columns |
| `--z-sidebar` | `40` | Sidebar navigation |
| `--z-header` | `30` | Top navigation bars |
| `--z-dropdown` | `50` | Dropdown menus, popovers |
| `--z-overlay` | `60` | Overlay/backdrop |
| `--z-modal` | `70` | Modal dialogs |
| `--z-toast` | `80` | Toast notifications, tooltips |

> Note: z-sidebar (40) is intentionally higher than z-header (30) so the sidebar overlays the header. Dropdowns (50) sit above both.

---

## 7. Breakpoints

Tailwind defaults:
| Breakpoint | Min-Width |
|------------|-----------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1536px` |

**Custom breakpoint behavior:**
- Container padding changes at `768px` (`2rem` → `1rem`)
- Section padding changes at `768px` (`5rem` → `3rem`)
- Admin content padding changes at `640px` (`1.5rem` → `1rem`)

---

## 8. Animation System

### 8.1 Keyframes

| Animation | Duration | Curve | Use Case |
|-----------|----------|-------|----------|
| `fade-in-up` | `0.5s` | `cubic-bezier(0.16, 1, 0.3, 1)` | Page entry, section reveal, cards appearing |
| `fade-in` | `0.4s` | `ease-out` | Simple appearance, modal backdrop |
| `scale-in` | `0.4s` | `cubic-bezier(0.16, 1, 0.3, 1)` | Modal content, dropdowns |
| `slide-in-right` | `0.3s` | `ease-out` | Drawer panels, notification slides |
| `spin` | — | `linear` | Loading spinners |
| `shimmer` | `1.5s` | `ease-in-out infinite` | Skeleton loading placeholders |

### 8.2 Animation Utility Classes

| Class | Animation |
|-------|-----------|
| `.animate-fade-in-up` | `fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards` |
| `.animate-fade-in` | `fade-in 0.4s ease-out forwards` |
| `.animate-scale-in` | `scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards` |
| `.animate-slide-in-right` | `slide-in-right 0.3s ease-out forwards` |

The `forwards` fill-mode ensures the element stays in its final state after animation.

### 8.3 Skeleton

```css
.skeleton {
  background: linear-gradient(90deg, var(--color-surface-tertiary), var(--color-surface-secondary), var(--color-surface-tertiary));
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
```

### 8.4 Reduced Motion

When `prefers-reduced-motion: reduce` is detected, all animations and transitions are forced to `0.01ms` duration. This applies to **all elements** via the universal selector cascade.

---

## 9. Supporting Utilities

| Class / Element | Description |
|----------------|-------------|
| `.gradient-text` | `linear-gradient(135deg, var(--color-primary), var(--color-accent))` with `background-clip: text` |
| `.section-dark` | Dark gradient background (`#0a1628` → `#0f1f3a`) with white text overrides |
| `.section-label` | Uppercase pill label with `var(--color-primary)` on `rgba(11,95,255,0.06)` background |
| `.empty-state` | Centered flex column with icon, title, and description |
| `.skip-link` | Accessibility skip-to-content link (hidden off-screen, revealed on focus) |
| `::selection` | Blue tinted selection color (`rgba(11,95,255,0.12)`) |
| `:focus-visible` | `2px solid var(--color-primary)` outline with `2px` offset, `4px` radius |
| `.admin-surface-*` | Legacy admin utility classes — use sparingly, prefer admin token variables |

---

## 10. Design Principles

### 1. Never use hardcoded colors
Always reference CSS variable tokens (`var(--color-*)` or Tailwind utility like `bg-primary`). No inline hex values.

### 2. Never create random CSS overrides
If you need a new style, extend the existing system. Don't scatter ad-hoc overrides across components.

### 3. Never use `!important`
The cascade and specificity hierarchy is sufficient. If `!important` seems necessary, the root cause is a specificity conflict — fix it properly.

### 4. Always choose from the typography scale
Use `.display`, `.h1`–`.h4`, `.body-large`, `.body`, `.body-small`, or `.caption`. Never invent custom font sizes.

### 5. Always use the system CSS classes
- Buttons → `btn` + variant/size classes
- Cards → `.card` / `.card-elevated` / `.card-flat` / `.card-dark`
- Badges → `.badge` + variant/size classes
- Alerts → `.alert` + variant classes

### 6. Always use `form-*` classes for form elements
- Inputs → `.form-input`
- Labels → `.form-label`
- Errors → `.form-error`
- Help text → `.form-help`
- Selects → `.form-select`
- Textareas → `.form-textarea`

### 7. Prefer CSS variables over inline styles
Define new tokens in `@theme` in `globals.css` rather than scattering inline `style={{}}` throughout components.

### 8. Keep accessibility contrast in mind
All text tokens are WCAG AA verified. Ensure custom overrides (if absolutely necessary) maintain a 4.5:1 contrast ratio for normal text and 3:1 for large text.
