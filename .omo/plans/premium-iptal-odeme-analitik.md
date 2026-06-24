# Premium Ãœyelik GeliÅŸtirmeleri (Ä°ptal + Ã–deme GeÃ§miÅŸi + Analitik)

## TL;DR
> **Summary**: Abonelik iptali, Ã¶deme geÃ§miÅŸi tablosu ve premium firma analitiklerini ekle
> **Deliverables**: Schema deÄŸiÅŸikliÄŸi + 2 API endpoint + 3 UI bileÅŸen
> **Effort**: High
> **Parallel**: Wave 1 (schema + API) â†’ Wave 2 (UI)

## Context
### Mevcut Durum
- Subscription sistemi sadece `Profile.subscriptionId` ve `Profile.premiumUntil` ile Ã§alÄ±ÅŸÄ±yor
- Paid planlar bloke (`"Ã–deme entegrasyonu yakÄ±nda aktif olacak"`)
- Ä°ptal/Ã¶deme geÃ§miÅŸi/premium analitik hiÃ§biri yok

## Work Objectives
- Abonelik iptal etme + yeniden aktifleÅŸtirme
- Ã–deme geÃ§miÅŸi sayfasÄ± (seed data ile)
- Premium firma analitik kartlarÄ±

## Execution Strategy
Wave 1: Prisma schema + API endpoints
Wave 2: UI bileÅŸenleri (iptal butonu, Ã¶deme geÃ§miÅŸi tablosu, premium analitik)
Wave 3: Build + PI deploy

## TODOs

### Wave 1 â€” Schema + API

