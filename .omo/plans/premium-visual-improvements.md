# Premium Üyelik Görsel İyileştirme

## TL;DR
> **Summary**: Dashboard/üyelik sayfasının görsel tasarımını ve UX'ini iyileştir
> **Deliverables**: 1 dosya (page.tsx) + isteğe bağlı CSS değişiklikleri
> **Effort**: Quick
> **Parallel**: NO

## Context
### Mevcut Durum
- `dashboard/uyelik/page.tsx` — düz listeleme, sade plan kartları
- Plan kartları: border + badge + features + SubscribeButton
- Aktif üyelik gösterimi: basit metin + yeşil/kırmızı "Aktif/Süresi Doldu"

### Yapılacaklar
1. Hero banner — sayfa başlığı altında görsel üst bölüm
2. Plan kartları — daha modern tasarım, hover efektleri
3. "En Popüler" rozeti — en avantajlı plana özel vurgu
4. Fiyat gösterimi — büyütülmüş, belirgin fiyat
5. Aktif üyelik kartı — kalan gün sayacı, ilerleme çubuğu
6. Mobil düzen iyileştirmeleri

## TODOs

- [ ] 1. dashboard/uyelik/page.tsx — görsel iyileştirme

  **What to do**:
  Aşağıdaki değişiklikleri sırayla yap:

  ### 1.1 Hero Banner (başlık altı)
  Mevcut `<h1>`'den sonra, email badge'den önce bir hero banner ekle:
  ```tsx
  {/* Hero Banner */}
  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-montaj/20 via-dark-card to-purple-900/20 border border-montaj/10 p-8 mb-8">
    <div className="relative z-10">
      <h1 className="text-3xl font-bold text-white mb-2">Üyelik & Abonelik</h1>
      <p className="text-muted-text">
        Premium üyeliğe geçerek firmanızı öne çıkarın, daha fazla müşteriye ulaşın.
      </p>
    </div>
    {/* Decorative elements */}
    <div className="absolute -top-6 -right-6 w-32 h-32 bg-montaj/10 rounded-full blur-2xl" />
    <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
  </div>
  ```
  > Mevcut `<h1>` satırını (`<h1 className="text-2xl...">Üyelik & Abonelik</h1>`) KALDIR, hero banner içine taşı.

  ### 1.2 EmailVerifyBadge container
  EmailVerifyBadge'in sarmalayıcı `div.mb-6`'sına daha ince bir stil ver:
  ```tsx
  <div className="mb-6">
    <EmailVerifyBadge ... />
  </div>
  ```
  (EmailVerifyBadge zaten kendi kart stilinde, container sadece spacing)

  ### 1.3 Active Membership Card — kalan gün sayacı
  Mevcut `profile?.subscription || profile?.premiumUntil ? (...)` bloğunu aşağıdakiyle değiştir.
  **Mantık**: premiumUntil varsa kalan gün hesapla, bir progress bar göster.

  ```tsx
  {/* Current subscription */}
  {(profile?.subscription || profile?.premiumUntil) ? (
    <div className="bg-dark-card rounded-xl border border-montaj/20 p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Mevcut Üyeliğiniz</h2>
          <div className="flex items-center gap-2">
            <PremiumBadge
              label={profile.subscription?.badgeLabel || "Premium"}
              color={profile.subscription?.badgeColor || "amber"}
            />
            {profile?.premiumUntil && new Date(profile.premiumUntil) > new Date() ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Süresi Doldu
              </span>
            )}
          </div>
        </div>
        {profile?.subscription && (
          <span className="text-2xl font-bold text-montaj">
            {profile.subscription.name}
          </span>
        )}
      </div>
      {profile?.premiumUntil && (
        <>
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sub-text">Kalan Süre</span>
              <span className="text-white font-medium">
                {/* premiumUntil mevcut, createdAt'dan hesaplama yap */}
                {(() => {
                  const now = new Date();
                  const end = new Date(profile.premiumUntil!);
                  const totalMs = end.getTime() - new Date(profile.createdAt || now).getTime();
                  const remainingMs = end.getTime() - now.getTime();
                  const pct = totalMs > 0 ? Math.max(0, Math.round((remainingMs / totalMs) * 100)) : 0;
                  const days = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
                  return (
                    <>
                      <span>{days} gün</span>
                    </>
                  );
                })()}
              </span>
            </div>
            {(() => {
              const now = new Date();
              const end = new Date(profile.premiumUntil!);
              const totalMs = end.getTime() - new Date(profile.createdAt || now).getTime();
              const remainingMs = end.getTime() - now.getTime();
              const pct = totalMs > 0 ? Math.max(0, Math.round((remainingMs / totalMs) * 100)) : 0;
              return (
                <div className="w-full h-2 bg-dark-section rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-montaj to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-montaj/20 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-montaj" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Henüz Üyeliğiniz Yok</h2>
          <p className="text-sm text-sub-text mt-1">
            Premium üyeliğe geçerek firmanızı öne çıkarın, daha fazla müşteriye ulaşın.
          </p>
        </div>
      </div>
    </div>
  )}
  ```

  ### 1.4 Plan Cards — iyileştirilmiş kart tasarımı
  Plan kartlarının `div`'ini aşağıdaki gibi güncelle:

  ```tsx
  <div
    key={plan.id}
    className={`relative rounded-xl border p-6 flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-montaj/5 ${
      plan.price > 0
        ? "bg-dark-card border-dark-border hover:border-montaj/40"
        : "bg-dark-card border-dark-border"
    } ${isCurrentPlan ? "ring-2 ring-montaj border-montaj/50" : ""}`}
  >
    {/* "En Popüler" rozeti - en pahalı plana veya ortanca plana koy */}
    {plan.price > 0 && plan.price === Math.max(...plans.filter(p => p.price > 0).map(p => p.price)) && (
      <div className="absolute -top-3 right-4">
        <span className="px-3 py-1 bg-gradient-to-r from-montaj to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
          En Popüler
        </span>
      </div>
    )}
    ...
  </div>
  ```

  ### 1.5 Plan içi düzenlemeler (kart içindeki içerik)
  - `h3`'ü `text-xl` → `text-2xl` yap
  - Fiyat `text-3xl` → `text-4xl font-extrabold` yap
  - `SubscribeButton`'a `className="mt-auto"` ekle (hata varsa `disabled` durumuna göre ayarla)
  - Feature listesine `text-sm` → `text-sm text-muted-text` olarak kalabilir, ama icon'ları biraz daha belirgin yap (strokeWidth={2.5})

  ### 1.6 "Ücretsiz" plan için farklı stil
  `plan.price === 0` olan plan için:
  - Border: `border-dark-border` (zaten öyle, değiştirme)
  - Badge yoksa ekleme
  - Arka plan: `bg-dark-card` devam, `hover:bg-dark-section` ekle

  ### 1.7 CUSTOMER uyarısı
  Mevcut `!roles.some(...)` bloğunu aşağıdaki gibi daha görünür yap:
  ```tsx
  {!roles.some((r) => ["ASSEMBLER", "MANUFACTURER"].includes(r)) && (
    <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg text-center">
      <p className="text-sm text-blue-300">
        <span className="font-medium">Bilgi:</span> Premium üyelik sadece firma sahipleri (Montajcı / Üretici) içindir. 
        Önce firma profili oluşturun.
      </p>
    </div>
  )}
  ```

  **Files**: `src/app/dashboard/uyelik/page.tsx`

  **Acceptance Criteria**:
  - [ ] Hero banner görsel olarak dikkat çekici, gradient ve blur efektli
  - [ ] Aktif üyelik kartında progress bar + kalan gün gösterimi var
  - [ ] "En Popüler" rozeti en yüksek fiyatlı planda görünüyor
  - [ ] Kart hover efektleri çalışıyor (border renk değişimi + gölge)
  - [ ] Sayfa mobilde düzgün görünüyor
  - [ ] Build hatasız

  **QA Scenarios**:
  ```
  Scenario: Hero banner görünüyor
    Tool: Bash
    Steps: npm run build
    Expected: Build successful
    Evidence: (build output)

  Scenario: Plan kartları düzgün render
    Tool: Bash
    Steps: Sayfayı curl ile kontrol et, 200 dönüyor
    Expected: HTTP 200
  ```

  **Commit**: YES | Message: `feat: visual improvements to premium membership page`

- [ ] 2. Build + PI deploy

  **What to do**:
  - `npm run build` yap
  - pscp ile PI'a kopyala: `src/app/dashboard/uyelik/page.tsx`
  - PI'da build yap
  - pm2 restart montajimvar

  **Files**: `src/app/dashboard/uyelik/page.tsx`

  **Acceptance Criteria**:
  - [ ] Build hatasız
  - [ ] PI deploy başarılı
  - [ ] Site live

  **Commit**: NO

## Final Verification
- [ ] F1. Hero banner + gradient efektler görünüyor
- [ ] F2. Aktif üyelik progress bar + kalan gün
- [ ] F3. "En Popüler" rozeti
- [ ] F4. Hover efektleri çalışıyor
