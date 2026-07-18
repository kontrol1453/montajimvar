# Montajım Var — Visual Style Guide

> A comprehensive guide to the visual identity, component usage, and voice of the Montajım Var platform.

---

## 1. Brand Identity

| Attribute | Value |
|-----------|-------|
| **Brand Name** | Montajım Var |
| **Tagline** | Profesyonel Montaj Platformu |
| **Primary Color** | `#0B5FFF` (Blue) |
| **Accent Color** | `#00C853` (Green) |
| **Typography (Headings)** | Manrope |
| **Typography (Body)** | Inter |
| **Locale** | `tr-TR` |

### Color Palette Summary

| Color | Hex | Role |
|-------|-----|------|
| Primary Blue | `#0B5FFF` | Buttons, links, active states, focus rings |
| Primary Dark | `#0948CC` | Button hover states |
| Primary Soft | `#E0EBFF` | Soft backgrounds, table hover |
| Accent Green | `#00C853` | Success, confirmation, positive signals |
| Accent Dark | `#00A844` | Accent hover |
| Dark | `#101828` | Headings, dark sections |
| Surface | `#FFFFFF` | Cards, modals, inputs |
| Surface Secondary | `#F5F7FA` | Page background |
| Danger | `#B42318` | Errors, destructive actions |
| Warning | `#B54708` | Warnings, pending states |
| Info | `#1849A9` | Info indicators |
| Text Primary | `#101828` | Primary text |
| Text Secondary | `#475467` | Body text |
| Text Muted | `#98A2B3` | Disabled / secondary icons |
| Border | `#D0D5DD` | Input borders, dividers |
| Border Light | `#EAECF0` | Card borders |

---

## 2. Typography in Action

### 2.1 Usage Rules

| Class | Visual Size | Used For |
|-------|-------------|----------|
| `.display` | `clamp(40px–64px)` | **Hero sections only** — Landing page, marketing pages. Never use inside card or admin UI. |
| `.h1` | `clamp(32px–48px)` | **Page titles** — One per page. Top-level heading for major views. |
| `.h2` | `clamp(28px–40px)` | **Section headers** — Major content sections on a page. |
| `.h3` | `clamp(24px–32px)` | **Subsection / Card headers** — Inside cards, modal titles, feature blocks. |
| `.h4` | `clamp(20px–24px)` | **Minor section headers** — Sidebar headings, grouped form sections. |
| `.body-large` | `18px` | **Lead paragraphs** — Hero descriptions, intro text. |
| `.body` | `16px` | **Body content** — Paragraphs, card descriptions, table content. |
| `.body-small` | `14px` | **Secondary info** — Metadata, table cells, secondary descriptions. |
| `.caption` | `12px` | **Labels & timestamps** — Badge text, field labels, timestamps, helper text. |

### 2.2 Typography Hierarchy (Example Page)

```
 Page Title (.h1)
 └── Lead Description (.body-large)

   Section Title (.h2)
   └── Body text (.body) — paragraph content

     Card Title (.h3)
     ├── Card body (.body)
     └── Card metadata (.body-small)

       Section Title (.h2)
       └── Form with labels (.caption)
           └── Input values (.body)
               └── Helper text (.body-small / .caption)

         Minor section (.h4)
         └── Body text (.body)
```

### 2.3 Font Loading

- **Manrope** (headings): Loaded via Google Fonts or variable font file. Weight range: 700–800.
- **Inter** (body): Loaded via Google Fonts or variable font file. Weight range: 400–600.

---

## 3. Spacing Rules

### 3.1 Layout Spacing

| Element | Value | Rule |
|---------|-------|------|
| Section padding (top/bottom) | `5rem` desktop, `3rem` mobile | Use `.section-padding` |
| Section padding (compact) | `3rem` | Use `.section-padding-sm` |
| Container max-width | `1440px` | Use `.container-app` |
| Narrow container max-width | `768px` | Use `.container-narrow` |
| Card padding | `1.5rem` (`p-6`) | Default card padding |
| Admin content padding | `1.5rem` desktop, `1rem` mobile | Use `.admin-content` |

