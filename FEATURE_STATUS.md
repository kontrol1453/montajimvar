# Montajım Var — Master Feature Status

> **Generated:** 2026-07-16  
> **Stack:** Next.js 16.2.9 | React 19.2.3 | Tailwind CSS v4 | Prisma 5.22 + PostgreSQL (NeonDB)  
> **Auth:** NextAuth.js 4.24.14 (JWT + Google OAuth)  
> **Roles:** CUSTOMER | ASSEMBLER | MANUFACTURER | ADMIN  
> **Animate:** Framer Motion | **Icons:** Lucide | **Toasts:** Sonner | **Maps:** Leaflet  
> **Mobile:** Expo (separate)  
> **Tests:** None | **Form validation:** None | **State management:** None  

---

## 1. Homepage (v5)
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 8/10  
**Business Value:** 10/10  

**Explanation:** Full 13-section landing page with live data (profile count, city count, avg rating, categories pulled from DB via Prisma). All v5 components exist: HeroV5, TrustBar, AudienceGateway, ServiceDiscovery (with DB categories), ProductWorkflow, PlatformCapabilities, CorporateOperations, VerifiedMetrics (live stats), AITeaser, WhyMontajimVar, FAQv5, FinalConversionCTA, BlogSection. Server component with `force-dynamic`. Metadata + OpenGraph tags for SEO.

**Specific Issues:**
- `_lib/` directory in v5 — unclear purpose, may contain dead code
- No analytics tracking on CTA clicks or user journey
- Framer Motion `ease` arrays hardcoded throughout (no shared animation tokens)
- BlogSection loads latest blog posts but no pagination for high post volumes

**Recommendation:** Add event tracking on CTAs, extract animation configs to a shared constants file, add blog post pagination.

---

## 2. Authentication System
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 6/10  
**Business Value:** 10/10  

**Explanation:** Login (credentials + Google), registration with role selection, JWT session management all work. Email verification flow exists (template + token). Password reset exists (token + email template). 4 roles fully supported.

**Specific Issues:**
- No email verification resend mechanism for expired tokens
- `NEXTAUTH_SECRET` falls back to hardcoded string in source (`lib/auth.ts:166`)
- Google OAuth role selection uses fragile cookie mechanism
- No rate limiting on login/password-reset endpoints
- No brute-force protection or account lockout
- Password reset token has no cleanup mechanism for expired tokens
- No form validation library — all validation is manual inline

**Recommendation:** Move secret to env-only (remove fallback), add rate limiting, implement email resend, add account lockout after N failed attempts, add expired-token cleanup job.

---

## 3. Search
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 10/10  

**Explanation:** Category filter with autocomplete, city filter, rating filter (minPuan), sort options (en_yeni, en_eski, puana_gore), active filter tags, pagination (12/page), list/map toggle via `SearchViewToggle`. Dynamic metadata per search query. Loading skeleton exists. Map view with Leaflet.

**Specific Issues:**
- No debounced autocomplete — search form reloads page on each filter change (server component)
- `contains` with `mode: "insensitive"` — no full-text search index, poor performance at scale
- Map only shows on initial load with profiles that have lat/lng — no separate map-only mode
- No saved search or alert functionality

**Recommendation:** Add debounced client-side autocomplete, implement PostgreSQL full-text search, add saved search/bookmark feature.

---

## 4. Company Profiles
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 10/10  

**Explanation:** Full profile CRUD with company name, description, categories (many-to-many via ProfileCategory), city, location, images (ProfileImage gallery with categories: before_after, project, team, equipment), portfolio section, videos (ArtisanVideo), reviews, favorites, contact info, premium badge, WhatsApp integration, working cities JSON, service area km, insurance/guarantee toggles, view count tracking.

**Specific Issues:**
- `workingCities` stored as JSON string — no referential integrity with a cities table
- No image moderation/approval workflow
- `viewCount` is a simple integer — no unique-view or bot-filtering logic
- No company verification workflow (currently just `isVerified` boolean)
- `coverPhoto` on User model but no upload UI for it

**Recommendation:** Normalize working cities into a join table, add image moderation, add unique-view tracking, build verification workflow.

---

## 5. Job System
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 9/10  

**Explanation:** 6-step job creation wizard (StepCategory, StepDetails, StepLocation, StepPhotos, StepConfirm + StepIndicator). Full status lifecycle (pending → offers_received → assigned → en_route → in_progress → completed → review_pending / cancelled). Offers from artisans with accept/reject. Job timeline tracking. Job-specific messages (JobMessage). Job reviews after completion. Budget tracking with min/max. AI price suggestion on creation. Photo upload for jobs.

**Specific Issues:**
- No job editing after creation (only cancellation)
- No notification to artisans when matching jobs posted
- No re-assignment flow if assigned artisan cancels
- `JobMessage` fileUrl supports only voice/files — no actual upload endpoint
- Job timeline events logged but not displayed in a timeline UI

