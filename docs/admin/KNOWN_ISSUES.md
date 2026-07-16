# Known Issues — Enterprise Admin Command Center Phase

## Unresolved Issues (P2+)

### 1. Missing 360° Sub-Pages
Several entity pages referenced in navigation don't have detail views yet:
- `/admin/yorumlar/[id]` — Review detail page
- `/admin/anlasmazliklar/[id]` — Dispute detail page (list page has resolution dropdown)
- `/admin/abonelik-plani/[id]` — Subscription plan detail
- `/admin/blog/[id]` — Blog post detail/edit page

### 2. No Audit Log Detail Page
- The enhanced audit log spec includes a detail page at `/admin/audit-logs/[id]`
- Currently the table has no drill-down capability
- JSON details are shown as truncated text

### 3. No Report Center Implementation
- The REPORTING_SPEC.md defines a full `/admin/reports` page structure
- No chart library (recharts) has been added to package.json
- No report API endpoints have been created

### 4. No System Settings Implementation
- The SYSTEM_SETTINGS_SPEC.md defines `/admin/ayarlar` with 7 categories
- No `SystemSetting` Prisma model migration exists
- No settings API endpoints

### 5. RBAC Enhancement Not Implemented
- The ROLE_PERMISSION_MATRIX.md defines 5 admin roles and 27 feature keys
- Current system still uses single ADMIN role with 8 permissions
- No migration script for new role seeds

### 6. Company Jobs Section Scope
- Company jobs section finds jobs via offers (artisanId) not direct assignment
- The Job model has no `assignedArtisanId` field in the schema
- This is correct behavior based on current schema

### 7. No Edit/Delete Actions on 360° Pages
- User, company, and job detail pages are read-only views
- Edit forms, delete buttons, and status change actions are not included
- These can be added in a future sprint

## Non-Issues (By Design)
- Admin redirect changed from `/admin/audit-logs` to `/admin/komuta-merkezi` (intentional)
- All 360° pages use `force-dynamic` (no revalidation needed for admin data)
- No client-side state management in detail pages (all server-rendered)
