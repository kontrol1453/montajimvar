# Montajım Var — Dönüşüm Yol Haritası

> **Hedef**: Montaj işi verenlerle (müşteri) montaj yapanları (usta/firma) buluşturan, güvenli ödemeli, AI destekli tam kapsamlı platform.
> **Strateji**: Parça parça, test ederek, timeout'suz ilerleme.

---

## Faz Sırası ve Öncelikler

```
Faz 1 — Veritabanı + Temel Modeller     ████████████ (bağımlılık: 0)
Faz 2 — Ana Sayfa + Kategoriler         ████████████ (bağımlılık: Faz 1)
Faz 3 — Teklif Sistemi                  ████████████ (bağımlılık: Faz 1-2)
Faz 4 — İş Takibi + Referanslar         ████████████ (bağımlılık: Faz 1-3)
Faz 5 — Usta Profilleri + İletişim      ████████████ (bağımlılık: Faz 1)
Faz 6 — SEO + Blog                      ████████████ (bağımlılık: Faz 1-2)
─── İlk Canlıya Alma Noktası ───
Faz 7 — Ödeme Sistemi                   ████████████ (bağımlılık: Faz 1-4)
Faz 8 — Dashboard'lar + Premium         ████████████ (bağımlılık: Faz 1-5)
Faz 9 — AI Destekli İş/Fiyat Analizi    ████████████ (bağımlılık: Faz 1-3)
Faz 10 — Kurumsal + Güven Unsurları     ████████████ (bağımlılık: Faz 2)
Faz 11 — CRM + Mobil Uyum               ████████████ (bağımlılık: Faz 7)
```

---

## FAZ 1 — Veritabanı Yeniden Yapılanması

### Yeni Modeller (Prisma)

