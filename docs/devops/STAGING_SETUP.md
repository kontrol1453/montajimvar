# Staging Setup — Montajım Var

## 1. Purpose

Staging ortamı, production'a çıkmadan önce TAM test için kullanılır. Tüm değişiklikler staging'i geçmeden production'a gidemez.

## 2. Current State

| Aspect | Production | Staging |
|---|---|---|
| URL | test.montajimvar.xyz | **YOK** |
| DB | Neon prod | **YOK** |
| Storage | Supabase prod | **YOK** |
| Secrets | `.env` (prod) | **YOK** |

**Bu sprint sonunda hedef**: Sembolik staging ortamı (test verisi) "yok", ama deploy script'i stage ortamı için hazır olacak. Gerçek staging env P2 backlog'da.

## 3. Staging Hedef Mimari (P2)

```
staging.montajimvar.xyz
  ↓
  Pi (ikinci cihaz veya port 3001)
  ↓
  Neon staging branch database
  ↓
  Supabase staging project
  ↓
  Separate SMTP (test inbox)
```

### 3.1 Neon Branch Database

Neon "branching" feature:
```bash
# Create branch
neonctl branches create --name staging --parent main

# staging DATABASE_URL = branch connection
```

### 3.2 Supabase Staging Project

Yeni project:
- `https://staging-xyz.supabase.co`
- Aynı bucket name `images` ama ayrı storage
- Test kullanicilar + test görselleri

### 3.3 SMTP

- **Eğitim/test SMTP**: Mailtrap, Resend sandbox, veya Ethereal
- SMTP creds `.env.staging`

## 4. Seed Data

`prisma/seed-staging.ts` (P2):

- 5 CUSTOMER + 5 ASSEMBLER + 2 MANUFACTURER + 1 ADMIN
- 3 category + 10 profile + 5 job + 20 review
- Tüm test verileri `*@test.montajimvar.xyz` emails

## 5. Rollback Capability

Staging hep geri alınabilir:
```bash
# DB
neonctl branches reset staging --parent main

# Storage
supabase storage empty --bucket images

# Re-seed
npm run seed:staging
```

## 6. CI/CD Hooks

```
PR merge → develop → staging otomatik deploy
QA sign-off → PR release/* → production
```

## 7. Smoke Protocol

Her staging deploy sonrası:
- [ ] Homepage yüklenir
- [ ] Login çalışır (test user)
- [ ] Job oluşturma akışı tam
- [ ] Mesaj gönderme
- [ ] Admin panel erişim
- [ ] File upload
- [ ] Sentry'de yeni hata yok
