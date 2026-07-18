# Montajım Var — Homepage Information Architecture

## Current Section Analysis

### 1. HeroV5 (`src/app/(public)/v5/HeroV5.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Primary value proposition with search bar, category pills, trust signals |
| **Business question** | What is this platform and how do I get started? |
| **Conversion goal** | Search initiation or CTA click ("Ücretsiz İş Oluştur") |
| **Proposed improvements** | Already strong. Consider A/B testing headline copy. The mock analytics panel is decorative — replace with live data when available. |

### 2. TrustBar (`src/app/(public)/v5/TrustBar.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | 4-column trust signal row (Emanet Ödeme, Doğrulanmış Ekipler, Net SLA, Şeffaf Anlaşma) |
| **Business question** | Can I trust this platform? |
| **Conversion goal** | Reduce friction/uncertainty before scrolling further |
| **Proposed improvements** | Could be merged into the hero as a single band. Icons are currently redundant with hero trust signals below search. |

### 3. AudienceGateway (`src/app/(public)/v5/AudienceGateway.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | 4-card audience selector (Bireysel, Montaj Ekibi, Kurumsal, Üretici) |
| **Business question** | Is this platform for me? |
| **Conversion goal** | Route user to appropriate landing page |
| **Proposed improvements** | Strong section. Add small tag chips at bottom showing audience categories for skimmability. |

### 4. ServiceDiscovery (`src/app/(public)/v5/ServiceDiscovery.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | 8-card category grid with DB-driven extension row |
| **Business question** | What services are available? |
| **Conversion goal** | Category exploration → search page |
| **Proposed improvements** | Consider a visual category grid rather than card list. The DB tag row below the grid is useful but visually dense. |

### 5. ProductWorkflow (`src/app/(public)/v5/ProductWorkflow.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | 4-step process (Tanımla, Karşılaştır, Öde, Takip Et) |
| **Business question** | How does the platform work? |
| **Conversion goal** | Create a job |
| **Proposed improvements** | Could be simplified to 3 steps for quicker comprehension. Speed test banner is effective social proof. |

### 6. PlatformCapabilities (`src/app/(public)/v5/PlatformCapabilities.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | 10-capability grid with available/beta/soon status badges |
| **Business question** | What features does the platform offer? |
| **Conversion goal** | Feature awareness → trust |
| **Proposed improvements** | Too dense for early homepage position. Move later in flow. The "soon" items create expectation risk. |

### 7. CorporateOperations (`src/app/(public)/v5/CorporateOperations.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | B2B section with dark background, 4 pillar cards, highlights |
| **Business question** | Does this work for my business? |
| **Conversion goal** | Corporate inquiry |
| **Proposed improvements** | Well-positioned after platform capabilities. Consider adding a testimonial carousel for B2B clients. |

### 8. VerifiedMetrics (`src/app/(public)/v5/VerifiedMetrics.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Live DB-driven stats (profile count, city count, rating, categories) |
| **Business question** | How big/established is this platform? |
| **Conversion goal** | Social proof → trust |
| **Proposed improvements** | Move higher in the page. Real data is a strong differentiator. |

### 9. AITeaser (`src/app/(public)/v5/AITeaser.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Coming-soon AI visual recognition feature |
| **Business question** | What innovation is coming? |
| **Conversion goal** | Email collection / waitlist (currently missing) |
| **Proposed improvements** | Add a waitlist signup. Currently no way to capture interest. |

### 10. WhyMontajimVar (`src/app/(public)/v5/WhyMontajimVar.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | 5 reasons to choose the platform |
| **Business question** | Why this platform over alternatives? |
| **Conversion goal** | Reinforce decision |
| **Proposed improvements** | Content overlaps with TrustBar and PlatformCapabilities. Consider merging or removing. |

### 11. BlogSection (`src/app/(public)/BlogSection.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | 3 latest blog posts grid |
| **Business question** | Is there educational content? |
| **Conversion goal** | Blog engagement → SEO |
| **Proposed improvements** | Hides when no posts exist. Consider a fallback UI. Uses legacy CSS variables (`var(--color-dark)`, `var(--color-surface-secondary)`) — needs updating to design system tokens. |

### 12. FAQv5 (`src/app/(public)/v5/FAQv5.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Accordion FAQ with schema.org structured data |
| **Business question** | Common concerns answered |
| **Conversion goal** | Reduce abandonment |
| **Proposed improvements** | Expand to 6-8 questions. Currently 4. |

### 13. FinalConversionCTA (`src/app/(public)/v5/FinalConversionCTA.tsx`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Final CTA card with dual buttons and trust signals |
| **Business question** | Ready to start? |
| **Conversion goal** | Final conversion |
| **Proposed improvements** | Strong closing. Consider adding a testimonial quote above the CTA. |

---

## Proposed Restructured Homepage IA