**Recommendation:** Add job editing, artisan matching notifications, re-assignment flow, timeline UI component.

---

## 6. Messaging
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 6/10  
**Business Value:** 8/10  

**Explanation:** Direct user-to-user messaging with sender/receiver model, reply chains via `replyTo` self-relation, read/unread tracking with `readAt`, conversation grouping by partner, MarkAllReadButton, API endpoints for CRUD and read-all. Separate job messages table for job-specific conversations.

**Specific Issues:**
- No real-time updates (WebSocket/SSE) — requires page refresh
- No message attachments (images/files)
- No message search
- No typing indicators
- No message delete functionality for users
- Dark theme styling on messages page (`bg-dark-card`, `text-white`) may conflict with light theme

**Recommendation:** Add WebSocket (or at least polling) for real-time updates, message attachments, message search.

---

## 7. Payments
**Status: PROTOTYPE**  
**Code Quality:** 5/10  
**UX Quality:** 3/10  
**Business Value:** 9/10  

**Explanation:** Payment abstraction layer exists with `PaymentProviderInterface`, `MockProvider` implementation, commission calculation (8%), escrow-like status (escrow → released → refunded). Full Payment model with provider fields, invoice model, payment API route at `/api/jobs/[id]/payment`. But **no real payment gateway connected**.

**Specific Issues:**
- `MockProvider` uses `Math.random() > 0.1` — not deterministic, no real card validation
- No iyzico/PayTR/Stripe integration despite provider fields
- No payment UI for users (no card entry form, no checkout page)
- Escrow release flow is DB-modeled but no admin/manual release UI
- Payment history only in dashboard/uyelik (subscription payments) — no general payment history
- No refund initiation from admin panel

**Recommendation:** This is the single highest-priority blocker. Connect at least one real provider (iyzico for Turkey), build payment checkout UI, implement escrow release workflow.

---

## 8. Dashboard (General)
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 6/10  
**Business Value:** 8/10  