```prisma
// Kategori ağacı (100+ kategori)
model Category {
  id        Int        @id @default(autoincrement())
  name      String
  slug      String     @unique
  parentId  Int?       // alt kategori desteği
  parent    Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryTree")
  icon      String?    // SVG ikon
  image     String?    // SEO için görsel
  metaTitle String?    // SEO title
  metaDesc  String?    // SEO description
  sortOrder Int        @default(0)
  isActive  Boolean    @default(true)
  createdAt DateTime   @default(now())

  profiles  ProfileCategory[]
  jobs      JobCategory[]
  services  ServiceCategory[]
}

// İş/Teklif talebi
model Job {
  id          Int      @id @default(autoincrement())
  customerId  Int      // User
  title       String
  description String
  photos      String   // JSON: ["url1", "url2"]
  location    String?  // adres metni
  lat         Float?
  lng         Float?
  city        String
  district    String?
  budgetMin   Int?     // ₺
  budgetMax   Int?     // ₺
  status      String   @default("pending")
  // pending → offer_received → assigned → en_route → in_progress → completed → payment_pending → paid
  // cancelled
  urgency     String?  // "normal", "acil", "çok_acil"
  accessInfo  String?  // bina giriş bilgisi, site kodu vb.
  aiAnalysis  String?  // JSON: AI analiz sonucu
  aiSuggestedPrice Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  customer    User     @relation("CustomerJobs", fields: [customerId], references: [id])
  categories  JobCategory[]
  offers      Offer[]
  timeline    JobTimeline[]
  messages    JobMessage[]
}

// İş-Kategori ilişkisi
model JobCategory {
  id         Int      @id @default(autoincrement())
  jobId      Int
  categoryId Int
  job        Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id])
  @@unique([jobId, categoryId])
}

// Teklif
model Offer {
  id          Int      @id @default(autoincrement())
  jobId       Int
  artisanId   Int      // User (usta)
  amount      Int      // ₺ (kuruş * 100)
  description String?
  duration    String?  // "3 saat", "1 gün" vb.
  status      String   @default("pending") // pending, accepted, rejected, withdrawn
  note        String?  // usta notu
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  job         Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  artisan     User     @relation("ArtisanOffers", fields: [artisanId], references: [id])
}

// İş zaman çizelgesi
model JobTimeline {
  id        Int      @id @default(autoincrement())
  jobId     Int
  status    String
  note      String?
  createdAt DateTime @default(now())

  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
}

// İş mesajları
model JobMessage {
  id        Int      @id @default(autoincrement())
  jobId     Int
  senderId  Int
  message   String
  fileUrl   String?  // dosya/sesli mesaj
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  sender    User     @relation(fields: [senderId], references: [id])
}

// Referans/Yorum (iş bazlı)
model JobReview {
  id        Int      @id @default(autoincrement())
  jobId     Int      @unique
  rating    Int      // 1-5
  comment   String?
  photos    String?  // JSON
  createdAt DateTime @default(now())

  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
}

// Ödeme
model Payment {
  id          Int      @id @default(autoincrement())
  jobId       Int
  customerId  Int
  artisanId   Int
  amount      Int      // ₺
  commission  Int      // platform komisyonu
  status      String   @default("escrow") // escrow, released, refunded, cancelled
  method      String?  // credit_card, bank_transfer, etc.
  paidAt      DateTime?
  releasedAt  DateTime?
  createdAt   DateTime @default(now())

  job         Job      @relation(fields: [jobId], references: [id])
  customer    User     @relation("CustomerPayments", fields: [customerId], references: [id])
  artisan     User     @relation("ArtisanPayments", fields: [artisanId], references: [id])
}

// Usta yetenek/sertifika
model ArtisanSkill {
  id          Int      @id @default(autoincrement())
  userId      Int
  categoryId  Int
  title       String?  // örn: "IKEA Mobilya Uzmanı"
  yearsExp    Int?
  certificate String?  // sertifika URL
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id])
  @@unique([userId, categoryId])
}

// Blog
model BlogPost {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  content     String   // markdown/HTML
  excerpt     String?
  coverImage  String?
  categoryId  Int?     // BlogCategory
  author      String?  // "Montajım Var Ekibi"
  tags        String   @default("[]") // JSON
  metaTitle   String?
  metaDesc    String?
  city        String?  // şehir spesifik SEO
  serviceSlug String?  // hizmet spesifik SEO
  isPublished Boolean  @default(false)
  viewCount   Int      @default(0)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category    BlogCategory? @relation(fields: [categoryId], references: [id])
}

model BlogCategory {
  id        Int        @id @default(autoincrement())
  name      String
  slug      String     @unique
  createdAt DateTime   @default(now())
  posts     BlogPost[]
}

// Premium üyelik planları (genişletilmiş)
model PremiumPlan {
  id            Int      @id @default(autoincrement())
  name          String   // Premium, Gold, Platinum
  slug          String   @unique
  price         Int      // aylık ₺
  features      String   // JSON
  maxOffers     Int      // aylık teklif hakkı
  profileBadge  String?  // rozet rengi
  priorityScore Int      // sıralama puanı
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
}

// Blog şehir sayfaları için
model CityServicePage {
  id        Int      @id @default(autoincrement())
  city      String
  service   String   // slug
  title     String
  content   String   // SEO metni
  metaTitle String?
  metaDesc  String?
  slug      String   @unique  // /city-service-slug
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Değişecek/Genişleyecek Mevcut Modeller

- **User**: `isPhoneVerified`, `identityVerified`, `bio`, `coverPhoto`, `completedJobs`
- **Profile**: `workingCities[]`, `serviceArea`, `hasInsurance`, `hasGuarantee`

---

## FAZ 2 — Ana Sayfa Yeniden Tasarımı + Kategori Sistemi

### Hero Bölümü (yeni anasayfa flow'u)

```
┌──────────────────────────────────────────────────────┐
│  🛠 Türkiye'nin Profesyonel Montaj Platformu          │
│                                                       │
│  Mobilya, Reklam, Stand, AVM, İnşaat, Elektrik,      │
│  Mekanik ve Endüstriyel Montaj Hizmetleri             │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐                    │
│  │  🟢 İş Ver   │  │  🔵 Usta Ol │                    │
│  └─────────────┘  └─────────────┘                    │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │  🔍 Hangi montaj hizmetini arıyorsunuz?      │    │
│  │  Örn: IKEA Mobilya, Klima, Tabela, Stand...  │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  Popüler: Mobilya · Klima · Tabela · Stand · AVM     │
└──────────────────────────────────────────────────────┘
```

### "İş Ver" Butonu → Yeni İş Oluşturma Formu
### "Usta Ol" Butonu → Kayıt/Usta profili oluştur

### 100+ Kategori Sistemi

Kategori ağacı (parent-child) ile organize edilecek:

```
Mobilya
  ├── IKEA Montajı
  ├── Koçtaş Mobilya
  ├── Vivense
  ├── Bellona
  ├── İstikbal
  ├── Özel Yapım Mobilya
  └── TV Ünitesi