### 1. Announcement Bar (new)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Display platform announcements, promotions, or seasonal banners |
| **Key content** | Campaign text, optional CTA link |
| **Design notes** | Slimbar top, dismissible via cookie |
| **Success metric** | Click-through rate on announcement links |

### 2. Header / Nav

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Global navigation, logo, auth state |
| **Key content** | Logo, nav links (İş Oluştur, Hizmetler, Kurumsal, Blog), auth buttons |
| **Design notes** | Sticky on scroll, mobile hamburger + bottom nav |
| **Success metric** | Nav link click rate |

### 3. Hero

| Attribute | Detail |
|-----------|--------|
| **Purpose** | What, who, why, CTA — primary value proposition |
| **Key content** | Headline, subheadline, search bar with category pills, 2 CTAs, 3 trust signals |
| **Design notes** | Gradient background, search bar as focal point, popular category tags |
| **Success metric** | Search submissions, primary CTA click rate |

### 4. Trust Indicators

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Verified statistics and security badges |
| **Key content** | Live metrics (profile count, city count, rating, categories), escrow badge |
| **Design notes** | Move VerifiedMetrics higher. Combine with TrustBar elements |
| **Success metric** | Time on page, scroll depth |

### 5. Audience Gateway

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Who is this for? Route visitors by role |
| **Key content** | 4 audience cards (Customer, Installer, Corporate, Manufacturer) |
| **Design notes** | 4-column grid, accent-colored cards, bottom tag chips |
| **Success metric** | Click-through to role-specific pages |

### 6. Services / Categories

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Visual category grid of available services |
| **Key content** | 8+ service categories with icons, DB-driven tags |
| **Design notes** | Gradient card grid, hover lift effect, "Tümünü Gör" link |
| **Success metric** | Category page visits |

### 7. How It Works

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Simplified 3-step process explanation |
| **Key content** | 3 steps: Define → Compare → Complete |
| **Design notes** | Combine current 4 steps into 3 for faster comprehension. Add speed stat banner |
| **Success metric** | Job creation starts |

### 8. Marketplace Preview

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Live preview of active jobs, profiles, or map |
| **Key content** | Sample job listings, map view, active profiles |
| **Design notes** | Interactive preview component pulling from real data |
| **Success metric** | Engagement with preview |

### 9. Verified Installers

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Featured companies with verification badges |
| **Key content** | 6-8 featured profiles, badges, ratings |
| **Design notes** | Horizontal scroll or 3-column grid |
| **Success metric** | Profile page visits |

### 10. Corporate Solutions

| Attribute | Detail |
|-----------|--------|
| **Purpose** | B2B value proposition for chains and manufacturers |
| **Key content** | Dark section, 4 pillar cards, feature highlights, dual CTA |
| **Design notes** | Maintain current dark background treatment |
| **Success metric** | Corporate inquiry submissions |

### 11. Platform Features

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Key benefits and capabilities |
| **Key content** | 6-8 features with status badges (available/beta/soon) |
| **Design notes** | Grid layout, filter by available-only (hide "soon" items) |
| **Success metric** | Feature page engagement |

### 12. Testimonials / Reviews

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Social proof through customer testimonials |
| **Key content** | 3-4 customer/installer testimonials with ratings |
| **Design notes** | Carousel or static grid with photos |
| **Success metric** | Trust lift (survey) |

### 13. Statistics

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Real platform metrics (DB-driven) |
| **Key content** | Verified profiles, cities, rating, completed jobs |
| **Design notes** | Large numbers, icon per stat, live data badge |
| **Success metric** | Scroll depth, CTA click rate after stats |

### 14. FAQ

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Answer common questions |
| **Key content** | 6-8 FAQ accordion items with schema.org structured data |
| **Design notes** | Accordion, one open by default, search-friendly |
| **Success metric** | FAQ interaction rate, reduced support tickets |

### 15. Final CTA

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Final conversion prompt |
| **Key content** | Card with headline, description, dual buttons, trust signals |
| **Design notes** | Elevated card, centered, gradient background |
| **Success metric** | Conversion rate |

### 16. Footer

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Secondary navigation, legal, social links |
| **Key content** | Sitemap, contact, social media, legal |
| **Design notes** | Multi-column, dark background |
| **Success metric** | Footer link clicks |

---

## Key Structural Changes from Current to Proposed

| Change | Rationale |
|--------|-----------|
| Move VerifiedMetrics from #8 to #4 | Real data builds trust early |
| Merge TrustBar into Trust Indicators | Reduce redundancy (trust signals appear 3x currently) |
| Introduce Marketplace Preview | Show real platform activity, not just mock screenshots |
| Introduce Verified Installers | Social proof through featured companies |
| Add Announcement Bar | Flexible promotion slot without disrupting IA |
| Reduce workflow from 4 to 3 steps | Faster cognitive processing |
| Move AI Teaser later or to subpage | "Coming soon" items create expectation without payoff |
| Add Testimonials before FAQ | Social proof right before decision point |