### 3.2 Vertical Rhythm

Use Tailwind spacing scale for all vertical spacing between elements:

| Token | Value | Common Use |
|-------|-------|------------|
| `gap-2` | `0.5rem` | Between icon and text |
| `gap-3` | `0.75rem` | Tight stacking (Stack sm) |
| `gap-4` | `1rem` | Between form fields |
| `gap-6` | `1.5rem` | Default Stack gap |
| `gap-8` | `2rem` | Loose stacking (Stack lg) |
| `space-y-6` | `1.5rem` | Between sections |
| `mt-1` | `0.25rem` | Below headings, between title and description |
| `mt-6` | `1.5rem` | Below section headers |

### 3.3 Responsive Behavior

| Breakpoint | Container Padding | Section Padding |
|------------|------------------|-----------------|
| >= 768px | `2rem` | `5rem` |
| < 768px | `1rem` | `3rem` |
| Admin < 640px | `1rem` | — |

---

## 4. Component Usage Rules

### 4.1 Button Usage Guide

| Variant | When to Use | Example Context |
|---------|-------------|-----------------|
| `primary` | **Main CTA** — The primary action on the page. Blue background, white text. | "Kaydet", "Gönder", "Talep Oluştur" |
| `secondary` | **Alternative action** — White background with border, same emphasis as primary but visually lighter. | "İptal", "Vazgeç", "Önizle" |
| `outline` | **Less prominent action** — Transparent with blue border. For complementary actions. | "Filtrele", "Sırala", "Detay" |
| `ghost` | **Toolbar / header actions** — No border or background until hover. For low-emphasis toolbar items. | "Düzenle", "Sil" (in tables), "Ayarlar" |
| `danger` | **Destructive actions** — Red background. For irreversible operations. | "Hesabı Sil", "Kalıcı Olarak Kaldır" |
| `premium` | **Premium / upgrade** — Amber tones. For monetization actions. | "Premium'a Geç", "Yükselt" |

### 4.2 Badge Usage Guide

| Variant | When to Use | Example |
|---------|-------------|---------|
| `neutral` | Default status, info tags | "Taslak", "Normal" |
| `info` | Informational labels | "Yeni", "Güncellendi" |
| `success` | Positive completion states | "Onaylandı", "Tamamlandı", "Aktif" |
| `warning` | In-progress or attention needed | "Beklemede", "İnceleniyor" |
| `danger` | Error or rejection states | "Reddedildi", "İptal", "Hata" |
| `premium` | Premium feature indicators | "Premium", "VIP" |

### 4.3 Card Usage Guide

| Variant | When to Use | Example |
|---------|-------------|---------|
| `default` | Standard content containers | Dashboard stats, list items, profile cards |
| `elevated` | Content that needs to stand out | Feature highlights, pricing cards, callouts |
| `flat` | Nested content, minimal surfaces | Form sections, settings groups |
| `dark` | Contrast sections on light pages | Premium features, dark CTAs, testimonials |

### 4.4 Alert Usage Guide

| Variant | When to Use | Example Message |
|---------|-------------|-----------------|
| `alert-info` | General information | "Profiliniz başarıyla güncellendi." |
| `alert-success` | Success confirmation | "Talebiniz başarıyla oluşturuldu." |
| `alert-warning` | Warning / attention | "Bu işlem geri alınamaz." |
| `alert-danger` | Error / failure | "Bir hata oluştu. Lütfen tekrar deneyin." |

---

## 5. Voice & Tone

### 5.1 Brand Voice Principles

