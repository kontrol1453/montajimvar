# Audit Log Specification

## Current State
- `AdminAuditLog` Prisma model with id, adminId, action, entity, entityId, details (JSON string), ip, createdAt
- `logAdminAction()` utility in `lib/admin-audit.ts`
- Audit logs page at `/admin/audit-logs` with pagination, search, and action/entity filter
- 17 action types, 13 entity types

## Proposed Enhancements

### 1. Audit Log Detail Page
- **Route**: `/admin/audit-logs/[id]`
- **Content**:
  - Full details with pretty-printed JSON diff
  - Before/after comparison (from details field)
  - IP geolocation (if available)
  - Admin info with link to admin profile
  - Entity link (clickable link to the affected entity 360° page)
  - Raw JSON view toggle
  - Share link button

### 2. Advanced Filtering
- **Date range picker**: Start date → End date with quick presets (Today, Last 7d, Last 30d, This Month)
- **Admin filter**: Filter by specific admin user (dropdown populated from DB)
- **Entity ID search**: Direct lookup by entity ID + entity type
- **Compound filter**: Multiple action + entity combinations saved as presets

### 3. Enhanced Logging
- Add `userAgent` field to AdminAuditLog model
- Add `diff` field (structured before/after JSON diff)
- Add `sessionId` field for session tracking
- New action types:
  - `login` — Admin login event
  - `login_failed` — Failed login attempt
  - `export` — Data export event
  - `settings_change` — System setting change
  - `bulk_operation` — Bulk action (delete users, etc.)

### 4. Audit Summary Dashboard
- **Top actions**: Bar chart of most common actions today/this week
- **Admin activity**: Heatmap of admin actions by hour/day
- **Entity breakdown**: Pie chart of affected entity types
- **Anomaly detection**: Flag unusual patterns (same admin doing many deletes, off-hours activity)

### 5. Retention & Export
- **Auto-archive**: Move logs older than 90 days to cold storage (JSON export)
- **Auto-purge**: Delete logs older than 365 days (configurable)
- **Bulk export**: Download filtered logs as CSV
- **Scheduled reports**: Daily/weekly audit digest email to ROOT_ADMIN

## Data Model Migration

```prisma
model AdminAuditLog {
  id          Int      @id @default(autoincrement())
  adminId     Int
  action      String
  entity      String
  entityId    Int
  details     String?  // JSON
  diff        String?  // NEW: structured before/after JSON diff
  ip          String?
  userAgent   String?  // NEW: browser user agent
  sessionId   String?  // NEW: session identifier
  createdAt   DateTime @default(now())

  @@index([adminId])
  @@index([entity, entityId])
  @@index([createdAt])
  @@index([action, entity])
}
```

## API Enhancements

```
GET  /api/admin/audit-logs
  ?page=1
  &limit=50
  &search=...
  &action=create|update|delete|...
  &entity=user|profile|job|...
  &entityId=123
  &adminId=5
  &from=ISO_DATE
  &to=ISO_DATE
  &sort=createdAt:desc

GET  /api/admin/audit-logs/stats       — Summary statistics
GET  /api/admin/audit-logs/:id         — Single log detail
GET  /api/admin/audit-logs/export      — Filtered CSV export
```

## Implementation Priority

### P1 — Implement Now
- Audit log detail page (`/admin/audit-logs/[id]`)
- Date range filter on list page
- Admin filter dropdown on list page
- Enhanced details display (pretty-printed JSON)

### P2 — Future
- diff field and structured before/after comparison
- Audit summary dashboard with charts
- Export/retention features
- Anomaly detection
- User agent + session tracking
