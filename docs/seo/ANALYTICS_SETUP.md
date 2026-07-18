# Analytics Setup Guide

## Current State
No analytics or tracking code present in the codebase. No cookie consent management integrated.

## Recommended Stack

### 1. Google Analytics 4
Add to root layout via `next/script` with `afterInteractive` or `lazyOnload`.

```tsx
// src/components/GoogleAnalytics.tsx
import Script from "next/script";

export default function GoogleAnalytics({ GA_ID }: { GA_ID: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
```

### 2. Microsoft Clarity
```tsx
<Script id="clarity" strategy="lazyOnload">
  {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window, document, "clarity", "script", "CLARITY_ID");`}
</Script>
```

### 3. Cookie Consent
```tsx
// Use existing CookieBanner component — wire GA only after consent
// Integrate with a CMP (Cookiebot, Osano, or custom)
```

### 4. Search Console Verification
Add meta tag to root layout:
```html
<meta name="google-site-verification" content="VERIFICATION_CODE" />
```

## Implementation

### .env.local additions
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
NEXT_PUBLIC_GOOGLE_VERIFICATION=xxxxxxxxxx
```

### Root layout changes
Add to `src/app/layout.tsx`:
```tsx
import GoogleAnalytics from "@/components/GoogleAnalytics";
// Conditionally render based on consent
```