| Principle | Description |
|-----------|-------------|
| **Professional but approachable** | Sound expert but not cold. Use warm, confident language. |
| **Turkish (tr-TR)** | All UI text must be in Turkish. Use proper Turkish locale formatting. |
| **Second-person** | Address the user as "siz" (formal you). Use "size", "sizin" consistently. |
| **Avoid jargon** | Use plain Turkish words over English or technical loanwords. |
| **Short CTAs** | Buttons and action labels should be 2–3 words maximum. |
| **Consistent terminology** | Use the same Turkish term for the same concept everywhere. |

### 5.2 Terminology Reference

| Concept | Turkish (Use This) | Avoid |
|---------|-------------------|-------|
| Request / Ticket | Talep | Ticket, Request |
| Service | Hizmet | Servis |
| Assembly / Installation | Montaj | Assembly |
| User | Kullanıcı | User |
| Category | Kategori | Category |
| Notification | Bildirim | Notification |
| Dashboard | Panel | Dashboard |
| Settings | Ayarlar | Settings |
| Profile | Profil | Profile |
| Payment | Ödeme | Payment |
| Support | Destek | Support |
| Submit | Gönder | Submit |
| Save | Kaydet | Save |
| Delete | Sil | Delete |
| Cancel | İptal | Cancel |
| Approve | Onayla | Approve |
| Reject | Reddet | Reject |
| Pending | Beklemede | Pending |
| Completed | Tamamlandı | Completed |

### 5.3 Writing Guidelines

**Do:**
- "Hesabınıza giriş yapın"
- "Size en uygun montajcıyı bulun"
- "Talebiniz başarıyla oluşturuldu"
- "Devam etmek istediğinize emin misiniz?"
- "Lütfen geçerli bir e-posta adresi girin"

**Don't:**
- "Login yapın" (use "Giriş yapın")
- "Request'iniz oluşturuldu" (use "Talebiniz oluşturuldu")
- "Are you sure?" (use "Emin misiniz?")
- Mixing English and Turkish in the same sentence

### 5.4 Button Label Patterns

| Action | Turkish Label | Context |
|--------|---------------|---------|
| Create | Oluştur | New request, new service |
| Save | Kaydet | Form save |
| Submit | Gönder | Form submit |
| Cancel | İptal | Cancel operation |
| Delete | Sil | Delete item |
| Edit | Düzenle | Edit item |
| Approve | Onayla | Approve request |
| Reject | Reddet | Reject request |
| View | Görüntüle | View details |
| Close | Kapat | Close modal/drawer |
| Back | Geri | Go back |
| Next | İleri | Next step |
| Send | Gönder | Send message |
| Filter | Filtrele | Filter list |
| Search | Ara | Search |
| Download | İndir | Download file |
| Upload | Yükle | Upload file |
| Upgrade | Yükselt | Premium upgrade |
| Try | Dene | Trial / demo |

---

## 6. Accessibility Standards

- All text color combinations must meet **WCAG AA** contrast ratio (4.5:1 normal text, 3:1 large text)
- Focus indicators: `2px solid var(--color-primary)` with `2px offset`
- Skip navigation link available on all admin pages
- Form inputs must always have associated labels
- Error states must be communicated via both color AND text (not color alone)
- Icons must have `aria-hidden="true"` when decorative, or `aria-label` when semantic
- Loading states must use `aria-busy="true"`
- Animations must respect `prefers-reduced-motion: reduce`

---

## 7. Do's and Don'ts

### Do
- Use `bg-primary` or `var(--color-primary)` for brand-colored elements
- Stack vertical content using Tailwind gap utilities
- Keep button labels to 1–3 Turkish words
- Use `.body` for all standard paragraph text
- Place PageTitle at the top of every admin page
- Wrap form sections in Card with padding

### Don't
- Use raw hex colors outside of globals.css tokens
- Add custom font sizes outside the defined scale
- Stack buttons horizontally on mobile without wrapping
- Use English labels in UI
- Override card shadows with custom box-shadow
- Place headings directly inside cards without the typography classes
