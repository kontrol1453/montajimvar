# Image Optimization Plan

## Current State

| Component | Uses `next/image` | Sizes | Priority | Alt Text |
|-----------|-------------------|-------|----------|----------|
| Navbar (logo) | ✅ | ? | ? | ? |
| CompanyCard | ✅ | ? | ? | ? |
| ImageGallery | ✅ | ? | ? | ? |
| PortfolioGallery | ✅ | ? | ? | ? |
| AdminHeader (avatar) | ✅ | fill | ? | "" |

## Issues

1. **No `sizes` attribute**: Images missing responsive sizes → browser downloads oversized.
2. **No `priority` on LCP images**: Hero images not marked priority → delayed LCP.
3. **Missing alt text**: Some images use `alt=""` (AdminHeader) or no alt.
4. **No remote pattern optimization**: Supabase images served without WebP negotiation.

## Implementation

### Step 1: Create ImageWrapper component
```tsx
// src/components/ImageWrapper.tsx
import Image from "next/image";
// Standardized props: src, alt, sizes, priority, className, fill, width, height
```

### Step 2: Fix all Image usages
- Add `sizes` to every Image: `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Add `priority` to hero/LCP images
- Add descriptive alt text to all images
- Replace `img` tags with `next/image` where found

### Step 3: Configure remote patterns
```js
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co' },
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    { protocol: 'https', hostname: '*.googleusercontent.com' },
  ],
}
```

### Step 4: CDN caching
- Set `Cache-Control: public, max-age=31536000, immutable` for images
- Use Supabase transformations: `?width=400&format=webp`
