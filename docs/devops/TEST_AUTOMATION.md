# Test Automation Strategy — Montajım Var

## 1. Test Pyramid

```
         /\
        /UI\         ← E2E (Playwright) - P2
       /----\
      /Int.  \       ← Integration (API) - P2
     /--------\
    /  Unit     \     ← Unit (Vitest) - ACTIVE
   /____________\
```

## 2. Framework

- **Vitest** — unit + integration
- **@testing-library/react** — component rendering
- **Playwright** (P2) — E2E browser tests
- **@vitest/coverage-v8** — coverage

## 3. Coverage Targets

| Module | Current | Target |
|---|---|---|
| `src/lib/validation.ts` | 100% | 100% |
| `src/lib/sanitize.ts` | 95% | 100% |
| `src/lib/auth.ts` | 0% | 80% (P2 — needs DB mock) |
| `src/lib/permissions.ts` | 0% | 80% |
| `src/lib/cookie-sign.ts` | 0% | 90% |
| `src/lib/payment.ts` | 0% | 80% |
| API routes | 0% | 60% |
| Components | 0% | 40% |
- **Overall** | ~5% | **60%** |

## 4. Test Categories

### 4.1 Authentication (✅ Done in this sprint)
- `tests/unit/auth-validation.test.ts` (13 tests)
  - registerSchema valid/invalid
  - loginSchema valid/invalid
  - emailSchema
  - passwordResetSchema

### 4.2 Authorization (P2)
- `hasPermission` fail-closed behavior
- Middleware `getToken` + role check
- Resource ownership (`profile.userId !== userId`)

### 4.3 Marketplace (P2)
- Job creation flow
- Offer acceptance
- Review submission

### 4.4 CRM (P2)
- Customer CRUD
- Timeline event log

### 4.5 AI (P2)
- Vision analyzer MIME check
- Sanitization of AI responses

### 4.6 Admin (P2)
- Admin route access (403 for non-admin)
- Bulk actions
- Export endpoints

### 4.7 API (P2)
- Rate limit behavior
- zod validation on all endpoints
- Error response shape

### 4.8 Forms (P2)
- Field validation messages
- Submit + error states
- Disabled states

### 4.9 Responsive UI (P2)
- Playwright + multiple viewport

### 4.10 Accessibility (P2)
- axe-core automated scan
- Keyboard navigation
- ARIA correctness

### 4.11 Critical Business Workflows (P2)
- Login → Dashboard → Job → Offer → Message → Payment → Review
- Admin: ban user → restore
- Profile: create → update → upload logo → publish

## 5. CI Integration

```yaml
- name: Unit tests
  run: npm run test:unit -- --reporter=verbose

- name: Coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v4
```

## 6. Test Commands

| Cmd | Use |
|---|---|
| `npm run test` | Run all tests once |
| `npm run test:unit` | Same |
| `npm run test:watch` | Watch mode (dev) |
| `npm run test:coverage` | Coverage report |
| `npx vitest tests/unit/sanitization.test.ts` | Single file |

## 7. Coverage Report

`coverage/index.html` (gitignored) — aç, dosya bazında coverage gör.

## 8. P2 E2E with Playwright

```bash
npm install -D @playwright/test
npx playwright install --with-deps
```

```typescript
// tests/e2e/auth.spec.ts
test('login flow', async ({ page }) => {
  await page.goto('/auth/giris');
  await page.fill('input[type=email]', 'test@test.com');
  await page.fill('input[type=password]', 'wrong');
  await page.click('button[type=submit]');
  await expect(page.locator('text=Hatalı')).toBeVisible();
});
```
