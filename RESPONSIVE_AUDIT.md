# Responsive Design Audit — Montajım Var

**Project:** Montajım Var (montajimvar.xyz)
**Date:** July 2026
**Framework:** Tailwind CSS v4 (default breakpoints)

---

## Tailwind Default Breakpoints

| Breakpoint | Min-Width | Target |
|------------|-----------|--------|
| `sm`       | 640px     | Large phones / phablets |
| `md`       | 768px     | Tablets |
| `lg`       | 1024px    | Small laptops / landscape tablets |
| `xl`       | 1280px    | Desktops |
| `2xl`      | 1536px    | Wide desktops |

No custom breakpoints defined. Tablet-specific adjustments rely solely on `md:`.

---

## Layout Breakpoints per Component

### `.container-app` (`globals.css:178-192`)
- Default: `max-width: 1440px`, horizontal padding `2rem`
- `≤768px`: padding reduced to `1rem`
- Centered with `margin: auto`

### Navbar (`src/components/Navbar.tsx`)
- **Desktop (`md:flex`):** Horizontal nav links, profile dropdown, CTA buttons
- **Mobile (`<768px`):** Hamburger menu button, slide-down drawer (`#mobile-menu`)
- Drawer uses `role="dialog"` and `aria-modal="true"`
- Body scroll locked when mobile menu open (`document.body.style.overflow = "hidden"`)
- Profile dropdown: username hidden on `<1024px` (`hidden lg:inline`)

### MobileBottomNav (`src/components/MobileBottomNav.tsx`)
- Visible only on `md:hidden` (i.e., `<768px`)
- Fixed bottom bar, 5-column grid
- Authenticated users only (`if (!session) return null`)
- Uses framer-motion slide-up entrance animation

### SearchForm (`src/components/SearchForm.tsx`)
- **Desktop:** Horizontal row with search input + 3 `<select>` menus (`hidden md:flex`)
- **Mobile:** Search input + "Filtreler" toggle button (`flex md:hidden`); filters expand inline
- Autocomplete dropdown appears below input on both layouts
- Active filter tags use responsive flexbox wrapping

### SearchViewToggle (`src/components/SearchViewToggle.tsx`)
- Profile cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Map view: full-width with `h-96`

### DashboardLayout (`src/components/DashboardLayout.tsx`)
- **Desktop (`md:`):** Static sidebar (`md:relative`), hamburger hidden
- **Mobile:** Sidebar as a fixed overlay with dark backdrop (`fixed md:relative`), width 280px
- Sidebar toggle button shown on mobile only (`md:hidden`)
- Username in header hidden at `<1024px` (`hidden lg:inline`)
- Content area uses `container-app` with responsive padding

### AdminShell (`src/components/admin/AdminShell.tsx`)
- **Desktop (`lg:block`):** Sidebar fixed left with collapse/expand (224px / 72px)
- **Mobile:** MobileSidebarDrawer (256px) as slide-in overlay
- `padding-left` transitions smoothly between collapsed/expanded states
- Admin header has mobile-responsive padding (`.admin-content` uses `@media (max-width: 640px)` for 1rem padding)

### Footer (`src/components/Footer.tsx`)
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Bottom bar: `flex-col md:flex-row` (stacks vertically on mobile)
- Gap: `gap-10 lg:gap-16`

### Auth Pages (`giris`, `kayit`, `sifre-unuttum`, etc.)
- `min-h-[80vh]` vertical centering
- Card wrapper: `max-w-lg` (register) / `max-w-md` (login)
- Horizontal padding: `px-4 py-12`
- Register role buttons: `grid-cols-1 sm:grid-cols-3`

### Company Profile (`firma/[id]`)
- `max-w-7xl` container with `px-4 sm:px-6 lg:px-8`

### Blog Listing (`blog/page.tsx`)
- `max-w-4xl` container with responsive padding
- Blog card cover image: `hidden sm:block` (hidden on smallest screens)

### Blog Post (`blog/[slug]`)
- `max-w-3xl` container with responsive padding

### Search Page (`ara/page.tsx`)
- `max-w-7xl` container with `px-4 sm:px-6 lg:px-8`

