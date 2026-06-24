# E-posta Doğrulama + Üyelik Geliştirmeleri

## TL;DR
> **Summary**: Kayıt sonrası e-posta doğrulama akışını düzelt, admin panelinde onay durumunu göster, üyelik sayfasını geliştir
> **Deliverables**: 5 dosya değişikliği + PI .env güncelleme
> **Effort**: Medium
> **Parallel**: YES - 2 waves
> **Critical Path**: kayit/route.ts → kayit/page.tsx → admin/kullanicilar → dashboard/uyelik

## Context
### Original Request
1. E-posta ile kayıt olanlara doğrulama e-postası gönder, onaylayınca giriş yapabilsin
2. Admin panelinde e-posta onay durumu gösterilsin
3. Üyelik bölümünde geliştirme

### Mevcut Durum
- Prisma User modelinde `emailVerified`, `emailVerificationToken`, `emailVerificationExpires` alanları var ✅
- `/api/auth/kayit` zaten token oluşturup e-posta gönderiyor ✅
- `/api/auth/email-verify/[token]` token doğrulama endpoint'i var ✅
- `/auth/email-dogrula` doğrulama sayfası var ✅
- `auth.ts`'de `CredentialsProvider` `emailVerified` kontrolü yapıyor ✅
- SMTP çalışıyor (daha önce test edildi) ✅

### Sorunlar
1. **Kayıt sayfası**: Kayıt sonrası auto-login yapmaya çalışıyor, `emailVerified=false` olduğu için auth.ts hata fırlatıyor, kullanıcı neden giriş yapamadığını anlamıyor
2. **PI .env**: `NEXT_PUBLIC_APP_URL` tanımlı değil, doğrulama linki `localhost:3000` üretiyor
3. **Admin paneli**: `emailVerified` sütunu yok
4. **kayit/route.ts**: `NEXT_PUBLIC_APP_URL` fallback'i yok (`NEXTAUTH_URL` da kullanılmalı)

## Work Objectives
### Core Objective
E-posta doğrulama akışını uçtan uca çalışır hale getirmek ve üyelik yönetimini geliştirmek.

### Definition of Done
- [ ] Kayıt sonrası auto-login kalktı, başarı mesajı + "e-postanı kontrol et" yönlendirmesi var
- [ ] E-posta doğrulama linki `montajimvar.xyz` domain'ini kullanıyor
- [ ] Admin panelinde onay durumu (✓/✗) görünüyor
- [ ] Üyelik/dashboard sayfasında hesap durumu (onaylı/onaysız) görünüyor
- [ ] Build + PI deploy başarılı

## Execution Strategy

Wave 1: API + .env düzeltmeleri
Wave 2: UI değişiklikleri (kayıt, admin, üyelik)

## TODOs

- [ ] 1. kayit/route.ts - NEXTAUTH_URL fallback ekle

  **What to do**:
  - `kayit/route.ts` line 67: `const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";`
  - `verifyUrl`'de `${appUrl}` kullan

  **Files**: `src/app/api/auth/kayit/route.ts`

  **Acceptance Criteria**:
  - [ ] Doğrulama linki `montajimvar.xyz` domain'i ile oluşur
  - [ ] Build hatasız

  **Commit**: YES | Message: `fix: use NEXTAUTH_URL fallback for verification link`

- [ ] 2. PI .env - NEXT_PUBLIC_APP_URL ekle

  **What to do**:
  - PI'da `/home/pi/montajimvar_app/.env` dosyasına şu satırı ekle:
    ```
    NEXT_PUBLIC_APP_URL=https://montajimvar.xyz
    ```
  - `pm2 restart montajimvar --update-env` yap

  **Files**: `/home/pi/montajimvar_app/.env`

  **Acceptance Criteria**:
  - [ ] `grep APP_URL /home/pi/montajimvar_app/.env` çıktı verir
  - [ ] PM2 restart edilir

