# API Reference — Montajım Var

> Base URL: `https://test.montajimvar.xyz/api`
> All endpoints require `Content-Type: application/json` unless multipart.

## Authentication

| Method | Header / Cookie |
|---|---|
| Web (NextAuth) | `next-auth.session-token` (HttpOnly, Secure, SameSite=Lax) |
| Mobile | `Authorization: Bearer <access_token>` + `x-refresh-token: <refresh_token>` |

## Error Format

```json
{ "error": "Human-readable message" }
```

| Code | Meaning |
|---|---|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 400 | Validation error (zod) |
| 401 | Unauthorized (missing/invalid session) |
| 403 | Forbidden (role/permission) |
| 404 | Not found |
| 409 | Conflict (unique constraint) |
| 429 | Rate limited |
| 500 | Server error (logged to Sentry) |

---

## Auth Endpoints

### `POST /api/auth/kayit` — Register
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "StrongPass1",
  "role": "CUSTOMER",
  "phone": "+90 532 123 4567",
  "city": "İstanbul"
}
```
Response: `201 { message, user }`

### `POST /api/auth/giris` — Login (NextAuth Credentials)
Handled by `src/lib/auth.ts` → `CredentialsProvider`.

### `POST /api/auth/mobile-login` — Mobile Login
```json
{ "email": "...", "password": "..." }
```
Response: `200 { accessToken, refreshToken, user }`

### `POST /api/auth/refresh` — Refresh Access Token
```json
{ "refreshToken": "..." }
```
Response: `200 { accessToken, refreshToken }`

### `POST /api/auth/sifre-sifirla` — Request Password Reset
```json
{ "email": "user@example.com" }
```
Response: `200 { success: true, message }` (always 200 to prevent enumeration)

### `POST /api/auth/sifre-sifirla/{token}` — Confirm Password Reset
```json
{ "token": "uuid", "password": "NewStrongPass1" }
```

### `POST /api/auth/email-verify/{token}` — Verify Email
GET or POST — activates account.

### `POST /api/auth/google-signup` — Set Google OAuth Role (HMAC-signed cookie)
```json
{ "role": "ASSEMBLER" }
```
Response: sets `google_signup_role` cookie, redirects to Google OAuth.

---

## Public Endpoints

### `GET /api/categories` — List Categories
Response: `200 { data: Category[] }`

### `GET /api/skills` — List Skills
Response: `200 { data: Skill[] }`

### `GET /api/profiles` — List Profiles (paginated)
Query: `page`, `limit`, `city`, `category`, `search`
Response: `200 { data: Profile[], meta: { total, page, limit } }`

### `GET /api/profiles/{id}` — Profile Detail
Response: `200 { data: ProfileWithRelations }`

### `GET /api/jobs` — List Jobs
Query: `page`, `limit`, `category`, `city`, `status`
Response: `200 { data: Job[], meta }`

### `GET /api/jobs/{id}` — Job Detail
Response: `200 { data: JobWithRelations }`

### `GET /api/blog` — Blog Posts
Query: `page`, `limit`, `category`
Response: `200 { data: Post[], meta }`

### `GET /api/blog/{slug}` — Blog Post Detail
Response: `200 { data: Post }`

---

## Protected Endpoints (Auth Required)

### Profile
- `GET /api/user` — Current user profile
- `PUT /api/user` — Update profile
- `POST /api/user/avatar` — Upload avatar (multipart)

### Profile Management
- `POST /api/profiles` — Create profile
- `PUT /api/profiles/{id}` — Update profile
- `POST /api/upload` — Upload profile image (multipart, Supabase)
- `POST /api/upload/review` — Upload review images

### Favorites
- `GET /api/favorites` — List favorites
- `POST /api/favorites` — Add favorite `{ profileId }`
- `DELETE /api/favorites/{id}` — Remove favorite

### Messages
- `GET /api/messages` — List conversations
- `GET /api/messages/{id}` — Conversation detail
- `POST /api/messages` — Send message `{ toUserId, content }`
- `POST /api/messages/read-all` — Mark all read

### Reviews
- `GET /api/reviews` — List (with filters)
- `POST /api/reviews` — Create review `{ targetUserId, jobId, rating, comment }`

### Jobs (Customer)
- `POST /api/jobs` — Create job
- `GET /api/jobs` — My jobs
- `GET /api/jobs/{id}` — Job detail
- `POST /api/jobs/{id}/payment` — Initiate payment (mock)
- `POST /api/jobs/{id}/review` — Review artisan

### Jobs (Artisan)
- `GET /api/offers` — My offers
- `POST /api/offers` — Submit offer `{ jobId, price, message, estimatedDays }`
- `PUT /api/offers/{id}` — Update offer
- `GET /api/jobs/{id}/detail` — Job detail for artisan

---

## Admin Endpoints (ADMIN Role Required)

All under `/api/admin/*` — middleware enforces `roles.includes("ADMIN")`.

### Users
- `GET /api/admin/users` — Paginated list
- `GET /api/admin/users/{id}/detail` — Full detail
- `PUT /api/admin/users/{id}/roles` — Change roles `{ roles: string[] }`
- `PUT /api/admin/users/{id}/premium` — Toggle premium

### Companies
- `GET /api/admin/profiles` — List
- `GET /api/admin/profiles/{id}/detail` — Detail

### Jobs
- `GET /api/admin/jobs` — List
- `GET /api/admin/jobs/{id}/detail` — Detail

### Disputes
- `GET /api/admin/disputes` — List
- `GET /api/admin/disputes/{id}` — Detail
- `PUT /api/admin/disputes/{id}` — Resolve

### Categories / Skills
- `GET/POST /api/admin/categories`
- `GET/POST /api/admin/skills`
- `PUT /api/admin/skills/{id}/verify`

### Blog
- `GET/POST /api/admin/blog-categories`
- `GET/POST /api/admin/blog` (posts)

### City Pages
- `GET/POST /api/admin/city-pages`
- `GET/PUT /api/admin/city-pages/{id}`

### Permissions
- `GET /api/admin/permissions` — Matrix
- `PUT /api/admin/permissions` — Update `{ role, feature, enabled }`

### Notifications
- `GET /api/admin/notifications`
- `PUT /api/admin/notifications/{id}/read`

### Export / Analytics
- `GET /api/admin/export` — CSV/Excel
- `GET /api/admin/summary` — Dashboard stats
- `GET /api/admin/search` — Global search

### Audit
- `GET /api/admin/audit-logs` — Paginated

---

## Webhooks / Callbacks

- `GET/POST /api/auth/[...nextauth]` — NextAuth internal
- `POST /api/auth/email-verify/{token}` — Email verification
- `GET /api/auth/email-verify/{token}` — Email verification link

---

## Rate Limits (Middleware)

| Endpoint Group | Limit |
|---|---|
| Auth (`/api/auth/giris`, `kayit`, `sifre-sifirla`, `mobile-login`, `refresh`) | 10 req/min/IP |
| Protected API (`/api/favorites`, `messages`, `reviews`, `upload`) | 100 req/min/IP |

Headers on response:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1752698123
Retry-After: 47
```

---

## Versioning
Current: `v0` (no URL prefix). Breaking changes → new version + migration guide.

---

*Generated: 2026-07-17 • OpenAPI spec: P2*