Elektrik
  ├── Anahtar/Priz
  ├── Sigorta/Pano
  ├── Aydınlatma
  ├── Akıllı Ev
  └── Şantiye Elektrik
Mekanik Tesisat
Kaynak
Alçıpan
Seramik
Tabela/Reklam
  ├── Led Tabela
  ├── Led Ekran
  ├── Işıklı Harf
  └── Totem
Stand Kurulumu
  ├── Fuar Standı
  ├── AVM Standı
  └── Magaza Standı
AVM Montaj
  ├── Gece Montaj
  └── Mağaza Kurulum
Cephe
Cam
Çelik
PVC/Pencere
Klima
  ├── Split Klima
  ├── Multi Split
  └── VRF/VRV
Kamera/Güvenlik
Fiber/Network
Solar Enerji
Pergola
Çatı
Endüstriyel Makine
... (+100 kategori)
```

Her kategori kendi slug, meta title, meta desc ile SEO'da ayrı index alır.

---

## FAZ 3 — Teklif Sistemi

### Müşteri Akışı

```
1. "İş Ver" butonuna tıklar
2. Kategori seçer (Mobilya → IKEA)
3. Fotoğraf yükler (max 5)
4. Konum seçer (harita veya adres)
5. İş açıklaması yazar
6. Bütçe aralığı belirtir (opsiyonel)
7. "Teklif Al" butonu
   → Sistem uygun ustalara bildirim gönderir
   → Ustalar teklif gönderir
   → Müşteri gelen teklifleri karşılaştırır
   → Ustayı seçer