**Explanation:** Stats grid (today's jobs, monthly income, pending offers, active team), analytics sections (profile views, rating, review count, messages, favorites for ASSEMBLER/MANUFACTURER), budget tracking (active budget, monthly spent for CUSTOMER), quick actions (role-based: customer sees "İş Ver/Firma Ara/Mesajlar/Favoriler", artisan sees "İşlerim/Mesajlar/Profil/Üyelik"). Premium badge and premium-without-profile prompt.

**Specific Issues:**
- Income stat shows hardcoded "₺12,450" for premium users — fake data
- Active team stat shows `reviewCount` — semantically wrong
- Budget values use `budgetMax` which is optional (nullable — may show 0)
- No role-based redirect (all users see same dashboard, just different sections shown)
- Framer Motion delays feel sluggish on slower devices

**Recommendation:** Replace hardcoded income with real data, fix "Active Team" metric, add role-specific dashboards.

---

## 9. Dashboard (Firma/Company Profile)
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 6/10  
**Business Value:** 9/10  

**Explanation:** Full company form with company name, description, category selection (multi-select), city, address, phone, website, WhatsApp, coordinates, insurance/guarantee toggles, working cities multi-select from Turkish cities list, image gallery upload. Premium subscription section with auto-renew toggle, cancel subscription. Profile creation and update API (`/api/profiles`).

**Specific Issues:**
- Form uses raw `useState` without validation library — state spread is error-prone
- No image preview before upload (uses ImageGallery which loads from server)
- Coordinates are manual text fields, not map picker
- Working cities stored as JSON string, no city table
- Error feedback relies on `setMessage` — no inline field validation messages

**Recommendation:** Extract form logic to a custom hook or use a form library, add map coordinate picker, add inline field validation.

---

## 10. Dashboard (Messages)
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 6/10  
**Business Value:** 7/10  

**Explanation:** Messages list page with conversation grouping, MarkAllReadButton, conversation detail page at `[id]` route, read/unread tracking, sender/receiver info. Groups by conversation partner with latest message preview and unread count. API for reading all messages (`/api/messages/read-all`).

**Specific Issues:**
- Same dark-theme styling inconsistency as main messaging
- No pagination on message list page (limited to 200)
- Conversation grouping is server-side only — no way to start new conversation from messages page
- No message search within conversations

**Recommendation:** Unify theme styling, add pagination, add "new message" compose UI.

---

## 11. Dashboard (Offers)
**Status: PROTOTYPE**  
**Code Quality:** 5/10  
**UX Quality:** 4/10  
**Business Value:** 8/10  

**Explanation:** Page exists at `/dashboard/teklifler/page.tsx` but offers list likely basic. Offer API at `/api/offers/`. Offer management in job context exists (create offer on job, accept/reject).

**Specific Issues:**
- Need to verify the full offer management UI
- No offer comparison view for customers (side-by-side offers)
- No automated offer acceptance workflow
- No offer withdrawal flow

**Recommendation:** Audit and build comprehensive offer management with comparison, acceptance workflows.

---

## 12. Admin Panel
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 10/10  

**Explanation:** 18 route groups fully scaffolded:
- **Komuta Merkezi** (Command Center) — 10 files: AttentionCenter, CommandCenterClient, CommandHeader, FinancialOverview, MarketplaceHealth, OperationsCenter, PlatformPulse, QuickActions, RecentActivity
- **Kullanicilar** (Users) — user management
- **Firmalar** (Companies) — company management
- **Isler** (Jobs) — job management
- **Yorumlar** (Reviews)
- **Blog** — blog CRUD
- **Kategoriler** (Categories)
- **Sehir Sayfalari** (City Pages)
- **Bildirim** (Notifications)
- **Sertifikalar** (Certificates)
- **Anlasmazliklar** (Disputes)
- **Abonelik Plani** (Subscription Plans)
- **Izinler** (Permissions)
- **CRM** — CRM dashboard with stats + call reminders
- **Audit Logs**
- **Google Firma Ekle** (Google Business)

**Specific Issues:**
- Admin page redirects to `/admin/audit-logs` as default — unusual choice
- AdminShell, AdminSidebar, AdminHeader, Breadcrumbs are all well-built but some sections may have placeholder content
- NotificationBell in admin but no real push notification integration for admin
- No admin role verification middleware (any authenticated user could potentially access `/admin/*`)
- Some admin pages may be empty/placeholder (need individual verification)

**Recommendation:** Add admin role guard middleware, set a proper admin landing page (command center), audit each section for real vs placeholder content.

---

## 13. Admin Components
**Status: COMPLETE**  
**Code Quality:** 8/10  
**UX Quality:** 8/10  
**Business Value:** 9/10  

**Explanation:** Rich component library:
- **AdminShell** — layout wrapper with sidebar + header
- **AdminSidebar** — dark sidebar with nav items
- **AdminHeader + Breadcrumb** — top bar with breadcrumbs
- **DataTable** — AdminTable, AdminToolbar, RowActionsDropdown — generic table with sorting, actions
- **Dialog** — modal dialog with configurable actions
- **StatCard** — stat display card
- **PageHeader** — page title/description component
- **Pagination** — pagination component
- **LoadingSkeleton** — loading state component
- **SearchModal** — admin search modal
- **ShortcutsModal** — keyboard shortcuts modal
- **EmptyState** — empty state with variants (Users, Jobs, Companies, Reviews, Disputes, Certificates, Generic)
- **Entity** components: EntityTabs, EntityStatus, EntityLink, EntityHeader
- **DataCard, SectionContainer, CopyButton**

**Specific Issues:**
- No unit tests for any of these components
- Some variants (EmptyJobs, EmptyCompanies) take `onCreate` callback prop but the pattern is inconsistent
- No loading skeleton variants for tables specifically

**Recommendation:** Add component tests, standardize prop patterns.

---

## 14. Blog
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 6/10  

**Explanation:** Blog listing page, blog detail at `[slug]`, admin blog CRUD, BlogCategory model with relation, city-specific blog posts (city + serviceSlug fields), BlogSection component on homepage that loads latest posts. Seed script for blog data.

**Specific Issues:**
- No blog search/filter by category on public side
- No tags display or filtering despite tags field (JSON array)
- Comment system not implemented
- No RSS feed

**Recommendation:** Add category filtering, tag display, RSS feed for SEO.

---

## 15. City Pages
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 6/10  
**Business Value:** 8/10  

**Explanation:** SEO city landing pages at `/(public)/sehir/[city]`, city+service specific pages at `/(public)/[city]/[service]`, CityServicePage model with title, content, meta fields, slug. Seed script for city pages. Dynamic routing set up.

**Specific Issues:**
- Content likely auto-generated/seed data — quality and uniqueness unknown
- No city-specific blog post integration on city pages
- No city-specific profile count or stats display
- Template-based generation may produce thin/d duplicate content (SEO risk)

**Recommendation:** Verify content quality, add city-specific live data, ensure no duplicate content issues.

---

## 16. PWA
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 7/10  

**Explanation:** Service worker (`public/sw.js`) with:
- Cache-first for `/_next/static` assets
- Stale-while-revalidate for navigation requests
- Network-first with offline fallback for other assets
- Offline page (`public/offline.html`)
- Push notification handling (receive + notificationclick)
- Skip waiting + clients claim
- Manifest (`public/manifest.json`) with icons, theme color, display standalone
- PWA install prompt component (`PwaInstallPrompt.tsx`)

**Specific Issues:**
- Cache name is `montajimvar-v3` — versioning may need automation
- No dynamic caching for API responses
- Offline page is static HTML — no React hydration
- Install prompt uses old `beforeinstallprompt` event — this is deprecated in some browsers
- No periodic background sync

**Recommendation:** Automate cache versioning, add API caching strategy for GET requests, consider service worker library (Workbox) for production.

---

## 17. Push Notifications
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 5/10  
**Business Value:** 7/10  

**Explanation:** VAPID keys via `web-push` library, PushSubscription model with endpoint/p256dh/auth, push notification setup component (`PushNotificationSetup.tsx`), push event handler in service worker (`sw.js`). Subscription management API.

**Specific Issues:**
- `PushNotificationSetup.tsx` exists but no real notification triggers in business logic (e.g., no push when new message arrives)
- No unsubscribe/cleanup for expired subscriptions
- No notification permission prompt UI orchestration
- Service worker push handler has no action buttons in notifications
- `NOTIFICATION_LINKS` in `lib/notifications.ts` has all links pointing to `/admin/kullanicilar` — wrong/unimplemented targets

**Recommendation:** Wire business events (new message, new offer, job status change) to push notifications, clean up stale subscriptions, implement notification action buttons.

---

## 18. Email System
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 8/10  

**Explanation:** Nodemailer SMTP transport with configurable host/port/user/pass. Dev mode logging when SMTP not configured. HTML templates for: email verification, password reset, welcome, premium reminder. All templates have responsive table-based layout with proper branding.

**Specific Issues:**
- Templates are hardcoded strings — no template engine (handlebars, ejs, react-email)
- No email queue — sending is synchronous in request path
- No email sending error handling beyond console.error
- Dev log only logs link — no way to test full rendering
- SMTP config from env is fragile — no validation at startup

**Recommendation:** Use react-email or MJML for template management, add email queue with retry, add SMTP config validation on startup.

---

## 19. Analytics
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 6/10  
**Business Value:** 8/10  

**Explanation:** Dashboard analytics for ASSEMBLER/MANUFACTURER (view count, rating, messages, favorites, jobs, offers). Analytics API at `/api/analytics/[id]`. Profile view tracking via `ProfileViewLog` model. Admin CRM with job stats, user stats, conversion rates. `getCrmData()` provides full job pipeline analytics.

**Specific Issues:**
- No chart visualizations (just raw numbers and icons)
- Profile view log accumulates all views — no unique-view or time-window aggregation
- No analytics for CUSTOMER behavior
- No time-series analytics (trends over time)
- CRM data is server-side only — no interactive filtering by date range

**Recommendation:** Add chart library (recharts/chart.js) for visualizations, implement unique view tracking, add time-series aggregation, date-range filtering.

---

## 20. AI Features
**Status: PROTOTYPE**  
**Code Quality:** 5/10  
**UX Quality:** 5/10  
**Business Value:** 7/10  

**Explanation:** Three AI components:
- **AI Assistant widget** (`AIAssistant.tsx`) — floating button with 5 hardcoded options linking to pages (not actual AI)
- **Price Analyzer** (`PriceAnalyzer.tsx` + `lib/price-analyzer.ts`) — rule-based price estimation by category, city multiplier, urgency, complexity. No ML/AI — just deterministic math
- **Vision Analyzer** (`lib/vision-analyzer.ts`) — Gemini API integration for photo analysis. Gated behind `GEMINI_API_KEY` — disabled by default

**Specific Issues:**
- "AI Assistant" is a glorified link menu — no actual LLM integration
- Price Analyzer is rule-based, not AI — good but mislabeled
- Vision Analyzer has no UI component (no way for users to actually use it)
- Vision Analyzer fetches full images to Gemini — cost risk at scale, no caching
- No error recovery if Gemini API fails
- `/api/analyze` route exists but unclear if it connects to anything

**Recommendation:** Either rebrand as "Smart Assistant"/"Price Estimator" or connect to an actual LLM API (OpenAI/Claude/Gemini) for real chat. Build UI for vision analyzer, add cost controls and caching.

---

## 21. Map Features
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 7/10  

**Explanation:** Leaflet map on search page via `SearchMap.tsx` with profile markers (custom div icons with initials), bounds fitting, click-to-popup. `CompanyMap` component for individual profile pages. `SearchViewToggle` to switch between list and map views. OpenStreetMap tile layer.

**Specific Issues:**
- Map only shows profiles with lat/lng — many profiles may not have coordinates set
- Marker popup only shows initial and rating — no link to profile
- No search-on-map-move (re-fetch results when map bounds change)
- Map tiles render on page load even when view is in list mode (lazy initialization helps but still loads Leaflet)

**Recommendation:** Add profile link in marker popup, add "search this area" on map move, lazy-load Leaflet only when map view is active.

---

## 22. Responsive Design
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 8/10  

**Explanation:** MobileBottomNav with 5 items (session-only), responsive Navbar with mobile drawer and dropdown menus, responsive containers with standard breakpoints (`px-4 sm:px-6 lg:px-8`), mobile filter toggle on search page, responsive grid layouts (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).

**Specific Issues:**
- MobileBottomNav only shows when logged in — anonymous mobile users have no bottom nav
- Some pages use `bg-dark-card` / `text-white` patterns that conflict with the light theme
- Framer Motion animations without `useReducedMotion` check
- No tablet-specific breakpoint considerations

**Recommendation:** Add anonymous bottom nav or "sign in" prompt, respect `prefers-reduced-motion`, add `useReducedMotion` to animations.

---

## 23. SEO
**Status: COMPLETE**  
**Code Quality:** 8/10  
**UX Quality:** 8/10  
**Business Value:** 9/10  

**Explanation:** Dynamic metadata per page (search page with query/category/city in title), `sitemap.ts` (Next.js 16 App Router), `robots.ts`, LD+JSON structured data in root layout (WebSite + Organization schema), OpenGraph tags on layout and individual pages, semantic HTML structure.

**Specific Issues:**
- No breadcrumb structured data (BreadcrumbList)
- No LocalBusiness schema for company profiles
- No article schema for blog posts
- No FAQ schema for FAQ section (FAQs are in v5 but not structured)
- No hreflang tags (Turkish-only site, but still good practice)

**Recommendation:** Add BreadcrumbList, LocalBusiness, Article, and FAQ schemas. Add hreflang for completeness.

---

## 24. GDPR/Legal
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 9/10  

**Explanation:** All pages exist with content: Cookie Policy (`cerez/page.tsx`), Privacy Policy (`gizlilik/page.tsx`), Terms of Use (`kullanim-kosullari/page.tsx`), KVKK (`kvkk/page.tsx`), Pre-information Form (`on-bilgilendirme/page.tsx`), Security (`guvenlik/page.tsx`), Occupational Health (`is-sagligi/page.tsx`). Cookie banner component with accept-all / necessary-only / settings options.

**Specific Issues:**
- Cookie consent stored only in localStorage — no server-side enforcement
- Cookie settings modal not implemented (calls `acceptAll()` as fallback)
- No GDPR-compliant data deletion request flow
- No ability to change cookie preferences after initial choice (no settings page)
- Legal pages content quality and accuracy not verified

**Recommendation:** Add server-side cookie consent verification, implement log-in data deletion, add cookie settings UI after consent.

---

## 25. Mobile App
**Status: PROTOTYPE**  
**Code Quality:** 5/10  
**UX Quality:** 4/10  
**Business Value:** 7/10  

**Explanation:** Expo React Native app in `/mobile/` with:
- 6 screens: Home, Login, Register, Profile, Messages, Favorites
- Auth store (Zustand)
- API client with auth token management
- App navigator
- Styles defined per-screen
- Uses bare React Native (no expo-router for routing)

**Specific Issues:**
- No real functionality beyond screen shells — no data fetching patterns
- No company detail, search, or job screens
- Expo SDK 56.0.12 — very new
- React Native 0.85.3 — very new, may have breaking changes
- No push notification integration on mobile
- API client URL needs to be configurable for different environments
- No tests
- No CI/CD pipeline (codemagic.yaml exists but no build verification)

**Recommendation:** This needs a dedicated mobile development phase. Prioritize core screens (search, company detail, job creation) over polish.

---

## 26. Navigation
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 9/10  

**Explanation:** Navbar with session-aware links (shows login/register when signed out, profile/dashboard when signed in), mobile drawer with overlay, dropdown menus for profile, role-aware items (different nav for different user types), dropdown close on outside click (clickOutsideHandler), responsive breakpoint for mobile/desktop.

**Specific Issues:**
- Navbar links use partial path matching that may cause false positives
- No role-based nav item visibility in admin sidebar (admin nav is separate)
- Mobile drawer overflow on long role-specific lists
- No loading state while session loads (flash of logged-out state)

**Recommendation:** Improve path matching, add session loading state, handle admin nav role filtering.

---

## 27. Theming
**Status: COMPLETE**  
**Code Quality:** 8/10  
**UX Quality:** 7/10  
**Business Value:** 7/10  

**Explanation:** Comprehensive CSS custom properties design system in `globals.css` with:
- Color tokens (primary, accent, surfaces, text levels, borders)
- Admin design system tokens (sidebar, surface, semantic colors for success/warning/danger/info/premium)
- Shadow tokens (card, card-hover, elevated, button)
- Admin spacing scale
- "Dark section" support with section background classes
- Gradient text utility (via manual styling)
- Tailwind CSS v4 with `@import "tailwindcss"` and `@theme` directive

**Specific Issues:**
- Legacy color variables (`--color-montaj`, `--color-montaj-dark`) kept for compatibility — some components still use old names
- No dark mode toggle despite `ThemeToggle.tsx` component existing
- Some components hardcode colors instead of using CSS variables
- No design-token documentation/source of truth

**Recommendation:** Migrate all legacy color references to new tokens, implement dark mode, create token documentation.

---

## 28. File Uploads
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 6/10  
**Business Value:** 8/10  

**Explanation:** Supabase storage integration via `@supabase/supabase-js`. Upload endpoints: `/api/upload/route.ts` (general), `/api/upload/review/route.ts` (review photos), `/api/user/avatar/route.ts` (avatar), `/api/user/portfolio/route.ts` (portfolio). Profile images stored in ProfileImage model.

**Specific Issues:**
- No file size validation in upload API
- No file type validation beyond what Supabase provides
- No upload progress indication
- No multi-file upload UI for review photos
- Supabase credentials in env — no public bucket configuration verification
- No image optimization/resizing on upload

**Recommendation:** Add file size/type validation, upload progress bar, image resizing on server.

---

## 29. Subscriptions
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 6/10  
**Business Value:** 9/10  

**Explanation:** Premium plans (SubscriptionPlan with badge label, badge color, price, duration, features JSON). SubscriptionPayment model tracks payment history. Profile has `subscriptionId`, `autoRenew`, `premiumUntil` fields. PremiumBadge component. Dashboard/üyelik page with SubscribeButton, CancelSubscription, PaymentHistory, PremiumAnalytics, EmailVerifyBadge. Premium sort priority in search. Premium reminder email template.

**Specific Issues:**
- No real payment processing for subscriptions (same mock payment as general payments)
- PremiumUntil sync between User and Profile models — two sources of truth
- Auto-renew toggle exists but no background job to process renewals
- No plan comparison/feature matrix page
- Free plan vs paid plan pricing not clearly displayed
- Badge styling uses hardcoded "amber" — not connected to plan's `badgeColor`

**Recommendation:** This is blocked on real payment integration. Add cron job for auto-renew, consolidate premiumUntil, build plan comparison page.

---

## 30. Dispute System
**Status: PROTOTYPE**  
**Code Quality:** 5/10  
**UX Quality:** 4/10  
**Business Value:** 7/10  

**Explanation:** Dispute model with jobId, paymentId, reason, resolution options (refund_customer, release_artisan, split_50, split_custom), status tracking (open → resolved), admin notes. Admin disputes page exists. Admin audit log integration.

**Specific Issues:**
- No UI for users to create a dispute (no "report a problem" on jobs)
- No dispute creation API endpoint
- Resolution workflow not connected to actual payment escrow release
- Admin dispute page may be placeholder
- No notification to parties when dispute is created/resolved

**Recommendation:** Build user-facing dispute creation UI on completed jobs, wire resolution to payment system, add notifications.

---

## 31. Certificates
**Status: PROTOTYPE**  
**Code Quality:** 5/10  
**UX Quality:** 4/10  
**Business Value:** 6/10  

**Explanation:** ArtisanSkill model with userId, categoryId, title, yearsExp, certificate URL, verified boolean. Admin certificates page exists. Unique constraint on (userId, categoryId).

**Specific Issues:**
- No certificate upload UI for users
- No certificate verification workflow beyond `verified` boolean
- No display of certificates on profile pages
- Admin page may be placeholder
- No certificate validity/expiry tracking

**Recommendation:** Build certificate upload and display UI, implement verification workflow, add expiry tracking.

---

## 32. Favorites
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 6/10  

**Explanation:** Favorite/unfavorite profile with FavoriteButton component, unique constraint (userId, profileId), Favorite model with createdAt, favorites list in dashboard, API at `/api/favorites/`.

**Specific Issues:**
- No favorite count display on profile cards
- No notification when someone favorites your profile
- No favorite categories/organization

**Recommendation:** Add favorite count to profile cards, add favorite notification.

---

## 33. Reviews
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 9/10  

**Explanation:** Review model with rating, comment, unique constraint (profileId, userId). ReviewSection component on profile pages. Job reviews via JobReview model (separate from profile reviews). Rating average and count stored on Profile model (ratingAvg, reviewCount) — denormalized. Admin review management page. Review API endpoints.

**Specific Issues:**
- Profile `ratingAvg` and `reviewCount` are denormalized — no trigger to auto-update them when reviews change
- No review verification (no proof-of-service check)
- No photo reviews for profile reviews (only for job reviews)
- No review reply functionality

**Recommendation:** Add database trigger or application-level sync for rating aggregates, add review verification.

---

## 34. Audit Logging
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 7/10  

**Explanation:** AdminAuditLog model with adminId, action (create/update/delete/approve/reject/suspend/role_change/premium_change/verify/unverify/resolve/cancel/feature/unfeature), entity (user/profile/job/offer/payment/dispute/certificate/subscription_plan/role_permission/notification/blog_category/category/city_page), entityId, details (JSON), IP. `logAdminAction()` utility in `lib/admin-audit.ts`. Audit logs page in admin.

**Specific Issues:**
- No automatic logging on all admin actions (must be manually called)
- No log viewing with filters by action/entity/date in the audit page (needs verification)
- No log retention policy
- No user-facing activity log

**Recommendation:** Add middleware or wrapper to auto-log admin API calls, add filtering to audit page, add retention policy.

---

## 35. Permissions
**Status: PROTOTYPE**  
**Code Quality:** 5/10  
**UX Quality:** 5/10  
**Business Value:** 7/10  

**Explanation:** RolePermission model with role, feature, enabled. `hasPermission()` function in `lib/permissions.ts` with 8 feature constants (VIEW_PROFILES, SEND_MESSAGE, RECEIVE_MESSAGE, CREATE_COMPANY_PROFILE, LEAVE_REVIEW, ADD_FAVORITE, UPLOAD_PHOTOS, VIEW_CONTACT_INFO, VIEW_DASHBOARD). Admin permissions page at `/admin/izinler/` with PermissionManager component.

**Specific Issues:**
- **`hasPermission()` is not used anywhere in the actual application code** — it exists but no routes/components call it
- Only 8 features defined — too coarse for real RBAC
- `hasPermission()` returns `true` on error or missing record — permissive by default (security anti-pattern)
- No middleware-level permission checking
- No role hierarchy (must define every permission for every role explicitly)
- PermissionManager UI exists but actual enforcement doesn't exist

**Recommendation:** This is the most critical security gap. Wire `hasPermission()` into all admin routes and API endpoints, change default to `false` (deny by default), add middleware checks, expand feature set.

---

## 36. Corporate Page
**Status: COMPLETE**  
**Code Quality:** 7/10  
**UX Quality:** 7/10  
**Business Value:** 6/10  

**Explanation:** Full corporate page at `/kurumsal` with: CorporateHero, CorporateServices, CorporateProcess, CorporateCta. Dynamic metadata with OpenGraph tags. Section-based layout matching the page.tsx component pattern.

**Specific Issues:**
- No contact form on corporate page (no `/iletisim` API)
- No case studies or client logos
- No SLA details or pricing for corporate clients
- CTA links to `/iletisim` which may not be implemented

**Recommendation:** Add contact form, case studies, corporate pricing/SLA information.

---

## 37. Installer Onboarding
**Status: PLACEHOLDER**  
**Code Quality:** 3/10  
**UX Quality:** 2/10  
**Business Value:** 5/10  

**Explanation:** `/ekip-ol` (Join as Team) page exists but immediately redirects to `/auth/kayit` (registration). No dedicated content, no value proposition, no onboarding flow.

**Specific Issues:**
- Just a redirect — no actual onboarding content
- No information about benefits of joining
- No step-by-step guide for new assembler/manufacturer
- Lost opportunity for conversion

**Recommendation:** Build a proper landing page for installer onboarding with benefits, process steps, testimonials, and clear CTA to register.

---

## 38. Loading States
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 6/10  
**UX Quality:** 6/10  
**Business Value:** 6/10  

**Explanation:** Admin loading.tsx uses LoadingSkeleton with variant prop. Search page has its own loading skeleton (SearchLoading page with pulse animation). LoadingSkeleton component exists with variants (likely "page", "table", "card").

**Specific Issues:**
- Many pages lack loading.tsx files (dashboard pages, profile pages)
- No route-level loading for dynamic server components
- LoadingSkeleton has limited variants — only generic "page" variant verified
- No Suspense boundaries for async components

**Recommendation:** Add loading.tsx to all route groups, add Suspense boundaries for data-fetching components, expand skeleton variants.

---

## 39. Error Handling
**Status: PARTIALLY COMPLETE**  
**Code Quality:** 5/10  
**UX Quality:** 5/10  
**Business Value:** 7/10  

**Explanation:** Login/register forms show error messages from server (setMessage pattern). EmptyState component for admin panels. Some API routes have try/catch with error returns.

**Specific Issues:**
- No global error.tsx for route groups
- No error boundaries (React error boundary components)
- API errors are often silently caught with console.error only
- Most client components have minimal error states
- No form-level validation UI (field-level error messages)
- No "something went wrong" fallback UI for crashed components

**Recommendation:** Add error.tsx files, error boundaries, form validation UI, consistent error handling pattern across all components.

---

## 40. Tests
**Status: NOT IMPLEMENTED**  
**Code Quality:** 0/10  
**UX Quality:** 0/10  
**Business Value:** 10/10  

**Explanation:** No test files exist of any kind. No test runner configured in package.json (no jest, vitest, playwright, cypress). No `.test.` or `.spec.` files anywhere in the codebase.

**Specific Issues:**
- Zero test coverage across all 40 feature areas
- No unit tests for utility functions (price-analyzer, permissions, email templates)
- No integration tests for API routes
- No component tests for React components
- No e2e tests for critical flows (registration, search, job creation, payment)
- No CI pipeline enforcing test quality
- Hardcoded mock data (payment, income stats) can't be verified

**Recommendation:** This is the single biggest code quality issue. Add at minimum:
1. Unit tests for `lib/` functions (price-analyzer, permissions, utils, admin-audit)
2. Component tests for key UI (Navbar, CompanyCard, DataTable, SearchForm)
3. API route integration tests for auth, profiles, search, jobs, messages
4. E2E tests for: registration → company creation → job creation → messaging → review

---

## Summary Matrix

| # | Feature | Status | Code | UX | BizVal | Priority |
|---|---------|--------|------|-----|--------|----------|
| 1 | Homepage (v5) | COMPLETE | 7 | 8 | 10 | Low |
| 2 | Authentication | PARTIALLY COMPLETE | 6 | 6 | 10 | High |
| 3 | Search | COMPLETE | 7 | 7 | 10 | Low |
| 4 | Company Profiles | COMPLETE | 7 | 7 | 10 | Medium |
| 5 | Job System | COMPLETE | 7 | 7 | 9 | Medium |
| 6 | Messaging | COMPLETE | 7 | 6 | 8 | Medium |
| 7 | Payments | PROTOTYPE | 5 | 3 | 9 | **CRITICAL** |
| 8 | Dashboard (General) | PARTIALLY COMPLETE | 6 | 6 | 8 | Medium |
| 9 | Dashboard (Firma) | COMPLETE | 7 | 6 | 9 | Medium |
| 10 | Dashboard (Messages) | COMPLETE | 7 | 6 | 7 | Medium |
| 11 | Dashboard (Offers) | PROTOTYPE | 5 | 4 | 8 | High |
| 12 | Admin Panel | PARTIALLY COMPLETE | 7 | 7 | 10 | High |
| 13 | Admin Components | COMPLETE | 8 | 8 | 9 | Low |
| 14 | Blog | COMPLETE | 7 | 7 | 6 | Low |
| 15 | City Pages | PARTIALLY COMPLETE | 6 | 6 | 8 | Medium |
| 16 | PWA | COMPLETE | 7 | 7 | 7 | Low |
| 17 | Push Notifications | PARTIALLY COMPLETE | 6 | 5 | 7 | Medium |
| 18 | Email System | COMPLETE | 7 | 7 | 8 | Low |
| 19 | Analytics | PARTIALLY COMPLETE | 6 | 6 | 8 | Medium |
| 20 | AI Features | PROTOTYPE | 5 | 5 | 7 | Medium |
| 21 | Map Features | COMPLETE | 7 | 7 | 7 | Low |
| 22 | Responsive Design | COMPLETE | 7 | 7 | 8 | Low |
| 23 | SEO | COMPLETE | 8 | 8 | 9 | Low |
| 24 | GDPR/Legal | COMPLETE | 7 | 7 | 9 | Low |
| 25 | Mobile App | PROTOTYPE | 5 | 4 | 7 | High |
| 26 | Navigation | COMPLETE | 7 | 7 | 9 | Low |
| 27 | Theming | COMPLETE | 8 | 7 | 7 | Low |
| 28 | File Uploads | PARTIALLY COMPLETE | 6 | 6 | 8 | Medium |
| 29 | Subscriptions | PARTIALLY COMPLETE | 6 | 6 | 9 | High |
| 30 | Dispute System | PROTOTYPE | 5 | 4 | 7 | Medium |
| 31 | Certificates | PROTOTYPE | 5 | 4 | 6 | Low |
| 32 | Favorites | COMPLETE | 7 | 7 | 6 | Low |
| 33 | Reviews | COMPLETE | 7 | 7 | 9 | Low |
| 34 | Audit Logging | COMPLETE | 7 | 7 | 7 | Low |
| 35 | Permissions | PROTOTYPE | 5 | 5 | 7 | **CRITICAL** |
| 36 | Corporate Page | COMPLETE | 7 | 7 | 6 | Low |
| 37 | Installer Onboarding | PLACEHOLDER | 3 | 2 | 5 | Low |
| 38 | Loading States | PARTIALLY COMPLETE | 6 | 6 | 6 | Medium |
| 39 | Error Handling | PARTIALLY COMPLETE | 5 | 5 | 7 | High |
| 40 | Tests | NOT IMPLEMENTED | 0 | 0 | 10 | **CRITICAL** |

---

## Critical Path (Priority Order)

1. **Payments** (#7) — No real payment processing blocks monetization entirely
2. **Permissions** (#35) — `hasPermission()` not enforced anywhere; no security guard
3. **Tests** (#40) — Zero coverage; every change risks regression
4. **Authentication** (#2) — Hardcoded secret, no rate limiting, no brute-force protection
5. **Admin Panel** (#12) — Needs audit per section for placeholder content
6. **Dashboard (Offers)** (#11) — Core business flow incomplete
7. **Subscriptions** (#29) — Blocked on payments; needs auto-renew cron
8. **Error Handling** (#39) — No error boundaries, no global error pages
9. **Mobile App** (#25) — Shell only, no real functionality
10. **AI Features** (#20) — Mislabeled, vision analyzer needs UI
