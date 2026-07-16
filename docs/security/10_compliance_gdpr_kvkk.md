# GDPR & KVKK Uyumluluğu

## Mevcut Durum

### Yasal Dokümanlar (Web Sayfaları)

| Sayfa | İçerik | Durum |
|-------|--------|-------|
| `/gizlilik` | Gizlilik politikası | ✓ |
| `/kvkk` | KVKK aydınlatma metni | ✓ |
| `/on-bilgilendirme` | Ön bilgilendirme | ✓ |
| `/cerez` | Çerez politikası | ✓ |
| `/kullanim-kosullari` | Kullanım koşulları | ✓ |
| `/guvenlik` | Güvenlik politikası | ✓ |

### Çerez Yönetimi

| Bileşen | Dosya | Durum |
|---------|-------|-------|
| Cookie banner | `src/components/CookieBanner.tsx` | ✓ |
| Google Analytics | `src/components/GoogleAnalytics.tsx` | ✓ (consent-gated) |
| Microsoft Clarity | Layout'ta | ✓ (consent-gated) |

## Toplanan Veriler

### PII (Personal Identifiable Information)

| Veri | Kaynak | KVKK Kategorisi | Saklama |
|------|--------|-----------------|---------|
| Ad soyad | Kayıt formu | Kimlik | Hesap aktif + 30 gün |
| E-posta | Kayıt/Google | İletişim | Hesap aktif + 30 gün |
| Telefon | Profil | İletişim | Hesap aktif + 30 gün |
| Şehir | Profil | Konum | Hesap aktif + 30 gün |
| Şifre (hash) | Kayıt | Kimlik (anonymized) | Hesap aktif + 30 gün |
| Avatar (URL) | Google/Upload | Özel nitelikli | Hesap silindiğinde |
| IP adresi | Rate limit / Sentry | Konum | 24 saat (memory) |
| User-Agent | Sentry | Teknik | 90 gün (Sentry) |
| Mesaj içeriği | Chat | İletişim | 1 yıl (P2) |
| Yorum içeriği | Review | Düşünce | Kullanıcı silene kadar |
| Ödeme bilgisi | Payment | Finansal | 5 yıl (Vergi) |

### Özel Nitelikli Kişisel Veri

Şu anda **toplanmıyor**:
- Sağlık bilgisi
- Irk/etnik köken
- Siyasi düşünce
- Din
- Cinsel yaşam
- Biyometrik veri

## Veri Sahibi Hakları (KVKK Madde 11)

| Hak | Endpoint | Durum |
|-----|----------|-------|
| Bilgi alma | `/gizlilik`, `/kvkk` | ✓ |
| Erişim | `/api/user` | ✓ |
| Düzeltme | `/api/user` (profil güncelleme) | ✓ |
| Silme | **YOK** | ❌ P2 |
| İşlemenin kısıtlanması | **YOK** | ❌ P2 |
| Aktarım | **YOK** | ❌ P2 (veri portability) |
| İtiraz | **YOK** | ❌ P2 |

### P2: Veri Silme Endpoint

```typescript
// POST /api/user/delete
// 1. Kullanıcıyı soft-delete (deletedAt = now)
// 2. 30 gün sonra cron job → hard-delete
// 3. Cascade: messages, reviews, favorites, profile, profileImages
// 4. Supabase storage'dan dosyaları sil
// 5. Audit log
```

## Veri İşleme Amaçları

| Amaç | Yasal Dayanak | Veri |
|------|--------------|------|
| Üyelik | Sözleşme | Ad, e-posta, şifre |
| Profil oluşturma | Açık rıza | Telefon, şehir, avatar |
| İlan yönetimi | Sözleşme | İş detayları |
| Mesajlaşma | Açık rıza | Mesaj içeriği |
| Ödeme | Yasal yükümlülük | Kart bilgisi (3. taraf) |
| Analitik | Açık rıza | Cookie, IP, UA |
| Güvenlik | Meşru menfaat | IP (rate limit), Sentry |

## Veri Aktarımı

| Alıcı | Veri | Ülke | KVKK Madde |
|-------|------|------|------------|
| Neon (Postgres) | Tüm veri | EU/US | Yurtdışına aktarım |
| Supabase | Görsel | US | Yurtdışına aktarım |
| Google (OAuth/Analytics) | E-posta,analytics | US | Yurtdışına aktarım |
| Microsoft (Clarity) | Analytics | US | Yurtdışına aktarım |
| Sentry | Hata + IP | US/EU | Yurtdışına aktarım |

**P2 öneri**: Yurtdışı veri aktarım izinleri KVKK Madde 9 kapsamında değerlendirilmeli.

## Çerez Kategorileri

| Kategori | Çerez | TTL | Consent |
|----------|-------|-----|---------|
| Zorunlu | `next-auth.session-token` | 30 gün | Gerekmez |
| Zorunlu | `next-auth.csrf-token` | session | Gerekmez |
| Analitik | `_ga`, `_gid` | 2 yıl | Gerekli |
| Analitik | `CLARITY_*` | 1 yıl | Gerekli |
|Performans | Sentry cookie | session | Gerekmez |

## P2 Eylemler

- [ ] `/api/user/delete` endpoint (KVKK silme hakkı)
- [ ] `/api/user/export` endpoint (veri portability — JSON/CSV)
- [ ] Veri aktarım sözleşmeleri (DPA) Neon/Supabase/Google ile
- [ ] KVKK veri envanteri güncelleme
- [ ] Çerez politikası TTL güncellemesi
- [ ] Çocuk koruması (18 yaş altı) — yaş doğrulama
- [ ] Veri işleme kayıt sistemi (VERBİS kaydı)