```

### Bildirim

- İş oluşturunca: push notification + email uygun kategorideki ustalara
- Yeni teklif gelince: müşteriye push notification
- Teklif kabul edilince: ustaya bildirim

---

## FAZ 4 — İş Takibi + Referans Sistemi

### İş Durumları

```
🟡 İş Bekliyor    → teklif bekleniyor
🔵 Usta Atandı    → teklif kabul edildi
🚶 Yolda          → usta yola çıktı
🛠 Montaj Başladı → iş başladı
✅ Tamamlandı     → iş bitti
💰 Ödeme Bekliyor → ödeme onayı bekleniyor
```

### Referans Sistemi

İş bitince müşteri:
- ⭐⭐⭐⭐⭐ puan verir
- Yorum yazar
- Fotoğraf yükler (iş öncesi/sonrası)

---

## FAZ 5 — Usta Profilleri + İletişim

### Usta Profilinde
- Fotoğraf + Kapak fotoğrafı
- Video (portfolyo)
- Sertifikalar
- Puan ortalaması
- Tamamlanan iş sayısı
- Çalıştığı şehirler
- Uzmanlık alanları (kategoriler)
- Referanslar (yorumlar)
- İletişim tercihleri

### Panel İçi Mesajlaşma
- Mevcut mesajlaşma genişletilecek
- Dosya paylaşımı
- Konum paylaşımı
- İş bazlı mesaj grupları

---

## FAZ 6 — SEO + Blog

### Şehir Bazlı Sayfalar

Her şehir + hizmet kombinasyonu için ayrı URL:
```
/istanbul-mobilya-montaji
/ankara-klima-montaji
/izmir-reklam-montaji
/bursa-stand-kurulumu
/antalya-cam-balkon
...
```

### Blog Sistemi
- 300+ makale hedefi
- Kategoriler
- SEO metadata
- Şehir + hizmet etiketleme

---

## FAZ 7 — Ödeme Sistemi

### Emanet (Escrow) Sistemi

```
Müşteri Öder → Para Emanette → İş Tamamlanır → Para Ustaya
```

- Müşteri kredi kartı/banka havalesi ile öder
- Para platformda emanette tutulur
- İş tamamlanınca müşteri onaylar → para ustaya aktarılır
- Anlaşmazlık durumunda admin müdahalesi
- Platform komisyonu kesilir (%X)

---

## FAZ 8 — Dashboard'lar + Premium

### Müşteri Paneli
- Aktif işler (durum bazlı)
- Geçmiş işler
- Gelen teklifler
- Mesajlar
- Faturalar
- Bütçe takibi

### Usta Paneli
- Bugünkü işler
- Kazanç (günlük/haftalık/aylık)
- Takvim
- Belgeler (fatura, sözleşme)
- Puan durumu

### Admin Paneli
- Toplam kullanıcı/usta/iş
- Bekleyen işler
- İptaller
- Gelir/komisyon raporları
- Anlaşmazlık yönetimi

### Premium Üyelik (3 seviye)

| Özellik | Premium | Gold | Platinum |
|---------|---------|------|----------|
| Aylık teklif hakkı | 20 | 100 | Sınırsız |
| Sıralama önceliği | Düşük | Orta | Yüksek |
| Profil rozeti | ✅ | ✅ Gold | ✅ Platinum |
| Öne çıkan profil | ❌ | Haftada 1 | Her gün |
| İstatistikler | Temel | Detaylı | Gelişmiş |
| Destek | Standart | Öncelikli | 7/24 |
| Fiyat (₺/ay) | 199 | 499 | 999 |

---

## FAZ 9 — AI Destekli Fiyat/İş Analizi

### Fotoğraf + AI
- Kullanıcı fotoğraf yükler
- AI ürünü tanır: "Bu IKEA PAX dolap"
- Tahmini kurulum süresi: "3 saat, 2 kişi"
- Tahmini fiyat: "5.500 ₺"
- Gerekli ekipman listesi

### Fiyat Hesaplama Parametreleri
- İş türü (kategori bazlı baz fiyat)
- Şehir (İstanbul %20 farklı, Anadolu farklı)
- Fotoğraf analizi (işin büyüklüğü)
- Metrekare
- Kat sayısı / Asansör
- İşin aciliyeti

---

## FAZ 10 — Kurumsal + Güven

### Kurumsal Çözümler Sayfası
- Türkiye geneli ekip
- Tek noktadan yönetim
- Faturalandırma
- Raporlama
- SLA garantisi
- Gece çalışması
- AVM kuralları
- Şantiye deneyimi

### Güven Unsurları
- Kimlik doğrulanmış ustalar
- Mesleki yeterlilik belgeleri
- Güvenli ödeme sistemi
- Sigortalı hizmet seçenekleri
- Müşteri değerlendirmeleri
- KVKK + kullanım sözleşmeleri

### Referans Logoları (Anasayfa)
"Bizimle Çalışan Firmalar" bandı

---

## FAZ 11 — CRM + Mobil

### CRM Entegrasyonu
- Her talep → CRM'de otomatik lead
- Teklif → fırsat
- Durum takibi
- Arama hatırlatma
- Email otomasyonu

### Mobil Uyumluluk
- Mevcut Expo WebView genişletilecek
- Usta uygulaması
- Müşteri uygulaması
- Yönetici paneli
- Aynı API'yi kullanacak

---

## Zaman Tahmini

| Faz | Süre (tahmini) | Bağımlılık |
|-----|----------------|------------|
| Faz 1: DB + Modeller | 1 oturum | Yok |
| Faz 2: Ana Sayfa + Kategoriler | 1-2 oturum | Faz 1 |
| Faz 3: Teklif Sistemi | 1-2 oturum | Faz 1-2 |
| Faz 4: İş Takibi + Referans | 1 oturum | Faz 1-3 |
| Faz 5: Usta Profilleri + İletişim | 1 oturum | Faz 1 |
| Faz 6: SEO + Blog | 1-2 oturum | Faz 1-2 |
| Faz 7: Ödeme | 1-2 oturum | Faz 1-4 |
| Faz 8: Dashboard + Premium | 1-2 oturum | Faz 1-5 |
| Faz 9: AI Analizi | 2-3 oturum | Faz 1-3 |
| Faz 10: Kurumsal + Güven | 1 oturum | Faz 2 |
| Faz 11: CRM + Mobil | 1-2 oturum | Faz 7 |

---

## Test Ortamı

**Yöntem**: Mevcut Pi'de `test.montajimvar.xyz` subdomain
- Nginx: yeni server block
- PM2: `montajimvar-test` process
- Ayrı port (3002)
- Ayrı .env (test DB varsa, yoksa aynı Neon DB)

Ya da local'de `npm run dev` ile test edip, onay alınca canlıya deploy.

---

## İlk Adım

**Faz 1'den başlayalım**: Veritabanı modellerini ekle, migration çalıştır, Prisma generate.
Onay al → Faz 2'ye geç.

---

> **Not**: Tüm Faz'lar aynı anda yapılmayacak. Her Faz sonunda test ortamında doğrulama yapılacak. Onay alınınca bir sonraki Faz'a geçilecek.
