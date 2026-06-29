# Montajım Var — Kapsamlı Proje Dokümanı

> **Son Güncelleme**: 27 Haziran 2026
> **Canlı URL**: [https://montajimvar.xyz](https://montajimvar.xyz)

---

## 1. Proje Künyesi

| Özellik | Değer |
|---------|-------|
| **Proje Adı** | Montajım Var |
| **Amaç** | Türkiye'deki montaj firmaları, üreticiler ve müşterileri buluşturan platform |
| **Framework** | Next.js 16.2.9 (App Router) |
| **UI** | Tailwind CSS v4, SVG ikonlar |
| **Veritabanı** | PostgreSQL (Neon Serverless) |
| **ORM** | Prisma v5.22.0 |
| **Auth** | NextAuth.js v4 + JWT + Supabase (credentials provider) |
| **Email** | Nodemailer (SMTP) |
| **Google Scraping** | Cheerio |
| **PWA** | Service Worker, Web Manifest, Push API |
| **Platform** | Web (responsive) + iOS PWA + Expo WebView mobile app |
| **Deploy** | Raspberry Pi (`192.168.0.38`), PM2, nginx reverse proxy |
| **Push Servisi** | Ayrı Node.js/Express servisi (`push.montajimvar.xyz`, SQLite) |

---

## 2. Kullanıcı Rolleri ve Yetkileri

| Rol | Açıklama | Yetkiler |
|-----|----------|----------|
| **ADMIN** | Admin | Tüm yönetim panelleri, kullanıcı/firma düzenleme, CSV export |
| **CUSTOMER** | Müşteri | Firma ara, profilleri gör, mesaj gönder |
| **ASSEMBLER** | Montajcı | Firma profili oluştur, mesaj al |
| **MANUFACTURER** | Üretici | Firma profili oluştur, mesaj al |

**Rol-permisyon sistemi**: `RolePermission` modelinde her rol + feature kombinasyonu için `enabled` flag'i tutulur, cache'li kontrol ile çalışır.

---

## 3. Sayfa Haritası

### 3.1 Herkese Açık Sayfalar

| Sayfa | Yol | İçerik |
|-------|-----|---------|
| Anasayfa | `/` | Arama kutusu, kategori listesi, öne çıkan firmalar, istatistik bandı, premium firmalar, hero bölümü |
| Ara | `/ara` | Şehir + kategori filtreleri, harita, liste/sıralama sayfalama |
| Firma Detay | `/firma/[id]` | Profil bilgileri, Leaflet harita, galeri, yorumlar, mesaj gönder butonu, puan, OG görseli |
| Giriş | `/auth/giris` | Email + şifre veya Google ile giriş |
| Kayıt | `/auth/kayit` | Ad, email, şifre, rol seçimi, Google ile kayıt |
| Şifre Sıfırlama | `/auth/sifre-unuttum` | Email gönder |
| Şifre Sıfırla | `/auth/sifre-sifirla/[token]` | Yeni şifre gir |
| E-posta Doğrula | `/auth/email-dogrula` | Token ile doğrulama |
| Yardım/SSS | `/yardim` | Sık sorulan sorular |
| Gizlilik | `/gizlilik` | Gizlilik politikası |
| Kullanım Koşulları | `/kullanim-kosullari` | Kullanım şartları |

### 3.2 Dashboard Sayfaları (giriş yapınca)

| Sayfa | Yol | Yetki |
|-------|-----|-------|
| Dashboard Ana | `/dashboard` | Herkes |
| Firmam | `/dashboard/firma` | ASSEMBLER, MANUFACTURER |
| Mesajlarım | `/dashboard/mesajlar` | Herkes (konuşma bazlı inbox) |
| Mesaj Detay | `/dashboard/mesajlar/[id]` | Herkes |
| Profilim | `/dashboard/profil` | Herkes |
| Favorilerim | `/dashboard/favoriler` | Herkes |
| Üyelik | `/dashboard/uyelik` | Herkes (abonelik, iptal, ödeme geçmişi, analitik) |

### 3.3 Admin Sayfaları (ADMIN rolü)

| Sayfa | Yol |
|-------|-----|
| Admin Ana | `/admin` |
| Kullanıcılar | `/admin/kullanicilar` |
| Firmalar | `/admin/firmalar` |
| Kategoriler | `/admin/kategoriler` |
| İzinler | `/admin/izinler` |
| Premium Abonelik Planları | `/admin/abonelik-plani` |
| Google'dan Firma Ekle | `/admin/google-firma-ekle` |

### 3.4 Tasarım Sayfaları

| Yol |
|-----|
| `/tasarim-a` |
| `/tasarim-b` |
| `/tasarim-c` |
| `/tasarim-d` |
| `/tasarim-e` |
| `/tasarim-f` |
| `/tasarim-yeni` |

---

## 4. API Route Haritası

### 4.1 Genel API'ler

| Endpoint | Metod | Açıklama |
|----------|-------|----------|
| `/api/messages` | GET | Mesaj listesi (`?type=unread-count`, `?since=`, `?conversationWith=`) |
| `/api/messages` | POST | Yeni mesaj gönder + push notification |
| `/api/messages/[id]` | PATCH | `readAt` set et (okundu işaretle) |
| `/api/messages/read-all` | PATCH | Toplu okundu işaretleme |
| `/api/profiles` | GET | Firma listesi (filtreleme, sıralama, sayfalama) |
| `/api/profiles` | POST | Firma profili oluştur/güncelle |
| `/api/categories` | GET | Kategori listesi |
| `/api/reviews` | GET/POST | Yorum listele/ekle |
| `/api/favorites` | GET/POST/DELETE | Favori listele/ekle/çıkar |
| `/api/analytics/[id]` | GET | Profil görüntülenme istatistikleri |
| `/api/debug` | GET | SMTP bağlantı testi |
| `/api/upload` | POST | Dosya yükleme (görseller) |

### 4.2 Auth API'leri

| Endpoint | Açıklama |
|----------|----------|
| `/api/auth/[...nextauth]` | NextAuth.js handler (credentials + Google) |
| `/api/auth/kayit` | Kayıt ol + email doğrulama token'i gönder |
| `/api/auth/email-verify` | E-posta doğrulama sayfası |
| `/api/auth/email-verify/[token]` | Token doğrulama + hoşgeldin emaili |
| `/api/auth/sifre-sifirla` | Şifre sıfırlama token'i gönder |
| `/api/auth/sifre-sifirla/[token]` | Token ile şifre sıfırlama |
| `/api/auth/mobile-login` | Mobil uygulama login |
| `/api/auth/refresh` | Session yenileme |

### 4.3 Admin API'leri

| Endpoint | Açıklama |
|----------|----------|
| `/api/admin/users` | Kullanıcı listesi/oluşturma |
| `/api/admin/users/[id]/roles` | Rol güncelleme |
| `/api/admin/users/[id]/premium` | Premium atama |
| `/api/admin/profiles` | Firma profilleri yönetimi |
| `/api/admin/categories` | Kategori yönetimi |
| `/api/admin/permissions` | Rol-permisyon yönetimi |
| `/api/admin/subscription-plans` | Abonelik planları |
| `/api/admin/notifications` | Admin bildirimleri listesi |
| `/api/admin/notifications/[id]/read` | Bildirimi okundu işaretle |
| `/api/admin/send-push` | Toplu push bildirimi gönder |
| `/api/admin/export` | CSV export |
| `/api/admin/firma-bilgi-getir` | Google scraping firma bilgisi getir |
| `/api/admin/google-firma-kaydet` | Google'dan scrapelenmiş firmayı kaydet (duplicate kontrolü) |

### 4.4 Abonelik API'leri

| Endpoint | Açıklama |
|----------|----------|
| `/api/subscriptions` | Abonelik başlat |
| `/api/subscriptions/cancel` | Abonelik iptal |
| `/api/subscriptions/reactivate` | Abonelik yeniden aktifleştir |
| `/api/subscriptions/payments` | Ödeme geçmişi |

### 4.5 Kullanıcı API'leri

| Endpoint | Açıklama |
|----------|----------|
| `/api/user` | Kullanıcı bilgileri |
| `/api/user/avatar` | Avatar yükleme |
| `/api/profile-images` | Firma görseli yönetimi |

---

## 5. Veritabanı Şeması (Prisma)

### 5.1 Modeller

| Model | Alanlar | Açıklama |
|-------|---------|----------|
| **User** | id, name, email, password, phone, avatar, roles[], tokenVersion, city, emailVerified, emailVerificationToken, emailVerificationExpires, premiumUntil, createdAt, updatedAt | Kullanıcı hesabı |
| **Profile** | id, userId, companyName, description, categoryId, city, address, phone, website, logo, whatsapp, latitude, longitude, isVerified, isFeatured, viewCount, ratingAvg, reviewCount, subscriptionId, autoRenew, canceledAt, premiumUntil, createdAt, updatedAt | Firma profili |
| **Category** | id, name, slug, icon, createdAt | Kategoriler |
| **ProfileCategory** | id, profileId, categoryId (`@@unique`) | Firma-kategori çoklu ilişkisi |
| **ProfileImage** | id, profileId, url, alt, description, category, tags, isLogo, isFeatured, sortOrder, createdAt, updatedAt | Firma görselleri |
| **Message** | id, senderId, receiverId, subject, content, isRead, readAt, replyTo, createdAt + self-relation (MessageReplies) | Mesajlar |
| **Review** | id, profileId, userId, rating, comment, createdAt (`@@unique profileId+userId`) | Yorum/puan |
| **Favorite** | id, userId, profileId, createdAt (`@@unique userId+profileId`) | Favoriler |
| **PushSubscription** | id, userId, endpoint (unique), p256dh, auth, userAgent, createdAt, updatedAt | Push bildirim abonelikleri |
| **ProfileViewLog** | id, profileId, viewerId?, createdAt (indexed profileId+createdAt) | Profil görüntülenme logu |
| **Notification** | id, type, title, message, link, isRead, createdAt | Admin bildirimleri |
| **RolePermission** | id, role, feature, enabled, createdAt, updatedAt (`@@unique role+feature`) | Rol-permisyonlar |
| **SubscriptionPlan** | id, name, slug (unique), description, price, durationDays, features, isActive, sortOrder, badgeLabel, badgeColor, createdAt, updatedAt | Abonelik planları |
| **SubscriptionPayment** | id, profileId, planId, amount, currency, status, paymentMethod, description, createdAt | Ödeme kayıtları |
| **PasswordResetToken** | id, email, token (unique), expiresAt, createdAt | Şifre sıfırlama token'ları |

### 5.2 İlişkiler

```
User 1─1 Profile
User 1─* Message (SentMessages, ReceivedMessages)
User 1─* Review
User 1─* Favorite
User 1─* PushSubscription
Profile 1─* ProfileImage
Profile 1─* Review
Profile 1─* Favorite
Profile 1─* ProfileCategory
Profile *─1 Category (ana kategori)
Profile *─1 SubscriptionPlan
Profile 1─* ProfileViewLog
Profile 1─* SubscriptionPayment
Message *─1 Message (self: replyTo)
```

---

## 6. Push Bildirim Sistemi

### 6.1 Mimari

```
[Next.js App] --POST /send--> [Push Service (Node.js/Express)] --> [Browser Push API]
                                    |
                              [SQLite DB]
                           (subscriptions)
```

### 6.2 Push Service (`push.montajimvar.xyz`)

- **Port**: 3001 (PM2: `montajimvar-push`)
- **Auth**: `x-push-service-key` header
- **DB**: SQLite (`push-subscriptions.db`)
- **Endpoint'ler**:
  - `GET /health` — Durum kontrolü
  - `GET /vapid-public-key` — VAPID public key döndürür
  - `POST /subscribe` — Abonelik kaydet (iOS tespiti: User-Agent)
  - `POST /unsubscribe` — Abonelik sil
  - `POST /send` — Push gönder (internal, main site'den çağrılır)

### 6.3 iOS Desteği

- iOS cihazlar `User-Agent` ile tespit edilir (`iPhone`/`iPad`/`iPod`)
- iOS payload'ında `badge` gönderilmez (iOS Safari desteklemez)
- iOS'ta `requireInteraction: false` (otomatik kapanır)
- iOS bildirimlerinde mutlak URL kullanılır
- `badge-icon.svg` (96×96 monochrome beyaz pushpin) iOS rozeti
- PWA manifest: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `apple-splash-icon.png`

### 6.4 Service Worker (`public/sw.js`)

| Strateji | Kapsam |
|----------|--------|
| **Network-only** | API routes (`/api/*`) |
| **Cache-first** | Next.js static chunks (`/_next/static/*`) |
| **Network-first (stale-while-revalidate)** | Navigation (sayfalar) |
| **Cache-first + network update** | CSS, JS, img, diğer statik |

- Cache name: `montajimvar-v2`
- badge: `/badge-icon.svg` (varsayılan)
- `requireInteraction`: payload'dan gelir (`data.requireInteraction`)
- Bildirim tıklanınca → URL'ine yönlendir

---

## 7. Email Sistemi

### 7.1 SMTP Ayarları

| Değişken | Açıklama |
|----------|----------|
| `SMTP_HOST` | SMTP sunucu adresi |
| `SMTP_PORT` | Port (587 veya 465) |
| `SMTP_USER` | Kullanıcı adı |
| `SMTP_PASS` | Şifre |
| `EMAIL_FROM` | Gönderici adresi |

- SMTP ayarları eksikse → dev mode (emailler console'a loglanır)
- TLS: `rejectUnauthorized: false`

### 7.2 Email Şablonları

| Şablon | Fonksiyon | Kullanım |
|--------|-----------|----------|
| E-posta Doğrulama | `verifyEmailHtml(url)` | Kayıt sonrası gönderilir |
| Şifre Sıfırlama | `resetPasswordHtml(url)` | Şifre sıfırlama talebinde |
| Hoşgeldin E-postası | `welcomeEmailHtml(name, verifyUrl?)` | E-posta doğrulama başarılı olunca |
| Premium Hatırlatma | `premiumReminderHtml(companyName, daysLeft, renewUrl)` | Premium bitişine N gün kala |

---

## 8. Bileşenler (Components)

### 8.1 UI Bileşenleri (`src/components/ui/`)

| Bileşen | Açıklama |
|---------|----------|
| Badge | Rozet göstergesi |
| Button | Buton (çeşitli varyantlar) |
| Card | Kart kapsayıcı |
| Input | Giriş alanı |

### 8.2 Özel Bileşenler

| Bileşen | Açıklama |
|---------|----------|
| **Navbar** | Üst menü (kullanıcı menüsü, avatar next/image, tema toggle, unread badge, admin link) |
| **Footer** | Alt bilgi (linkler: yardım, gizlilik, kullanım koşulları) |
| **CompanyCard** | Firma kartı (logo next/image, puan, şehir, kategori, öne çıkan/premium) |
| **CompanyMap** | Leaflet harita (enlem/boylam gösterimi, yol tarifi butonu) |
| **SearchForm** | Arama formu (şehir, kategori filtreleri, sıralama) |
| **CategoryFilter** | Kategori filtreleme (çoklu seçim) |
| **SearchViewToggle** | Harita/Liste görünüm değiştirme |
| **SearchMap** | Arama sonuçları haritası |
| **ReviewSection** | Yorum/puan bölümü (yıldız, kullanıcı foto, tarih, yorum metni) |
| **ImageGallery** | Firma görsel galerisi (üstte büyük, altta küçük resimler) |
| **PortfolioGallery** | Portfolyo galerisi |
| **FavoriteButton** | Favori ekle/çıkar butonu |
| **PremiumBadge** | Premium rozeti |
| **ThemeToggle** | Açık/koyu tema geçişi |
| **CookieBanner** | Çerez onay banner'ı |
| **Provider** | NextAuth + ThemeProvider sarmalayıcı |
| **PushNotificationSetup** | Push bildirim izni isteği UI |
| **UnreadBadge** | Navbar'da okunmamış mesaj sayısı (15sn polling) |
| **ToggleTheme** | Tema değiştirme |

---

## 9. Auth Sistemi

### 9.1 Sağlayıcılar

- **Credentials** (email + şifre, bcrypt ile hash)
- **Google OAuth** (rol seçimi cookie ile: `google_signup_role`)

### 9.2 JWT Token

- **Strateji**: JWT (veritabanı session yok)
- **İçerik**: id, roles[], role[], avatar, tokenVersion
- **Versiyon Kontrolü**: Her istekte `User.tokenVersion` ile karşılaştırma (rol değişikliğinde session zorla yenilenir)
- **ID Tipi**: Int (Prisma autoincrement), JWT callback'te Number()'a çevrilir

### 9.3 E-posta Doğrulama

- Kayıt → `emailVerificationToken` (crypto.randomUUID) + expire 24 saat
- SMTP ile doğrulama linki gönderilir
- `GET /api/auth/email-verify/[token]` → doğrular, premium kontrol, hoşgeldin emaili
- Login'de kontrol: `user.emailVerified === false` → hata mesajı
- Admin panelinde `isVerified` kolonu
- Doğrulama yeniden gönderme butonu (giriş sayfasında)

---

## 10. SEO & Meta

### 10.1 OG Görselleri

- `/firma/[id]/opengraph-image.tsx` (edge runtime)
- `ImageResponse` ile dinamik görsel
- İçerik: firma adı, şehir, kategori, puan
- Tasarım: koyu arka plan, turuncu aksan, logo

### 10.2 Metadata

- Tüm sayfalarda `generateMetadata` ile dinamik title/description/OG/twitter/canonical
- `appleWebApp` metadata (PWA uyumluluğu)

### 10.3 Sitemap & Robots

- `/sitemap.xml` — dinamik (statik sayfalar + kategoriler + firmalar)
- `/robots.txt` — tüm crawler'lara izin ver

---

## 11. Admin Paneli

### 11.1 Özellikler

- Kullanıcı CRUD + rol yönetimi (çoklu rol)
- Firma yönetimi + silme + kategori düzenleme
- Kategori CRUD
- Rol-permisyon yönetimi (feature bazlı aç/kapa)
- Premium abonelik planları yönetimi
- Premium atama (kullanıcı bazlı)
- **Google scraping**: cheerio ile google.com/search'ten firma bilgisi çekme
  - Firma adı, telefon, adres, puan, yorum sayısı, website
  - Kaydetmeden önce duplicate kontrolü (aynı isim + şehir, case-insensitive)
- **CSV export** (firmalar)
- **Toplu push bildirim** gönderme
- Admin bildirimleri (yeni kullanıcı, yeni firma, yeni yorum, yeni mesaj, yeni ödeme)
- Aktif nav sekmesi highlight
- Kullanıcı-admin navbar ayrımı (Profilim/Firmam admin dropdown'da gizli)

---

## 12. Premium / Abonelik Sistemi

### 12.1 Özellikler

- Çoklu abonelik planı (SubscriptionPlan modeli)
- Premium süresi: `Profile.premiumUntil` ile takip
- `User.premiumUntil` → Profile.premiumUntil senkronizasyonu
- Premium firma rozeti (`PremiumBadge` bileşeni)
- Ödeme geçmişi (`SubscriptionPayment`)
- Abonelik iptal/yeniden aktifleştirme
- Admin: kullanıcıya manuel premium atama (isteğe bağlı tüm kullanıcılara)

### 12.2 Kullanıcı Tarafı

- `/dashboard/uyelik` sayfası: plan seçimi, ödeme geçmişi, abonelik yönetimi
- Premium üyeler için hero banner gizlenir
- Premium üyeler için plan kartları gizlenir
- Dashboard'da premium durumu + profil oluşturma banner'ı

---

## 13. Arama Sistemi

- Şehir filtresi
- Çoklu kategori filtresi (ProfileCategory çapraz tablosu)
- Sıralama: puan, görüntülenme, yeni
- Sayfalama
- Harita/Liste görünüm geçişi
- Leaflet harita entegrasyonu

---

## 14. Anasayfa

- **Hero Bölümü**: "Türkiye'nin Montaj Platformu" başlık, arama kutusu
- **Kategoriler**: SVG ikonlu kategori kartları
- **İstatistik Bandı**: Kayıtlı firma, kullanıcı, kategori, yorum sayıları
- **Öne Çıkan Firmalar**: `isFeatured` flag'li firmalar
- **Premium Firmalar**
- **Schema.org** structured data
- Logo: text-based (emoji yok, SVG ikonlar)

---

## 15. Mobil & PWA

### 15.1 PWA Özellikleri

- `manifest.json`: standalone display, turuncu theme, portrait-primary
- iOS: `apple-touch-icon.png` (180×180), `apple-splash-icon.png`
- Service Worker: `public/sw.js`
- Cache stratejileri (detay: bölüm 6.4)
- Push bildirim desteği (tüm platformlar)

### 15.2 Expo Mobile App

- WebView wrapper (`expo-web-browser`)
- Codemagic CI/CD yapılandırması
- `src/mobile/` dizini

---

## 16. Performans

### 16.1 next/image Optimizasyonu

- `next.config.ts` remotePatterns: `*.supabase.co`, `lh3.googleusercontent.com`, `*.googleusercontent.com`
- Navbar avatar: `<Image fill className="rounded-full object-cover" />`
- CompanyCard logo: `<Image fill className="object-contain" />`

### 16.2 Caching

- `force-dynamic` API route'lar (Next.js cache bypass)
- `revalidatePath` ile server cache temizleme
- JWT tokenVersion ile session invalidasyonu
- SSG yerine SSR (dinamik veri)

### 16.3 Loading Skeletons

- `/firma/[id]/loading.tsx` — 3 pulse animasyonlu kart
- `/ara/loading.tsx` — 6 firma kartı skeleton'u

---

## 17. Kullanılan Kütüphaneler

| Paket | Kullanım |
|-------|----------|
| next | Framework |
| react/react-dom | UI |
| tailwindcss v4 | Stil |
| @prisma/client + prisma | ORM |
| next-auth | Authentication |
| @supabase/supabase-js | Auth provider |
| bcryptjs | Şifre hash |
| nodemailer | Email gönderimi |
| web-push | VAPID push bildirim |
| cheerio | HTML scraping |
| leaflet | Harita |
| jsonwebtoken | JWT imzalama |
| expo | Mobil uygulama |
| bcryptjs | Şifreleme |

---

## 18. Ortam Değişkenleri (.env)

| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth.js secret |
| `NEXTAUTH_URL` | `https://montajimvar.xyz` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SMTP_HOST` | SMTP sunucu |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP kullanıcı |
| `SMTP_PASS` | SMTP şifre |
| `EMAIL_FROM` | Gönderici adresi |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key |
| `PUSH_SERVICE_URL` | `https://push.montajimvar.xyz` |
| `PUSH_SERVICE_KEY` | Internal auth key |
| `NEXT_PUBLIC_PUSH_SERVICE_URL` | `https://push.montajimvar.xyz` |
| `NEXT_PUBLIC_APP_URL` | `https://montajimvar.xyz` |

### Push Service (.env)

| Değişken | Açıklama |
|----------|----------|
| `PORT` | 3001 |
| `VAPID_PUBLIC_KEY` | VAPID public key |
| `VAPID_PRIVATE_KEY` | VAPID private key |
| `VAPID_SUBJECT` | `mailto:noreply@montajimvar.app` |
| `CORS_ORIGIN` | `https://montajimvar.xyz` |
| `PUSH_SERVICE_KEY` | Internal auth key |

---

## 19. Altyapı & Deploy

### 19.1 Raspberry Pi

| Bilgi | Değer |
|-------|-------|
| IP | `192.168.0.38` |
| SSH | `pi@192.168.0.38` / şifre: `123456` |
| Proje yolu | `/home/pi/montajimvar/` |
| PM2 process | `montajimvar` (Next.js), `montajimvar-push` (push service) |
| Build | `npm run build` (Next.js Turbopack) |
| Transfer | `pscp -scp -pw 123456 -P 22` |

### 19.2 Deploy Komutları

```bash
# Dosya transferi
pscp -scp -pw 123456 -P 22 -r prisma pi@192.168.0.38:/home/pi/montajimvar/
pscp -scp -pw 123456 -P 22 -r src pi@192.168.0.38:/home/pi/montajimvar/
pscp -scp -pw 123456 -P 22 public/sw.js pi@192.168.0.38:/home/pi/montajimvar/public/
pscp -scp -pw 123456 -P 22 next.config.ts pi@192.168.0.38:/home/pi/montajimvar/

# Build & restart (SSH)
plink -ssh -pw 123456 pi@192.168.0.38 "cd /home/pi/montajimvar && npx prisma generate && npm run build && pm2 restart montajimvar"
```

---

## 20. Git & Sürüm Geçmişi

Toplam **~85 commit** — projenin başlangıcından itibaren tüm geliştirme.

### Önemli Kilometre Taşları

| Tarih | Olay |
|------|------|
| 20 Haz 2026 | Proje başlangıcı: Next.js setup, auth, profil, mesajlaşma, arama |
| 21-22 Haz | Admin paneli, premium/abonelik, Google scraping, SEO, görseller |
| 23-24 Haz | Debug/email, codemagic/mobile, PWA, push bildirim |
| 25-26 Haz | Pi deploy, iOS push fix, hata düzeltmeleri |
| 27 Haz 2026 | Mesajlaşma sistemi, SEO, analytics, performans, email şablonları |

---

## 21. Gelecek Yapılacaklar

1. **Ödeme entegrasyonu** (İyzico veya PayTR) — şu an manuel/free
2. **WebSocket** — Anlık mesajlaşma (polling yerine)
3. **Google Places API** — Otomatik adres tamamlama
4. **SMTP yapılandırması** — Canlı email gönderimi (şu an dev mode)
5. **İstatistikler ve raporlama** — Admin dashboard
6. **Mobil push bildirimleri** — iOS Safari'de badge API testi
7. **Gelişmiş arama** — Tam metin arama (PostgreSQL FTS)
8. **İlan/yorum yönetimi** — Admin paneli için gelişmiş filtreleme

---

## 22. Önemli Notlar

- **VAPID Public Key**: `BIl2pfMHZaO6KUFk9MvYi-xo6DP5JMWeX9X_f9PG0tH2yOF7Hn8zCmhZ1RGWX8ipYHRgY51h6XRAlOUNOqJZhl8`
- **Push service**: Internal URL, doğrudan erişime kapalı, sadece montajimvar.xyz'den gelen istekleri kabul eder (CORS)
- **Session yenileme**: Rol değişikliğinde `tokenVersion` artırılır → kullanıcının yeniden giriş yapması gerekir
- **SSR**: Tüm sayfalar server-side rendered (`force-dynamic`)
- **Logo**: SVG ikon + metin (emoji yok, tüm emojiler SVG ile değiştirildi)