- [ ] T1.1 Prisma schema: Profile'a `autoRenew`, `canceledAt` ekle + SubscriptionPayment modeli

  **What to do**:
  `prisma/schema.prisma` dosyasÄ±nda:
  - Profile model'ine ÅŸu alanlarÄ± ekle:
    ```prisma
    autoRenew  Boolean   @default(true)
    canceledAt DateTime?
    ```
  - Yeni model ekle:
    ```prisma
    model SubscriptionPayment {
      id             Int      @id @default(autoincrement())
      profileId      Int
      planId         Int
      amount         Int      // kuruÅŸ cinsinden
      currency       String   @default("TRY")
      status         String   @default("completed") // pending, completed, failed, refunded
      paymentMethod  String?  // "credit_card", "bank_transfer", "free"
      description    String?
      createdAt      DateTime @default(now())

      profile Profile          @relation(fields: [profileId], references: [id], onDelete: Cascade)
      plan    SubscriptionPlan @relation(fields: [planId], references: [id])
    }
    ```

  **Files**: `prisma/schema.prisma`

  **Acceptance Criteria**:
  - [ ] `prisma generate` hatasÄ±z Ã§alÄ±ÅŸÄ±r
  - [ ] `prisma db push` veya migration Ã§alÄ±ÅŸÄ±r

  **Commit**: NO (API commit'inde toplu)

- [ ] T1.2 API: `POST /api/subscriptions/cancel`

  **What to do**:
  Yeni dosya: `src/app/api/subscriptions/cancel/route.ts`
  ```ts
  // Auth kontrolÃ¼
  // Profile bul (userId'den)
  // Profile varsa autoRenew=false, canceledAt=now() set et
  // Response: { success: true, message: "AboneliÄŸiniz iptal edildi" }
  ```

  **Files**: `src/app/api/subscriptions/cancel/route.ts`

  **Acceptance Criteria**:
  - [ ] Oturum aÃ§mamÄ±ÅŸ kullanÄ±cÄ± â†’ 401
  - [ ] Profili olmayan kullanÄ±cÄ± â†’ 400
  - [ ] Premium Ã¼yeliÄŸi olmayan â†’ 400
  - [ ] BaÅŸarÄ±lÄ± iptal â†’ 200 + autoRenew=false

- [ ] T1.3 API: `POST /api/subscriptions/reactivate`

  **What to do**:
  Yeni dosya: `src/app/api/subscriptions/reactivate/route.ts`
  ```ts
  // Auth kontrolÃ¼
  // Profile bul
  // autoRenew=true, canceledAt=null
  // Response: { success: true }
  ```

  **Files**: `src/app/api/subscriptions/reactivate/route.ts`

  **Acceptance Criteria**:
  - [ ] Oturum gerekli
  - [ ] autoRenew=true, canceledAt=null

- [ ] T1.4 API: `GET /api/subscriptions/payments`

  **What to do**:
  Yeni dosya: `src/app/api/subscriptions/payments/route.ts`
  ```ts
  // Auth kontrolÃ¼
  // Profile bul (userId'den)
  // SubscriptionPayment'leri getir (plan join ile)
  // Response: payments[]
  ```

  **Files**: `src/app/api/subscriptions/payments/route.ts`

  **Acceptance Criteria**:
  - [ ] Oturum gerekli
  - [ ] BoÅŸ array veya payment listesi dÃ¶ner

### Wave 2 â€” UI

- [ ] T2.1 Ä°ptal butonu (CancelSubscription.tsx)

  **What to do**:
  Yeni dosya: `src/app/dashboard/uyelik/CancelSubscription.tsx`
  - Client component
  - "AboneliÄŸi Ä°ptal Et" butonu
  - TÄ±klayÄ±nca onay dialogu (modal)
  - OnaylanÄ±nca POST /api/subscriptions/cancel
  - BaÅŸarÄ±lÄ± olunca router.refresh()
  - EÄŸer zaten iptal edilmiÅŸse "AboneliÄŸi Yeniden AktifleÅŸtir" butonu
  - YanlÄ±ÅŸlÄ±kla iptali Ã¶nlemek iÃ§in net aÃ§Ä±klama: "Premium Ã¼yeliÄŸiniz [tarih]'e kadar aktif kalacak, yenilenmeyecek"

  **Files**: `src/app/dashboard/uyelik/CancelSubscription.tsx`

- [ ] T2.2 Ã–deme geÃ§miÅŸi tablosu (PaymentHistory.tsx)

  **What to do**:
  Yeni dosya: `src/app/dashboard/uyelik/PaymentHistory.tsx`
  - Client component
  - useEffect ile GET /api/subscriptions/payments
  - Tablo: Tarih, Plan AdÄ±, Tutar, Durum
  - Durum badge: completed=yeÅŸil, pending=sarÄ±, failed=kÄ±rmÄ±zÄ±
  - BoÅŸsa: "HenÃ¼z Ã¶deme kaydÄ± bulunmuyor"

  **Files**: `src/app/dashboard/uyelik/PaymentHistory.tsx`

- [ ] T2.3 Premium analitik kartlarÄ± (PremiumAnalytics.tsx)

  **What to do**:
  Yeni dosya: `src/app/dashboard/uyelik/PremiumAnalytics.tsx`
  - Mevcut analitik verilerini (viewCount, ratingAvg, reviewCount, sentMessages, favoriteCount) daha gÃ¶rsel gÃ¶ster
  - Premium badge ile iÅŸaretle
  - HaftalÄ±k/aylÄ±k trend gÃ¶stergesi (yÃ¼kselen/dÃ¼ÅŸen oklarÄ±)
  - NOT: GerÃ§ek zaman serisi verisi yoksa, sadece mevcut sayÄ±larÄ± daha gÃ¼zel gÃ¶ster

  ```tsx
  // Props: { viewCount, ratingAvg, reviewCount, sentMessages, favoriteCount, isPremium }
  ```

  **Files**: `src/app/dashboard/uyelik/PremiumAnalytics.tsx`

- [ ] T2.4 uyelik/page.tsx â€” iptal butonu + Ã¶deme geÃ§miÅŸi + premium analitik ekle

  **What to do**:
  Mevcut `dashboard/uyelik/page.tsx`'e ÅŸunlarÄ± ekle:
  1. Aktif Ã¼yelik kartÄ±na `CancelSubscription` component'ini ekle (iptal edilmemiÅŸse)
  2. Plans bÃ¶lÃ¼mÃ¼nden sonra `PaymentHistory` component'ini ekle (sadece ASSEMBLER/MANUFACTURER)
  3. Analytics bÃ¶lÃ¼mÃ¼ne `PremiumAnalytics` component'ini ekle (sadece premium Ã¼yeler)

  - `profile` sorgusuna `autoRenew`, `canceledAt` alanlarÄ±nÄ± ekle
  - Premium analitik iÃ§in ek sorgu:
    ```ts
    const premiumAnalytics = profile && (roles.includes("ASSEMBLER") || roles.includes("MANUFACTURER")) ? {
      viewCount: profile.viewCount,
      ratingAvg: profile.ratingAvg,
      reviewCount: profile.reviewCount,
      favoriteCount: await prisma.favorite.count({ where: { profileId: profile.id } }),
      sentMessages: await prisma.message.count({ where: { senderId: userId } }),
    } : null;
    ```

  **Files**: `src/app/dashboard/uyelik/page.tsx`

- [ ] T2.5 EmailVerifyBadge.tsx â€” `autoRenew` durumunu gÃ¶ster

  **What to do**:
  gerek yok, her ÅŸey uyelik/page.tsx'te olacak

### Wave 3 â€” Build + Deploy

- [ ] T3.1 `prisma generate` + `prisma db push` (yeni migration)

  **What to do**:
  ```bash
  npx prisma generate
  npx prisma db push
  ```
  (PI'da da aynÄ±sÄ±nÄ± yap)

- [ ] T3.2 `npm run build` + hata dÃ¼zeltme

- [ ] T3.3 PI deploy: tÃ¼m deÄŸiÅŸen dosyalarÄ± kopyala + PI'da build + prisma generate + pm2 restart

- [ ] Git commit

## Final Verification
- [ ] F1. Aktif Ã¼yelik kartÄ±nda "AboneliÄŸi Ä°ptal Et" butonu gÃ¶rÃ¼nÃ¼yor
- [ ] F2. Ä°ptal edince onay dialogu Ã§Ä±kÄ±yor
- [ ] F3. Ä°ptal sonrasÄ± buton "Yeniden AktifleÅŸtir" oluyor
- [ ] F4. Ã–deme geÃ§miÅŸi tablosu gÃ¶rÃ¼nÃ¼yor (seed data varsa)
- [ ] F5. Premium analitik kartlarÄ± premium Ã¼yelere Ã¶zel gÃ¶steriliyor
- [ ] F6. Build hatasÄ±z
- [ ] F7. PI deploy baÅŸarÄ±lÄ±

