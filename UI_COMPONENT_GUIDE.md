# Montajım Var — UI Component Guide

> Reference for every component in `src/components/ui/`. These are the building blocks of all pages.

---

## Button (`Button.tsx`)

A versatile action button with variant, size, loading, and icon support.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "premium"` | `"primary"` | Visual style |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "icon"` | `"md"` | Size preset |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `leadingIcon` | `ReactNode` | — | Icon before label (hidden when loading) |
| `trailingIcon` | `ReactNode` | — | Icon after label (hidden when loading) |
| `disabled` | `boolean` | — | Native disabled attribute |
| All HTML button props | — | — | Spread onto `<button>` |

### CSS Class Mapping

| Variant | Class | Description |
|---------|-------|-------------|
| `primary` | `btn-primary` | Solid blue background, white text, shadow |
| `secondary` | `btn-secondary` | White surface, border, default text |
| `outline` | `btn-outline` | Transparent, blue border, blue text |
| `ghost` | `btn-ghost` | Transparent, secondary text, no border |
| `danger` | `btn-danger` | Solid red background, white text |
| `premium` | `btn-premium` | Amber-soft background, amber text, amber border |

| Size | Class | Height | Font |
|------|-------|--------|------|
| `sm` | `btn-sm` | `2rem` | `0.8125rem` |
| `md` | `btn-md` | `2.5rem` | `0.875rem` |
| `lg` | `btn-lg` | `3rem` | `1rem` |
| `xl` | `btn-xl` | `3.5rem` | `1.125rem` |
| `icon` | `h-9 w-9 p-0` | `2.25rem` | — |

### Loading State

When `loading` is `true`:
- Button is disabled (`disabled` attribute set)
- `aria-busy="true"` is set
- A spinning SVG replaces `leadingIcon` and `trailingIcon`
- Children text is preserved next to spinner

### Accessibility

- Default `type="button"` (prevents form submission unless overridden)
- `aria-busy` on loading state
- Disabled styles via `[disabled]` and `[aria-disabled="true"]`
- Inner icon SVGs have `aria-hidden`

### Usage Examples

```tsx
// Primary CTA
<Button variant="primary">Kaydet</Button>

// Danger action
<Button variant="danger">Sil</Button>

// With loading state
<Button loading variant="primary">Yükleniyor...</Button>

// With icon
<Button leadingIcon={<PlusIcon />}>Ekle</Button>

// Icon only
<Button size="icon" aria-label="Düzenle">
  <EditIcon />
</Button>

// Ghost in toolbar
<Button variant="ghost" size="sm">Filtrele</Button>
```

---

## Card (`Card.tsx`)

Content container with multiple elevation levels.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Card content |
| `variant` | `"default" \| "elevated" \| "flat" \| "dark"` | `"default"` | Visual elevation |
| `padding` | `boolean \| "sm" \| "md" \| "lg"` | `true` | Padding amount |
| `flush` | `boolean` | `false` | No padding (reserved, use `padding=false`) |
| All div props | — | — | Spread onto container |

### Variants

| Variant | Class | Background | Border | Shadow | Hover Effect |
|---------|-------|------------|--------|--------|--------------|
| `default` | `card` | White | `border-light` | `shadow-card` | Lifts 2px, stronger shadow |
| `elevated` | `card-elevated` | White | `border-light` | `shadow-elevated` | None |
| `flat` | `card-flat` | White | `border-light` | None | None |
| `dark` | `card-dark` | `--color-dark` | `rgba(255,255,255,0.08)` | None | None |

**When to use each:**
- `default` → Standard cards (lists, stats, content blocks)
- `elevated` → Modals, dropdown panels, feature highlights
- `flat` → Nested cards, form sections, minimal surfaces
- `dark` → Dark mode sections, premium feature cards, contrast sections

### Padding Map

| Value | Class | Rem |
|-------|-------|-----|
| `true` (default) | `p-6` | `1.5rem` |
| `false` | — | `0` |
| `"sm"` | `p-3` | `0.75rem` |
| `"md"` | `p-4` | `1rem` |
| `"lg"` | `p-6` | `1.5rem` |

### Usage Examples

```tsx
// Default card
<Card>Content</Card>

// Elevated card with custom class
<Card variant="elevated" padding="lg" className="mt-4">Content</Card>

// Dark card for premium features
<Card variant="dark">Content</Card>

// Flush card (no padding) for images
<Card padding={false}>
  <img src="..." alt="" />
</Card>
```

---

## Input (`Input.tsx`)

Form text input with label, error, and helper text.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text rendered above input |
| `error` | `string` | — | Error message (shows red border + alert text) |
| `helperText` | `string` | — | Helper text (hidden when error is present) |
| `id` | `string` | auto-generated | Input `id` derived from label if omitted |
| All HTML input props | — | — | Spread onto `<input>` |

### States

| State | Visual |
|-------|--------|
| Default | `1px solid var(--color-border)`, white background |
| Focus | Blue border (`var(--color-primary)`) + `3px` blue focus ring (`rgba(11,95,255,0.12)`) |
| Error (`aria-invalid="true"`) | Red border (`var(--color-danger)`) + `3px` red focus ring (`rgba(180,35,24,0.12)`) |
| Placeholder | `var(--color-text-muted)` |

### Accessibility

- `label` element linked to input via `htmlFor`
- `aria-invalid="true"` when `error` is present
- `aria-describedby` points to `{id}-error` or `{id}-helper`
- Error paragraph has `role="alert"` for screen reader announcement

### Usage Examples

