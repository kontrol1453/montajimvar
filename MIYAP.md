
# Montajım Var - Mimari Plan

## Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS (mobile-first responsive)
- **Database**: SQLite (geliştirme) → PostgreSQL (canlı)
- **ORM**: Prisma
- **Auth**: NextAuth.js (email + şifre, JWT)
- **Deployment**: Vercel (önerilen)

## Veritabanı Şeması

```
User (id, name, email, password, phone, role, city, createdAt)
  └─ role: CUSTOMER | ASSEMBLER | MANUFACTURER
  └─ profile → Profile (opsiyonel, montajcı/üretici için)

Profile (id, userId, companyName, description, categoryId, city,
         address, phone, website, logo, isVerified, createdAt)
  └─ category → Category

Category (id, name, slug, icon, createdAt)

Message (id, senderId, receiverId, subject, content, isRead, createdAt)
  └─ senderId → User
  └─ receiverId → User
```

## Sayfa Yapısı

| Route | Sayfa | Açıklama |
|-------|-------|----------|
| `/` | Anasayfa | Arama, öne çıkan firmalar, nasıl çalışır |
| `/auth/giris` | Giriş | Email + şifre girişi |
| `/auth/kayit` | Kayıt | Rol seçimi ile kayıt |
| `/ara` | Arama | Şehir + kategori filtreli firma listesi |
| `/firma/[id]` | Firma Detay | Profil, iletişim, mesaj gönder |
| `/dashboard` | Panel | Kullanıcı tipine göre panel |
| `/dashboard/mesajlar` | Mesajlar | Gelen/giden mesaj kutusu |
| `/dashboard/profil` | Profil Düzenle | Firma profili düzenleme |

## Bileşen Mimarisi

```
components/
├── layout/       Navbar, Footer, Container
├── ui/           Button, Input, Card, Modal, Badge
├── auth/         LoginForm, RegisterForm
├── search/       FilterBar, CompanyCard, SearchResults
├── profile/      CompanyProfile, ContactInfo
└── messages/     MessageList, MessageThread, MessageCompose
```

## Uygulama Akışı

1. **Ziyaretçi** → Anasayfa → Arama yap → Firma detayını gör → İletişime geçmek için kaydol
2. **Müşteri** → Kaydol → Firma ara → Firma detayını gör → Mesaj gönder
3. **Montajcı/Üretici** → Kaydol → Firma profili oluştur → Mesajları yönet → Müşterilerle iletişim

## Implementasyon Sırası

1. Proje kurulumu (Next.js + Tailwind + Prisma + NextAuth)
2. Prisma şeması + migration
3. Auth sistemi (login/register)
4. Paylaşımlı UI bileşenleri
5. Anasayfa
6. Arama sayfası (filtrelerle)
7. Firma profili sayfası
8. Kullanıcı paneli (dashboard)
9. Mesajlaşma sistemi
10. Seed verileri (kategoriler, şehirler)