### Homepage (`page.tsx`)
- Full viewport hero sections
- Overflow hidden on wrapper
- Each v5 section handles its own responsive layout

### Admin Pages
- Page header responsive: `flex-col sm:flex-row`
- Data table horizontal scroll on mobile
- Stats cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Pagination: responsive gap/sizing

---

## Known Issues

### 🟠 HIGH

#### R-1. No 320px (iPhone SE) breakpoint verification
- **Location:** All pages
- **Description:** The smallest supported width is not explicitly verified. The `px-2` (8px) minimum padding in `.container-app` at 320px leaves only 304px content width. Cards, tables, and 5-column mobile nav may overflow or appear cramped.
- **Fix:** Test all pages at 320px width. Add `px-1` or reduce grid columns at very small viewports. Critical paths: MobileBottomNav (5 items), auth forms, search results.

#### R-2. No tablet-specific navigation layout
- **Location:** `Navbar.tsx`
- **Description:** The navbar jumps directly from desktop (horizontal links) to mobile (hamburger) at 768px. No tablet-optimized layout (e.g., condensed nav links or icon-only items) exists for the 768-1024px range.
- **Fix:** Consider a tablet breakpoint with condensed or icon-only nav items.

#### R-3. Dashboard sidebar uses JavaScript width animation
- **Location:** `DashboardLayout.tsx:66-72`
- **Description:** The sidebar width transitions from 0 to 280px using framer-motion. On slow devices, this causes layout shift. The sidebar is a fixed overlay on mobile (correct), but uses `md:relative` which can cause jank.
- **Fix:** Use CSS transitions instead of JS-driven width animation for the sidebar. Prefer `translateX` transforms for overlay panels.

#### R-4. Admin sidebar padding-left animation may trigger repaints
- **Location:** `AdminShell.tsx:102-103`
- **Description:** `padding-left` transition on the main content area causes layout repaints when collapsing/expanding the sidebar. With many DOM elements, this can be janky on mid-range devices.
- **Fix:** Consider using `margin-left` or `translateX` on a wrapper instead of `padding-left` for better compositing performance.

### 🟡 MEDIUM

#### R-5. No orientation-specific layouts
- **Description:** No CSS or JS adjustments for landscape phone mode. The mobile bottom nav and fixed layouts may behave poorly in landscape where vertical space is limited.
- **Fix:** Test and adjust for `@media (orientation: landscape)` and `@media (max-height: 480px)`.

#### R-6. Font scaling on large screens
- **Description:** `heading-xl` uses `clamp(2rem, 5vw, 3rem)`. At 1920px, `5vw = 96px` but clamped to 48px. This is good for readability; however, some text elements lack responsive font sizing and may appear small on large displays.
- **Fix:** Audit typography to ensure consistent use of `clamp()` on all heading and body text sizes.

#### R-7. Image gallery not audited for responsive loading
- **Location:** `ImageGallery.tsx`, `PortfolioGallery.tsx`
- **Description:** Responsive image loading (`sizes` attribute, `srcSet`) usage is unknown. Large images may be served at full resolution on mobile.
- **Fix:** Verify responsive image patterns across gallery components.

---

## Recommendations

1. **Test on real devices:** iPhone SE (320px), iPhone 12/13/14 (390px), iPad Air (820px), Surface Pro (1440px), 1920px desktop.
2. **Add custom breakpoint** for very small phones (e.g., `xs: 375px`) to handle edge cases.
3. **Verify touch target sizes** on MobileBottomNav at 320-375px widths.
4. **Remove body scroll lock** for mobile menu — use `overflow: clip` on `<html>` instead for better scrollbar handling.
5. **Use CSS transforms** for sidebar animations instead of layout-triggering properties.
6. **Add landscape orientation** overrides for fixed-position elements.

---

## Approved Patterns

| Pattern | Verdict |
|---------|---------|
| `container-app` max-width 1440px | ✅ Good |
| Responsive padding on container | ✅ Good |
| Mobile-first hidden/shown approach | ✅ Good |
| Footer responsive grid | ✅ Good |
| Auth forms centered with max-width | ✅ Good |
| Admin sidebar collapse/expand | ✅ Good |
| Search page dual layout (desktop row / mobile stacked) | ✅ Good |
