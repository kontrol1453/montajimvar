# Rollback Plan — Enterprise Admin Command Center Phase

## Rollback Scope

### Files to Revert
Only one file was modified:
- `src/app/admin/page.tsx` — redirect URL changed

### Files to Remove (if reverting completely)
New files to delete:
- `src/app/admin/kullanicilar/[id]/` (5 files)
- `src/app/admin/firmalar/[id]/` (5 files)
- `src/app/admin/isler/[id]/` (4 files)
- `docs/admin/` (11 files)

## Rollback Procedures

### Option 1: Git Revert (Recommended)
```bash
# Revert the modified file to previous commit
git checkout HEAD~1 -- src/app/admin/page.tsx

# Delete new 360° page directories
Remove-Item -Recurse -Force src/app/admin/kullanicilar/[id]
Remove-Item -Recurse -Force src/app/admin/firmalar/[id]
Remove-Item -Recurse -Force src/app/admin/isler/[id]

# Delete doc files (optional — docs don't affect runtime)
Remove-Item -Recurse -Force docs/admin

# Verify
npx tsc --noEmit
```

### Option 2: Manual Revert
1. Revert `src/app/admin/page.tsx` to:
```typescript
import { redirect } from "next/navigation";
export default function AdminPage() {
  redirect("/admin/audit-logs");
}
```

2. Delete all files in:
   - `src/app/admin/kullanicilar/[id]/`
   - `src/app/admin/firmalar/[id]/`
   - `src/app/admin/isler/[id]/`
   - `docs/admin/`

3. Run `npx tsc --noEmit` to verify clean build

## Impact Assessment

### If reverted:
- User 360°, Company 360°, Job 360° pages will 404
- Admin redirect goes back to audit logs
- All newly generated documents become unavailable
- **No database impact** (no migrations)
- **No API changes** (only new UI pages)

### Side effects
- Links from existing admin pages to `[id]` routes will break
  - Users table row clicks → 404
  - Companies table row clicks → 404
  - Jobs list detail buttons → 404
- These clicks previously had no handler (null/alert), so behavior is not worse than before

## Testing After Rollback
1. Run `npx tsc --noEmit` — must pass
2. Visit `/admin` — redirects to `/admin/audit-logs`
3. Visit `/admin/kullanicilar` — table renders (no row click navigation)
4. Run `npm run build` — must pass
