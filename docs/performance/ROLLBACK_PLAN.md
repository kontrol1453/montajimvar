# Rollback Plan — SEO, Performance & Production Optimization

## Rollback Triggers
- Build fails on production
- SEO scores drop below baseline
- Security headers block legitimate requests
- Font rendering breaks on any browser
- ISR causes stale content on critical pages

## Rollback Procedure

### Option A: Git Revert (Recommended)
```bash
git revert HEAD --no-commit
```
Then selectively revert:
- `src/app/layout.tsx` — font migration + metadata changes
- `next.config.js` — security headers + cache headers
- Any `page.tsx` files with new metadata

### Option B: Manual Fixes by File

#### 1. Font render blocking
Restore `<link>` font approach in layout.tsx — delete `next/font` imports and add `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap">` in `<head>`.

#### 2. Security headers blocking requests
In next.config.js, comment out the Content-Security-Policy header line:
```js
// { key: "Content-Security-Policy", value: csp },
```
Deploy to preview, test functionality, then tighten CSP.

#### 3. Cache-Control breaking development
Remove `/_next/image(.*)` cache header override:
```js
// Remove this block:
// {
//   source: "/_next/image(.*)",
//   headers: [{ key: "Cache-Control", value: "..." }],
// },
```

#### 4. ISR issues
Remove `export const revalidate = 86400;` from any page showing stale content, reverting to dynamic rendering.

### Verification After Rollback
- [ ] Build succeeds
- [ ] All pages render (check top 20 routes)
- [ ] No CSP errors in browser console
- [ ] Fonts load correctly
- [ ] Images load correctly
- [ ] Auth flows (login, register) work
- [ ] API routes respond with expected data
