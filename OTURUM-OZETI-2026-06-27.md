# Montajimvar Geliştirme Oturumu — 27 Haziran 2026

## Genel Bilgiler

- **Proje**: montajimvar.xyz — Next.js 16.2.9 (App Router), Prisma (PostgreSQL/Neon), Tailwind CSS
- **Push Servisi**: `push.montajimvar.xyz` (SQLite, ayrı PM2 process)
- **Deploy**: Raspberry Pi `192.168.0.38`, PM2, nginx reverse proxy
- **Auth**: NextAuth.js + Supabase (credentials provider)
- **VAPID Key**: `BIl2pfMHZaO6KUFk9MvYi-xo6DP5JMWeX9X_f9PG0tH2yOF7Hn8zCmhZ1RGWX8ipYHRgY51h6XRAlOUNOqJZhl8`

---

## Yapılan İşler

### 1. iOS Push Notification Desteği (push-service tarafı)

**Dosyalar**: `push-service/server.js`, `push-service/db.js`

- Push subscription'lara `is_ios` kolonu eklendi (SQLite)
- iOS cihaz tespiti: User-Agent'da `iPhone`/`iPad`/`iPod` kontrolü
- iOS payload farkları:
  - `badge` gönderilmez (iOS Safari desteklemez)
  - Mutlak URL kullanılır (`data.url`)
  - `requireInteraction: false`

### 2. Mesajlaşma Sistemi — #2

#### Veritabanı (Prisma)

```prisma
model Message {
  id        String    @id @default(cuid())
  fromId    String
  toId      String
  text      String
  readAt    DateTime?  // okunma zamanı (null = okunmamış)
  replyTo   String?    // cevap verilen mesaj ID'si
  createdAt DateTime  @default(now())

  from Profile @relation("SentMessages", fields: [fromId], references: [id])
  to   Profile @relation("ReceivedMessages", fields: [toId], references: [id])
}
```

**Migration**: `prisma/migrations/20260627120000_add_message_readat_replyto/`

#### API Routes

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/messages` | GET | Mesaj listesi. Parametreler: `type=unread-count` (sadece sayı), `since=<ISO>` (yeni mesajları getir), `conversationWith=<id>` (tek konuşma) |
| `/api/messages` | POST | Yeni mesaj gönder. Alıcıya push notification yollar |
| `/api/messages/[id]` | PATCH | `readAt` set eder (okundu işaretler) |
| `/api/messages/read-all` | PATCH | Oturum açan kullanıcının tüm okunmamış mesajlarını okundu işaretler |

#### Frontend

| Sayfa | Açıklama |
|-------|----------|
| `/dashboard/mesajlar` | Konuşma bazlı inbox. Gruplama: karşı tarafa göre. Her konuşmada okunmamış sayısı, son mesaj önizlemesi, "Hepsini Okundu İşaretle" butonu |
| `/dashboard/mesajlar/[id]` | Tek konuşma detayı (mevcut, değişmedi) |
| `UnreadBadge.tsx` | Navbar'daki okunmamış rozeti. 15sn'de bir `/api/messages?type=unread-count` poll yapar |

- Push notification: Yeni mesajda alıcıya push gider (mevcut `sendPushNotification` fonksiyonu ile)
- Toast bildirimi: Mesaj sayfasında yeni mesaj geldiğinde toast gösterilir

### 3. SEO İyileştirmeleri — #4

| Dosya | Değişiklik |
|-------|-----------|
| `src/app/firma/[id]/opengraph-image.tsx` | **YENİ**: Dinamik OG görseli. Next.js `ImageResponse` (edge runtime). Firma adı, şehir, kategori, puan gösterir. Görselde: montajimvar.xyz logosu + firma bilgileri |
| `src/app/firma/[id]/page.tsx` | `generateMetadata` güncellendi: canonical URL, OG title/description/image, twitter card, `appleWebApp` uyarısı var |
| `src/app/sitemap.ts` | `tos` ve `privacy` sayfaları eklendi, base URL `https://montajimvar.xyz` |
| `src/app/robots.ts` | base URL düzeltildi |

### 4. Analytics (Profil Görüntülenme Takibi) — #5

#### Veritabanı (Prisma)

```prisma
model ProfileViewLog {
  id        String   @id @default(cuid())
  profileId String
  viewerId  String?  // oturum açmış kullanıcı (null = anonim)
  createdAt DateTime @default(now())

  @@index([profileId, createdAt])
  @@index([profileId])
}
```

**Migration**: `prisma/migrations/20260627123000_add_profile_view_log/`

#### API Routes

| Endpoint | Açıklama |
|----------|----------|
| `GET /api/analytics/[id]` | Görüntülenme istatistikleri. Sadece profil sahibi görebilir. Dönen: `{ daily: 5, weekly: 23, monthly: 87, total: 312 }` |

- Görüntülenme logu: Firma sayfası yüklendiğinde `fetch('/api/analytics/view', ...)` ile log atılır (anonim kullanıcılar da kaydedilir)
- `viewerId` varsa kaydedilir, yoksa `null`
- Profil sahibi kendi profilini görüntülerse log atılmaz

### 5. Google Firma İmport Duplicate Kontrolü — #6

**Dosya**: `src/app/api/admin/google-firma-kaydet/route.ts`

- Aynı isim + aynı şehirde firma varsa kaydetme, hata döndür
- Karşılaştırma case-insensitive (büyük/küçük harf duyarsız)
- Aynı kullanıcının kendi firmasını güncellemesine izin verir

