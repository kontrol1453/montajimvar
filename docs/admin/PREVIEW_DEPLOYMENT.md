# Preview Deployment Guide

## Deployment Steps

### 1. Create Feature Branch
```bash
git checkout -b feat/admin-command-center
```

### 2. Verify Build
```bash
npm run build
```

### 3. Deploy to Vercel Preview
```bash
npx vercel deploy --preview
```

### 4. Verify Preview URL
After deployment, Vercel returns a preview URL (e.g., `https://montajimvar-git-feat-admin-command-center.vercel.app`)

### 5. Run QA Checklist on Preview
- [ ] Visit `/admin/komuta-merkezi` — Dashboard loads with data
- [ ] Visit `/admin/kullanicilar` — User table renders
- [ ] Click a user row → `/admin/kullanicilar/[id]` — 360° detail page loads
- [ ] Visit `/admin/firmalar` — Company table renders
- [ ] Click a company row → `/admin/firmalar/[id]` — 360° detail page loads
- [ ] Visit `/admin/isler` — Job list renders
- [ ] Click a job detail button → `/admin/isler/[id]` — 360° detail page loads
- [ ] Visit `/admin` — Redirects to `/admin/komuta-merkezi`
- [ ] Visit `/admin/audit-logs` — Audit log page renders with search/filter

### 6. Return Preview URL
Share the preview URL for user validation before merging.

## Rollback (if needed)
```bash
git checkout main
git branch -D feat/admin-command-center
npx vercel deploy --prod
```

## Preview URL
(Returned after deployment)
