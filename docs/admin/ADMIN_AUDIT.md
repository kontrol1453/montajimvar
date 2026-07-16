# Admin Panel Architecture Audit

## Overview
Full audit of the existing MontajımVar admin panel covering pages, API routes, components, utilities, and database models.

## Existing Pages (17 total)

### Command Center (`/admin/komuta-merkezi`)
- **Components**: CommandHeader, AttentionCenter, PlatformPulse, MarketplaceHealth, OperationsCenter, FinancialOverview, RecentActivity, QuickActions
- **Data**: Server-side aggregate query with 15+ parallel Prisma calls
- **Status**: Feature-complete, functional dashboard

### Audit Logs (`/admin/audit-logs`)
- **Features**: Paginated table, search, action filter, entity filter
- **Actions**: 17 action types, 13 entity types
- **Status**: Functional, no drill-down detail page

### Users (`/admin/kullanicilar`)
- **Features**: Server table, selectable rows, bulk actions (delete, premium), CSV export
- **Components**: UsersTableClient, CreateUserForm, UserActions
- **Missing**: No `/admin/kullanicilar/[id]` detail page

### Companies (`/admin/firmalar`)
- **Features**: Server table, verify/feature/category/delete actions, CSV export
- **Components**: VerifyButton, FeaturedButton, CategoryEditor, DeleteProfileButton
- **Missing**: No `/admin/firmalar/[id]` detail page

### Jobs (`/admin/isler`)
- **Features**: Client-side paginated list, status filter, search, cancel/delete dialogs
- **Missing**: No `/admin/isler/[id]` detail page

### Disputes (`/admin/anlasmazliklar`)
- **Features**: Client table with resolution dropdown, CSV export
- **Resolution options**: refund_customer, release_artisan, split_50

### Certificates (`/admin/sertifikalar`)
- **Features**: Client table with verify/unverify toggle, filter, CSV export

### Subscriptions (`/admin/abonelik-plani`)
- **Features**: PlanManager component with CRUD

### Permissions (`/admin/izinler`)
- **Features**: PermissionManager grid (3 roles × 8 features)

### Other Pages
- CRM (`/admin/crm`) - CrmDashboard stats
- Notifications (`/admin/bildirim`)
- Blog (`/admin/blog`)
- Categories (`/admin/kategoriler`) - CategoryManager
- City Pages (`/admin/sehir-sayfalari`)
- Google Firma Ekle (`/admin/google-firma-ekle`)
- Reviews (`/admin/yorumlar`)

## Existing API Routes (17 routes)

| Route | Method(s) | Purpose |
|-------|-----------|---------|
| `/api/admin/audit-logs` | GET | Paginated audit logs |
| `/api/admin/summary` | GET | Platform metrics JSON |
| `/api/admin/users` | POST, DELETE | Create/delete user |
| `/api/admin/profiles` | PATCH, DELETE | Update/delete profile |
| `/api/admin/export` | GET | CSV export (8 types) |
| `/api/admin/search` | GET | Global search |
| `/api/admin/disputes` | GET, PATCH | Dispute CRUD |
| `/api/admin/permissions` | GET, POST | RBAC permissions |
| `/api/admin/subscription-plans` | GET, POST, DELETE | Plan management |
| `/api/admin/skills` | GET | Skill/certificate listing |
| `/api/admin/notifications` | GET, POST | Notification management |
| `/api/admin/send-push` | POST | Push notifications |
| `/api/admin/blog-categories` | GET | Blog categories |
| `/api/admin/categories` | GET, POST | Service categories |
| `/api/admin/city-pages` | GET, POST | City page management |
| `/api/admin/firma-bilgi-getir` | GET | Company info lookup |
| `/api/admin/google-firma-kaydet` | POST | Google Business save |

## Admin Components (16 components)

### Layout
- `AdminShell` - Main wrapper (collapsible sidebar, search/shortcuts modals, keyboard shortcuts)
- `AdminSidebar` - Desktop sidebar (collapsed/expanded/drawer variants)
- `MobileSidebarDrawer` - Mobile drawer
- `SidebarToggle` - Collapse toggle + mobile trigger
- `AdminHeader` - Header with user menu, search, notification bell, breadcrumb
- `Breadcrumb` - Auto-generated from path + nav config
- `NotificationBell` - Inline SVG bell icon