- [ ] 3. kayit/page.tsx - auto-login kaldır, başarı ekranı ekle

  **What to do**:
  - `import { useRouter } from "next/navigation"` kaldır (kullanılmıyor)
  - `import { signIn } from "next-auth/react"` kalsın (Google butonu için)
  - `router` state değişkenini kaldır
  - `const [success, setSuccess] = useState(false);` ekle
  - `handleSubmit` içinde auto-login bloğunu kaldır, yerine `setSuccess(true)` koy
  - Return kısmında `success` true ise başarı ekranı göster:
    ```tsx
    if (success) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-lg text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Hesabınız Oluşturuldu!</h1>
            <p className="text-muted-text mb-6">
              E-posta adresinize doğrulama linki gönderildi. Lütfen e-postanızı kontrol edin ve hesabınızı aktifleştirin.
            </p>
            <Link
              href="/auth/giris"
              className="inline-flex items-center gap-2 px-6 py-3 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition font-medium"
            >
              Giriş Yap
            </Link>
          </Card>
        </div>
      );
    }
    ```
  - Başarı ekranını form'dan ÖNCE kontrol et (`if (success) return ...`)

  **Must NOT do**: Google Sign In butonunu bozma

  **Files**: `src/app/auth/kayit/page.tsx`

  **Acceptance Criteria**:
  - [ ] Kayıt sonrası auto-login denenmez (hata almaz)
  - [ ] Kayıt sonrası başarı mesajı + "Giriş Yap" butonu gösterilir
  - [ ] Google ile kayıt hala çalışır

  **Commit**: YES | Message: `fix: show success screen after registration instead of auto-login`

- [ ] 4. admin/kullanicilar/page.tsx - emailVerified sütunu ekle

  **What to do**:
  - Prisma sorgusuna `emailVerified: true` ekle (select içinde)
  - Tablo head'e `<th>Onay</th>` sütunu ekle (lg:table-cell)
  - Her satırda `emailVerified` durumuna göre:
    - `true`: yeşil ✓ (Badge variant="success" ile "Onaylı")
    - `false`: kırmızı ✗ (Badge variant="default" ile "Onaysız" veya gri)
  - Sütunu `hidden lg:table-cell` yap

  **Files**: `src/app/admin/kullanicilar/page.tsx`

  **Acceptance Criteria**:
  - [ ] Admin kullanıcılar sayfasında onay durumu görünür
  - [ ] Onaylılar yeşil ✓, onaysızlar kırmızı ✗

  **Commit**: YES | Message: `feat: show email verification status in admin users page`

- [ ] 5. Dashboard/üyelik sayfası - hesap durumu göster

  **What to do**:
  - Önce dashboard/uyelik sayfasını oku: `src/app/dashboard/uyelik/page.tsx`
  - Mevcut içeriği koru, üst kısma hesap durumu kartı ekle:
    - Kullanıcının `emailVerified` durumunu göster (server component'ta session'dan veya Prisma'dan al)
    - Onaylıysa: yeşil badge "E-posta Doğrulanmış"
    - Onaysızsa: kırmızı badge "E-posta Doğrulanmamış" + "Doğrulama E-postası Gönder" butonu
    - "Doğrulama E-postası Gönder" butonu `/api/auth/email-verify/resend` endpoint'ine istek atar
  - NOT: Eğer `/api/auth/email-verify/resend` endpoint'i yoksa, sadece durum göster, buton koyma veya ayrı bir task'ta endpoint'i oluştur

  **Files**: `src/app/dashboard/uyelik/page.tsx`
  **Optional**: `src/app/api/auth/email-verify/resend/route.ts` (yeniden gönderme endpoint'i)

  **Acceptance Criteria**:
  - [ ] Üyelik sayfasında e-posta onay durumu görünür
  - [ ] Onaysız kullanıcıya durum bildirilir

  **Commit**: YES | Message: `feat: show email verification status in membership page`

- [ ] 6. Build + PI deploy + test

  **What to do**:
  - `npm run build` yap
  - Hata varsa düzelt
  - pscp ile PI'a kopyala: kayit/route.ts, kayit/page.tsx, admin/kullanicilar/page.tsx, dashboard/uyelik/page.tsx
  - PI'da build yap
  - PI .env'ye NEXT_PUBLIC_APP_URL ekle
  - pm2 restart montajimvar --update-env
  - Test:
    1. `/auth/kayit` sayfasında kayıt ol, başarı mesajı gör
    2. E-posta gelmiş mi kontrol et (console.log ile)
    3. Doğrulama linkine tıkla, onaylandı mesajı gör
    4. Giriş yap, dashboard'a eriş
    5. Admin panelinde onay durumunu gör
    6. Üyelik sayfasında durumu gör

  **Files**: (deploy)

  **Acceptance Criteria**:
  - [ ] Tüm akış uçtan uca çalışır
  - [ ] Build hatasız

  **Commit**: NO

## Final Verification Wave
- [ ] F1. Kayıt → başarı mesajı → e-posta → doğrulama → giriş akışı çalışıyor
- [ ] F2. Admin panelinde onay durumu görünüyor
- [ ] F3. Üyelik sayfasında durum görünüyor
- [ ] F4. Google ile kayıt hala çalışıyor
