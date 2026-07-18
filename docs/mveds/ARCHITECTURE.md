# Architecture — Montajım Var

## 1. High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS (Browser)                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  REVERSE PROXY (nginx on Pi)                    │
│  SSL termination • Rate limit (backup) • Static cache          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16 (PM2, Port 3000)                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐  │
│  │ App Router  │ │ API Routes  │ │ Middleware  │ │ RSC       │  │
│  │ (Pages)     │ │ (REST)      │ │ (Auth/RL)   │ │ (Components)│
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  PostgreSQL   │     │   Supabase    │     │   External    │
│   (Neon)      │     │   Storage     │     │   Services    │
│  Prisma ORM   │     │  (Images)     │     │  Sentry,      │
│  9 migrations │     │  Signed URLs  │     │  SMTP, Push,  │
│  TLS required │     │  15min TTL    │     │  Gemini AI    │
└───────────────┘     └───────────────┘     └───────────────┘
```

## 2. Component Architecture

### Frontend (Next.js App Router)

| Layer | Pattern |
|---|---|
| **Server Components** | Default — data fetching, auth checks, SEO |
| **Client Components** | `use client` — interactivity, forms, motion |
| **Route Handlers** | `route.ts` — REST API, webhooks |
| **Middleware** | `middleware.ts` — auth guard, rate limit, headers |

### State Management
- **Server state**: Prisma queries in RSC, SWR not needed
- **Client state**: React `useState` / `useReducer` (minimal)
- **Form state**: React Hook Form + zod resolver
- **Auth state**: NextAuth `useSession` / `auth()`

### Design System
```
src/components/ui/
├── primitives (Button, Input, Card, Badge, Typography)
├── forms (FormField, Select, Textarea, DatePicker)
├── layout (Container, Grid, Stack, Divider)
├── feedback (Toast via sonner, Skeleton, Alert)
├── navigation (Navbar, MobileBottomNav, Breadcrumbs)
└── data-display (Table, Avatar, Image, Prose)
```
- **Tokens**: CSS variables (`--color-*`, `--space-*`, `--radius-*`)
- **Typography**: Inter (body) + Manrope (display)
- **Dark mode**: Not implemented (P2)

## 3. Backend Architecture

### API Design
- **RESTful** — `GET/POST/PUT/PATCH/DELETE` on `/api/*`
- **Response envelope**: `{ data: T } | { error: string }`
- **Status codes**: 200/201/400/401/403/404/409/429/500
- **Validation**: zod schemas in `src/lib/validation.ts`
- **Auth**: `auth()` from `src/lib/auth.ts` (NextAuth)
- **Authorization**: `roles.includes("ADMIN")` + `hasPermission(role, feature)`

### Database (Prisma + Neon)

| Model | Purpose |
|---|---|
| `User` | Core identity, roles, tokenVersion |
| `Profile` | Company profile (CUSTOMER/ASSEMBLER/MANUFACTURER) |
| `Job` | Work requests |
| `Offer` | Artisan bids on jobs |
| `Review` | Ratings + comments |
| `Message` | Chat between users |
| `Dispute` | Escalation flow |
| `Certificate` | Artisan certifications |
| `PushSubscription` | Web Push |
| `AdminAuditLog` | Admin actions (P2 expand) |

### Security Primitives
| Primitive | Implementation |
|---|---|
| Password hash | bcryptjs (12 rounds) |
| JWT signing | HS256, `NEXTAUTH_SECRET` |
| Token invalidation | `tokenVersion` on User |
| Rate limit | In-memory Map (middleware) |
| HTML sanitize | DOMPurify (isomorphic-dompurify) |
| JSON-LD escape | Unicode escape `<>&` |
| Cookie signing | HMAC-SHA256 (`NEXTAUTH_SECRET`) |

## 4. Infrastructure

| Component | Current | Target |
|---|---|---|
| **Compute** | Raspberry Pi 4 (4GB) | 2x Pi behind Nginx LB |
| **OS** | Raspberry Pi OS 64-bit | Same |
| **Process Manager** | PM2 | PM2 + systemd |
| **Reverse Proxy** | nginx (SSL, cache, rate limit backup) | Same |
| **Database** | Neon (serverless Postgres) | Same + read replica |
| **Storage** | Supabase (images bucket) | Same + CDN |
| **Email** | SMTP (configurable) | Same |
| **Monitoring** | Sentry + Vercel Analytics + Clarity | + Grafana + UptimeRobot |

## 5. Data Flow Examples

### Job Creation → Offer → Completion
```
Customer (RSC) → POST /api/jobs → Prisma create Job
    ↓
Artisan dashboard (RSC) → GET /api/jobs → list
    ↓
Artisan → POST /api/offers → Prisma create Offer
    ↓
Customer → GET /api/offers → accept → Job.status = ASSIGNED
    ↓
Completion → POST /api/jobs/[id]/complete → Payment flow (mock)
    ↓
Review → POST /api/reviews → Prisma create Review
```

### Auth Flow (Credentials)
```
POST /api/auth/[...nextauth] (credentials)
    ↓
CredentialsProvider.authorize()
    ↓
prisma.user.findUnique(email)
    ↓
bcrypt.compare(password, hash)
    ↓
tokenVersion check
    ↓
JWT callback → token (id, roles, tokenVersion, loginAt)
    ↓
Session callback → session.user
```

## 6. Non-Functional Requirements

| NFR | Current | Target |
|---|---|---|
| Availability | 99.5% (single Pi) | 99.9% (HA) |
| LCP | 2.1s | ≤2.5s |
| API p95 | ~1.2s | ≤2s |
| Build time | 39s | ≤60s |
| Deploy time | 3 min | ≤2 min |
| RTO | 1 hour | 15 min |
| RPO | 24 hours | 1 hour |

---

*Generated: 2026-07-17 • Architecture version 1.0*