### Data Display
- `AdminTable` - Generic table with selection, column visibility, bulk actions, sticky actions column
- `AdminToolbar` - Search input component
- `RowActionsDropdown` - Dropdown action menu
- `StatCard` - Metric display card
- `DataCard` - Data display card
- `EmptyState` - Empty state with icon + message
- `LoadingSkeleton` - Loading skeleton (metric/card/list/page variants)

### Utilities
- `Dialog` - Modal dialog with configurable actions
- `SectionContainer` - Wrapper with error boundary + skeleton
- `SectionErrorBoundary` - Error boundary per section
- `CopyButton` - Clipboard copy
- `PageHeader` - Page header component
- `Pagination` - Reusable pagination

### Entity Components
- `EntityHeader`, `EntityLink`, `EntityStatus`, `EntityTabs`

### Modals
- `AdminSearchModal` - Global search (users/profiles/jobs)
- `ShortcutsModal` - Keyboard shortcuts reference

## Key Libraries

### `lib/admin-audit.ts`
- `logAdminAction()` - Database audit log creation
- `extractAdminId()` - Session ID extraction
- 17 action types: create, update, delete, approve, reject, suspend, role_change, premium_change, verify, unverify, resolve, cancel, feature, unfeature
- 13 entity types: user, profile, job, offer, payment, dispute, certificate, subscription_plan, role_permission, notification, blog_category, category, city_page

### `lib/admin-nav.ts`
- 6 navigation groups: General, Management, Yönetim 360°, Content, Operations, System
- 18 nav items total
- `findItemByPath()`, `findGroupByPath()`, `buildBreadcrumb()`

### `lib/permissions.ts`
- `hasPermission()` - Async DB check with default-true fallback
- 8 feature keys: view_profiles, send_message, receive_message, create_company_profile, leave_review, add_favorite, upload_photos, view_contact_info, view_dashboard

## Database Models

### AdminAuditLog (519)
- Fields: id, adminId, action, entity, entityId, details (JSON), ip, createdAt
- Indexes: adminId, [entity, entityId], createdAt

### RolePermission (261)
- Fields: id, role, feature, enabled, createdAt, updatedAt
- Unique: [role, feature]

### Notification (251)
- Fields: id, type, title, message, link, isRead, createdAt

## Critical Issues Found (Priority Order)

### P0 — Missing Detail/360° Pages
1. **No User 360° page** — `/admin/kullanicilar/[id]` route doesn't exist
2. **No Company 360° page** — `/admin/firmalar/[id]` route doesn't exist
3. **No Job 360° page** — `/admin/isler/[id]` route doesn't exist
4. **No audit log detail page** — can't inspect individual log entries

### P1 — Missing Feature Sections
5. **No Report Center** — no visual reports, charts, exports beyond raw CSV
6. **No System Settings page** — no unified settings, just standalone perm/sub pages
7. **No Security Center** — no IP tracking, failed login monitoring, session management
8. **No Moderation Center** — no centralized review/comment/content moderation

### P2 — Enhancement Opportunities
9. **Admin redirect** — currently goes to `/admin/audit-logs`, should go to `/admin/komuta-merkezi`
10. **No admin profile page** — admin can't manage own profile or 2FA
11. **No help/documentation center** — no admin onboarding or help documentation
12. **Missing operation history** — no undo/rollback capability for admin actions

## Recommendations

### Sprint 1 — Foundation (P0)
- Build User 360°, Company 360°, Job 360° detail pages
- Add audit log detail view with JSON pretty-print
- Fix admin redirect to command center

### Sprint 2 — Enterprise Features (P1)
- Build Report Center with chart visualizations
- Build System Settings page
- Build Security Center
- Build Moderation Center

### Sprint 3 — Enhancement (P2)
- Admin profile management + 2FA
- Help/documentation center
- Operation history with undo
- Performance: add indexes, pagination improvements