### 6. Performans İyileştirmeleri — #7

#### next/image Konfigürasyonu

**Dosya**: `next.config.ts`

```ts
remotePatterns: [
  { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
  { protocol: 'https', hostname: '*.googleusercontent.com' },
  // mevcut: randomuser.me, tailwindui.com, images.unsplash.com
]
```

#### next/image Kullanımı

| Bileşen | Değişiklik |
|---------|-----------|
| `Navbar.tsx` | Avatar `<img>` → `<Image fill className="rounded-full object-cover" />`. Container: `relative shrink-0` |
| `CompanyCard.tsx` | Logo `<img>` → `<Image fill className="object-contain" />`. Container: `relative aspect-[4/3]` |

#### Loading Skeletons

| Sayfa | Dosya |
|-------|-------|
| `/firma/[id]` | `src/app/firma/[id]/loading.tsx` — 3 adet pulse animasyonlu kart |
| `/ara` | `src/app/ara/loading.tsx` — 6 adet firma kartı skeleton'u |

### 7. PWA İyileştirmeleri — #8

| Dosya | Değişiklik |
|-------|-----------|
| `public/badge-icon.svg` | **YENİ**: 96×96 monochrome beyaz pushpin ikonu (şeffaf arka plan). iOS bildirim rozeti için |
| `public/sw.js` | **Cache stratejisi yeniden yazıldı**: |
| | - `defaultBadge` → `/badge-icon.svg` |
| | - Navigation istekleri: **stale-while-revalidate** (önce cache, arka planda network) |
| | - `/_next/static/*`: **cache-first** |
| | - `/api/*`: **network-only** |
| | - Diğer (CSS, JS, img): **cache-first + network update** (cache'de yoksa network, sonra cache + network'den güncelle) |
| | - `requireInteraction` flag: payload'dan gelir (`data.requireInteraction`), yoksa `false` |

### 8. Email Şablonları — #10

**Dosya**: `src/lib/email.ts`

```ts
export function welcomeEmailHtml(name: string): string
// Hoşgeldin e-postası. İçerik: kayıt tebriği, firma ekleme çağrısı, yol haritası

export function premiumReminderHtml(name: string, daysLeft: number): string
// Premium bitiş hatırlatması. İçerik: kalan gün, yenileme çağrısı, avantajlar
```

**Gönderim**: E-posta doğrulama başarılı olunca (`/api/auth/email-verify/[token]/route.ts`) otomatik hoşgeldin e-postası gönderilir.

### 9. Admin Push Bildirim Gönderimi

**Dosya**: `src/app/api/admin/send-push/route.ts`

- Admin panelinden manuel push gönderme
- Alıcı seçimi: tüm kullanıcılar, belirli kullanıcı, belirli firma sahipleri
- Bildirim içeriği: başlık, mesaj, icon, badge, URL
- iOS kullanıcılarına badge göndermez (VAPID paylaşımı ile)

---

## Önemli Kararlar

1. **Polling (15-30sn) ile gerçek zamanlı mesajlaşma** — WebSocket yerine (Pi'de yeni altyapı gerektirmez)
2. **`next/image` + `unoptimized`** — Kullanıcı yüklemeli avatar/logolar için (harici domain sorunu yaşanmaz)
3. **Konuşma bazlı mesaj gruplama** — Tek mesaj listesi yerine karşı tarafa göre gruplama
4. **Monochrome SVG badge** — iOS push bildirim rozeti (96×96, beyaz/şeffaf)
5. **Edge runtime OG images** — Pi'de edge runtime desteği gerekli

---

## Teknik Detaylar

### VAPID Anahtarları
```
Public:  BIl2pfMHZaO6KUFk9MvYi-xo6DP5JMWeX9X_f9PG0tH2yOF7Hn8zCmhZ1RGWX8ipYHRgY51h6XRAlOUNOqJZhl8
Private: .env.local'de (PUSH_SERVICE_KEY)
```

### Push Servisi
- Internal URL: `https://push.montajimvar.xyz`
- Auth: Header'da `x-api-key` ile doğrulama
- DB: SQLite (`/home/pi/montajimvar/push-service/push-subscriptions.db`)
- iOS tespiti: User-Agent'da `iPhone`/`iPad`/`iPod`

### Environment (.env)
- `DATABASE_URL` — Neon PostgreSQL connection string
- `PUSH_SERVICE_URL` — `https://push.montajimvar.xyz`
- `PUSH_SERVICE_KEY` — VAPID private key
- `NEXT_PUBLIC_PUSH_SERVICE_URL` — `https://push.montajimvar.xyz`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — VAPID public key
- `NEXTAUTH_SECRET` — NextAuth.js secret
- `NEXTAUTH_URL` — `https://montajimvar.xyz`

---

## Sonraki Yapılabilecekler

1. **Ödeme entegrasyonu** (İyzico veya PayTR)
2. **WebSocket** — Anlık mesajlaşma (polling yerine)
3. **Google Places API** — Otomatik adres tamamlama
4. **SMTP yapılandırması** — Şu an dev modda (emailler console'a loglanır)
5. **Premium özellikler** — Öne çıkma, istatistikler, reklamsız
6. **İstatistikler ve raporlama** — Admin paneli için dashboard
7. **Mobil uygulama** — PWA bildirimleri iOS'ta test edildi, Android de benzer
