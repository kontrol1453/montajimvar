# Role & Permission Matrix — Redesign

## Current State
- 8 feature keys in `lib/permissions.ts`
- 4 roles: CUSTOMER, ASSEMBLER, MANUFACTURER, ADMIN
- Permissions managed via `RolePermission` Prisma model
- Permission UI in `/admin/izinler` with grid toggles

## Proposed RBAC Redesign

### Role Hierarchy

```
ROOT_ADMIN          (full system access, can manage other admins)
├── SUPER_ADMIN     (all admin capabilities)
├── ADMIN           (standard admin — current default)
├── MODERATOR       (content moderation only)
├── SUPPORT         (customer support — disputes, users, jobs)
└── FINANCE         (financial operations — payments, invoices, refunds)
```

### Frontend Roles (unchanged from current system)
```
CUSTOMER            (end customer posting jobs)
ASSEMBLER           (montajcı — handyman/installer)
MANUFACTURER        (üretici — manufacturer)
```

### Admin Feature Keys (NEW)

| Feature Key | Description | Root | Super | Admin | Mod | Support | Finance |
|---|---|---|---|---|---|---|---|
| `admin_dashboard` | View command center | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `admin_users_view` | View user list | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| `admin_users_manage` | Create/edit/delete users | ✓ | ✓ | ✓ | — | ✓ | — |
| `admin_users_roles` | Change user roles | ✓ | ✓ | — | — | — | — |
| `admin_profiles_view` | View company profiles | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `admin_profiles_manage` | Verify/feature/edit profiles | ✓ | ✓ | ✓ | ✓ | — | — |
| `admin_jobs_view` | View all jobs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `admin_jobs_manage` | Cancel/delete/modify jobs | ✓ | ✓ | ✓ | — | ✓ | — |
| `admin_disputes_view` | View disputes | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| `admin_disputes_manage` | Resolve disputes | ✓ | ✓ | ✓ | — | ✓ | — |
| `admin_disputes_finance` | Process dispute refunds | ✓ | ✓ | — | — | — | ✓ |
| `admin_payments_view` | View payment history | ✓ | ✓ | ✓ | — | — | ✓ |
| `admin_payments_manage` | Process refunds/cancellations | ✓ | ✓ | — | — | — | ✓ |
| `admin_subscriptions` | Manage subscription plans | ✓ | ✓ | ✓ | — | — | ✓ |
| `admin_certificates` | Verify artisan certificates | ✓ | ✓ | ✓ | ✓ | — | — |
| `admin_categories` | Manage service categories | ✓ | ✓ | ✓ | ✓ | — | — |
| `admin_blog` | Manage blog posts | ✓ | ✓ | ✓ | ✓ | — | — |
| `admin_city_pages` | Manage city landing pages | ✓ | ✓ | ✓ | ✓ | — | — |
| `admin_notifications` | Send push notifications | ✓ | ✓ | ✓ | — | ✓ | — |
| `admin_permissions` | Manage role permissions | ✓ | ✓ | — | — | — | — |
| `admin_audit_logs` | View audit logs | ✓ | ✓ | ✓ | — | — | ✓ |
| `admin_security` | Security center access | ✓ | ✓ | — | — | — | — |
| `admin_reports` | View reports & analytics | ✓ | ✓ | ✓ | — | — | ✓ |
| `admin_settings` | System settings | ✓ | ✓ | — | — | — | — |
| `admin_moderation` | Content moderation | ✓ | ✓ | — | ✓ | — | — |
| `admin_support` | Support ticket management | ✓ | ✓ | — | — | ✓ | — |
| `admin_export` | Data export | ✓ | ✓ | ✓ | — | ✓ | ✓ |

### Migration Plan

1. Add new feature keys to `FEATURES` constant in `lib/permissions.ts`
2. Create migration script to insert default permissions for all 5 admin roles
3. Update permission UI to show admin roles with filtering
4. Add middleware-level permission checks using a new `requireAdminPermission()` helper
5. Seed default permissions on first deploy

### Implementation Details

```typescript
// New helper in lib/permissions.ts
export async function requireAdminPermission(
  session: Session | null,
  feature: string
): Promise<boolean> {
  const user = session?.user as { roles?: string[] } | undefined;
  if (!user) return false;
  if (user.roles?.includes("ROOT_ADMIN")) return true; // Root bypass
  // Check if user has any admin role with this permission
  const adminRoles = user.roles?.filter(r => 
    ["ROOT_ADMIN", "SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "FINANCE"].includes(r)
  ) ?? [];
  if (adminRoles.length === 0) return false;
  for (const role of adminRoles) {
    const perm = await prisma.rolePermission.findUnique({
      where: { role_feature: { role, feature } },
    });
    if (perm?.enabled) return true;
  }
  return false;
}
```

### Permission Check Middleware

All admin API routes should wrap sensitive operations with:
```typescript
if (!await requireAdminPermission(session, 'admin_users_manage')) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```