```tsx
// Basic input
<Input label="Ad" placeholder="Adınızı girin" />

// With error
<Input
  label="E-posta"
  error="Geçerli bir e-posta adresi girin"
  value={email}
  onChange={handleChange}
/>

// With helper text
<Input
  label="Telefon"
  helperText="5XX XXX XX XX formatında girin"
/>

// Spread native props
<Input
  label="Şifre"
  type="password"
  required
  autoComplete="current-password"
/>
```

---

## Badge (`Badge.tsx`)

Small status pill for labels, tags, and indicators.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Badge content |
| `variant` | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "premium"` | `"neutral"` | Semantic color |
| `size` | `"sm" \| "md"` | `"md"` | Size preset |
| `className` | `string` | — | Additional classes |

### Variants

| Variant | Background | Text | Use Case |
|---------|------------|------|----------|
| `neutral` | `--color-neutral-soft` | `--color-text-secondary` | Default tags, status neutral |
| `info` | `--color-info-soft` | `--color-info` | Info labels, "new" indicators |
| `success` | `--color-success-soft` | `--color-success` | Completed, onaylı, başarılı |
| `warning` | `--color-warning-soft` | `--color-warning` | Pending, beklemede, warning |
| `danger` | `--color-danger-soft` | `--color-danger` | Error, iptal, rejected |
| `premium` | `--color-premium-soft` | `--color-premium` | Premium features, upgrades |

### Sizes

| Size | Class | Font | Padding |
|------|-------|------|---------|
| `sm` | `badge-sm` | `0.6875rem` | `0.125rem 0.5rem` |
| `md` | `badge-md` | `0.75rem` | `0.125rem 0.625rem` |

### Badge vs Inline Badge Class

- Use `<Badge>` component when you need React semantics and reusability across pages
- Use `.badge` + `.badge-{variant}` + `.badge-{size}` CSS classes directly when rendering from server components or mapping raw data where component overhead is undesirable

### Usage Examples

```tsx
// Status badge
<Badge variant="success">Onaylandı</Badge>

// Small size for tight spaces
<Badge variant="warning" size="sm">Beklemede</Badge>

// Premium feature
<Badge variant="premium">Premium</Badge>

// Inline CSS equivalent
<span className="badge badge-sm badge-info">Yeni</span>
```

---

## FormField (`FormField.tsx`)

Full-featured form field with label, input, error/helper, and ARIA integration. Wraps a native `<input>`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Label text |
| `helperText` | `string` | — | Helper text below input |
| `error` | `string` | — | Error message (replaces helper) |
| `required` | `boolean` | — | Shows red asterisk on label |
| `containerClassName` | `string` | — | Classes for wrapper div |
| `id` | `string` | auto-generated | Input `id` (derived from label) |
| All input props (except `size`) | — | — | Spread onto `<input>` |

### Accessibility

| Attribute | Condition |
|-----------|-----------|
| `aria-invalid="true"` | When `error` is truthy |
| `aria-describedby` | Points to `{id}-error` or `{id}-helper` |
| `role="alert"` | Error message paragraph |
| Required asterisk | `<span aria-hidden="true">*</span>` in label |

### Required Marker

Shows a red `*` (`var(--color-danger)`) next to the label with `aria-hidden` so screen readers don't double-announce.

### Usage Examples

```tsx
// Basic
<FormField label="Ad Soyad" placeholder="Adınızı girin" />

// Required with helper
<FormField
  label="E-posta"
  type="email"
  required
  helperText="Size özel teklifleri göndereceğiz"
/>

// Error state
<FormField
  label="Telefon"
  error="Bu alan zorunludur"
  value={phone}
  onChange={handleChange}
/>

// With container class for grid layout
<FormField
  label="Adres"
  containerClassName="col-span-2"
/>
```

---

## Typography Components (`Typography.tsx`)

Layout-oriented typography wrappers for consistent page structure.

### PageTitle

Top-level page header with optional description and action buttons.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Heading text (renders as `<h1>` with `.h3` class) |
| `description` | `ReactNode` | Subtitle text below heading (`.body-small` class) |
| `actions` | `ReactNode` | Action buttons rendered on the right side |

Layout: `flex-col` on mobile, `flex-row` with `justify-between` on `sm:` breakpoint.

```tsx
<PageTitle
  description="Tüm montaj taleplerinizi buradan yönetin"
  actions={<Button variant="primary">Yeni Talep</Button>}
>
  Taleplerim
</PageTitle>
```

### SectionTitle

Section-level header with optional description and actions.

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Heading text (renders as `<h2>` with `.h4` class) |
| `description` | `ReactNode` | Subtitle (`.body-small` class) |
| `actions` | `ReactNode` | Action buttons on the right |

Layout: `flex-row` with `justify-between`.

```tsx
<SectionTitle
  description="Son eklenen hizmetler"
  actions={<Button variant="ghost" size="sm">Tümünü Gör</Button>}
>
  Popüler Hizmetler
</SectionTitle>
```

### PageContainer

Responsive content container with max-width and vertical padding.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"md" \| "lg" \| "full"` | `"lg"` | Max-width constraint |
| All div props | — | — | Spread onto container |

| Size | Max-Width |
|------|-----------|
| `md` | `max-w-5xl` (`1024px`) |
| `lg` | `max-w-7xl` (`1280px`) |
| `full` | `max-w-none` |

Includes `admin-content` padding (`1.5rem` desktop, `1rem` mobile) and `py-6 sm:py-8`.

```tsx
<PageContainer size="md">
  <PageTitle>Hesabım</PageTitle>
  {/* content */}
</PageContainer>
```

### Stack

Vertical flex container with consistent gap.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Gap between children |
| All div props | — | — | Spread onto container |

| Size | Gap |
|------|-----|
| `sm` | `gap-3` (`0.75rem`) |
| `md` | `gap-6` (`1.5rem`) |
| `lg` | `gap-8` (`2rem`) |

```tsx
<Stack size="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Stack>
```
