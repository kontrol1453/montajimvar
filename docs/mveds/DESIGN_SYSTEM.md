# Design System — Montajım Var

## 1. Principles

| Principle | Description |
|---|---|
| **Mobile-first** | All components designed ≥320px, scale up |
| **Accessible** | WCAG AA (4.5:1 contrast, keyboard, ARIA) |
| **Consistent** | Single source of truth: tokens + primitives |
| **Performant** | No unnecessary re-renders, CSS-first motion |
| **RTL-ready** | Logical properties (`inline-start`, `block-end`) |

## 2. Design Tokens

### Colors (CSS Variables)

```css
:root {
  /* Brand */
  --color-primary: #1E6BFF;
  --color-primary-hover: #1558E0;
  --color-primary-soft: #E8F0FF;

  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Neutral */
  --color-bg: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;

  /* Admin theme (dark) */
  --admin-bg: #0F172A;
  --admin-surface: #1E293B;
  --admin-border: #334155;
  --admin-text-primary: #F1F5F9;
  --admin-text-secondary: #94A3B8;
}
```

### Spacing (4px base)
```css
--space-1: 4px;  --space-2: 8px;  --space-3: 12px;
--space-4: 16px; --space-5: 20px; --space-6: 24px;
--space-8: 32px; --space-10: 40px; --space-12: 48px;
```

### Typography
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-display: 'Manrope', system-ui, sans-serif;

--text-xs: 0.75rem;   --text-sm: 0.875rem; --text-base: 1rem;
--text-lg: 1.125rem;  --text-xl: 1.25rem;  --text-2xl: 1.5rem;
--text-3xl: 1.875rem; --text-4xl: 2.25rem;

--font-normal: 400; --font-medium: 500; --font-semibold: 600; --font-bold: 700;
```

### Radius
```css
--radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Motion
```css
--duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

## 3. Component Inventory

### Primitives (`src/components/ui/`)

| Component | Props | Variants |
|---|---|---|
| `Button` | `children`, `variant`, `size`, `disabled`, `loading`, `onClick` | `primary`, `secondary`, `ghost`, `danger` / `sm`, `md`, `lg` |
| `Input` | `value`, `onChange`, `label`, `error`, `type`, `placeholder` | — |
| `Textarea` | `value`, `onChange`, `label`, `error`, `rows` | — |
| `Select` | `options`, `value`, `onChange`, `label`, `error`, `placeholder` | — |
| `Checkbox` | `checked`, `onChange`, `label`, `indeterminate` | — |
| `RadioGroup` | `options`, `value`, `onChange`, `label` | — |
| `Switch` | `checked`, `onChange`, `label` | — |
| `Card` | `children`, `variant`, `padding` | `default`, `outlined`, `elevated` |
| `Badge` | `children`, `variant`, `size` | `default`, `success`, `warning`, `error`, `info` / `sm`, `md` |
| `Avatar` | `src`, `alt`, `fallback`, `size` | `xs`(24), `sm`(32), `md`(40), `lg`(56), `xl`(80) |
| `Typography` | `as`, `variant`, `color`, `weight` | `h1`–`h6`, `body`, `caption`, `overline` |
| `Icon` | `name` (lucide), `size`, `strokeWidth` | — |

### Composite Components

| Component | Purpose |
|---|---|
| `FormField` | Label + Input + Error + Hint (accessible) |
| `Modal` | Portal, focus trap, ESC close, backdrop |
| `Dropdown` | Popover, keyboard nav, click outside |
| `Tabs` | ARIA tabs, keyboard, animated indicator |
| `Table` | Sortable, pagination, row selection, sticky header |
| `DataTable` | Server-side pagination, filters, export CSV |
| `Toast` | `sonner` wrapper: `toast.success()`, `toast.error()` |
| `Skeleton` | Loading placeholders for cards/tables |
| `Pagination` | Prev/Next, page numbers, page size |
| `Breadcrumbs` | Auto-generated from route |

### Layout Components

| Component | Purpose |
|---|---|
| `Container` | Max-width wrapper (sm/md/lg/xl/full) |
| `Grid` | CSS Grid wrapper (responsive cols) |
| `Stack` | Vertical/horizontal stack with gap |
| `Divider` | Horizontal rule with optional label |

## 4. Usage Rules

1. **Import from `@/components/ui`** — never from deep paths
2. **Use tokens** — `className="bg-[var(--color-primary)]"` not hardcoded hex
3. **Extend, don't duplicate** — if variant missing, add to component
4. **No `className` overriding internals** — use `variant`/`size` props
5. **Dark mode** — use `dark:` prefix when implemented (P2)

## 5. Adding New Components

1. Create `src/components/ui/NewComponent.tsx`
2. Export from `src/components/ui/index.ts`
3. Add Storybook story (P2)
4. Update this doc
5. PR review required

## 6. Accessibility Checklist (per component)

- [ ] Semantic HTML
- [ ] Focus visible (`focus-visible:ring-2`)
- [ ] ARIA labels/descriptions
- [ ] Keyboard navigation
- [ ] Color contrast ≥4.5:1
- [ ] Reduced motion respected

---

*Version: 1.0 • 2026-07-17*