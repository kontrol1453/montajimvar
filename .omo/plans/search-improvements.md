# Arama Bölümü Geliştirmeleri

## TL;DR
> **Summary**: Arama sayfasına 4 ana geliştirme: anlık debounce arama, aktif filtre etiketleri, mobil katlanabilir panel, sonuçlarda highlight
> **Deliverables**: `SearchForm.tsx` (yeni), `page.tsx` (güncelle), `SearchViewToggle.tsx` (güncelle), `CategoryFilter.tsx` (güncelle)
> **Effort**: Medium
> **Parallel**: YES - 2 waves
> **Critical Path**: CategoryFilter → SearchForm → page.tsx → SearchViewToggle

## Context
### Original Request
Arama bölümünü geliştir: anlık arama (debounce), aktif filtre etiketleri, mobil iyileştirme, sonuçlarda vurgulama.

### Interview Summary
Kullanıcı 4 geliştirmeyi de istedi. Hepsi SearchForm adlı yeni bir client component etrafında toplanıyor. Server-side data fetching aynen kalıyor.

## Work Objectives
### Core Objective
Arama deneyimini modernleştirmek: yazarken sonuçlar gelsin, aktif filtreler görünsün, mobilde rahat kullanılsın, eşleşen kelimeler vurgulansın.

### Deliverables
1. `src/components/SearchForm.tsx` — anlık arama + mobil toggle + aktif filtre etiketleri
2. `src/app/ara/page.tsx` — güncellenmiş form + SearchForm entegrasyonu
3. `src/components/SearchViewToggle.tsx` — highlight desteği
4. `src/components/CategoryFilter.tsx` — `onToggle` callback + `checked` (defaultChecked yerine)

### Definition of Done
- [ ] `?q=mobilya` yazınca 300ms sonra sayfa otomatik güncellenir (butona gerek kalmaz)
- [ ] Seçili kategoriler/şehir/puan etiket olarak gösterilir, çarpı ile kaldırılabilir
- [ ] Mobilde filtreler varsayılan gizlidir, "Filtreler" butonuyla açılır
- [ ] Aranan kelimeler sonuç kartlarında sarı/montaj renkli highlight edilir
- [ ] Build hatasız geçer

### Must Have
- Debounce: text input 300ms, select/checkbox anlık
- URL güncellenirken `sayfa` parametresi sıfırlanır
- Highlight: companyName, description, category.name alanlarında

### Must NOT Have
- Sayfa tamamen client-side olmayacak (server component kalıyor)
- Highlight regex özel karakter patlamasına karşı korumalı

## Verification Strategy
- Test: playwright ile yazarken sonuçların otomatik güncellendiğini doğrula
- Test: highlight edilen metinleri snapshot'ta kontrol et
- Test: mobil toggle'ın çalıştığını doğrula

## Execution Strategy

### Wave 1 (foundation)
- CategoryFilter: `onToggle` callback + `checked` prop
- SearchForm: yeni component (debounce, tags, mobile toggle)

### Wave 2 (integration)
- page.tsx: form'u SearchForm ile değiştir
- SearchViewToggle: highlight ekle

## TODOs

- [x] 1. CategoryFilter - onToggle callback ekle, defaultChecked → checked yap

  **What to do**:
  - Interface'e `onToggle?: (slug: string) => void` ekle
  - `defaultChecked={checked}` → `checked={checked}` yap
  - Checkbox'a `onChange={() => onToggle?.(cat.slug)}` ekle
  - Tailwind class'larını, yapıyı aynen koru

  **Must NOT do**: Görsel değişiklik yapma, CSS class'larını değiştirme

  **Files**: `src/components/CategoryFilter.tsx`

  **Acceptance Criteria**:
  - [ ] `onToggle` callback verilince checkbox click'te çağrılır
  - [ ] `onToggle` verilmezse hata atmaz (opsiyonel)
  - [ ] Seçili kategoriler URL'deki gibi işaretlenir

  **Commit**: YES | Message: `feat: add onToggle callback to CategoryFilter`

- [ ] 2. SearchForm - client component oluştur

  **What to do**:
  - `src/components/SearchForm.tsx` oluştur, `"use client"` ile başla
  - Props: `categories`, `initialSehir`, `initialQ`, `initialMinPuan`, `initialSiralama`, `initialSelectedSlugs`
  - `useRouter`, `useSearchParams`, `usePathname` ile URL yönetimi
  - Text input: local state + debounce (300ms setTimeout/clearTimeout)
  - Select'ler (şehir, puan, sıralama): onChange → anlık URL güncelleme
  - CategoryFilter'a `onToggle` ver, checkbox değişince URL güncelle
  - Her URL güncellemede `sayfa` parametresini sil (sayfa 1'e dön)
  - **Aktif filtre etiketleri**: searchParams'a bak, seçili filtreleri badge olarak göster:
    - `q` varsa: `"arama"` etiketi
    - `sehir` varsa: şehir adı etiketi
    - `minPuan` varsa: `"4+ Puan"` etiketi
    - `kategoriler` varsa: her slug için kategori adını bul, etiket göster
    - Her etiketin yanında çarpı (×) işareti, tıklayınca ilgili param'ı sil
  - **Mobil toggle**: 
    - Mobile `md:hidden` bir "Filtreler" butonu (üstte)
    - Filtre içeriği `hidden md:block` / açıkken `block md:block`
    - Açıkken toggle buton metni "Filtreleri Gizle" olsun
  - Filtrele butonlarını **kaldır** (debounce zaten otomatik)
  - "Filtreleri Temizle" linkini bırak (`<Link href="/ara">`)
  - UI stilleri mevcut page.tsx'deki form stilleriyle aynı olmalı (bg-dark-card, border-dark-border, vs)

  **Must NOT do**: Server-side data fetching'i değiştirme; form validation ekleme

  **Files**: `src/components/SearchForm.tsx` (yeni)

  **Acceptance Criteria**:
  - [ ] Text input'a yazınca 300ms sonra URL güncellenir
  - [ ] Select değişince anlık URL güncellenir
  - [ ] Kategori checkbox değişince anlık URL güncellenir
  - [ ] URL güncellenince sayfa 1'e döner
  - [ ] Aktif filtre etiketleri doğru görünür
  - [ ] Etiket çarpısı ilgili filtreyi kaldırır
  - [ ] Mobil toggle açılıp kapanır
  - [ ] "Filtreleri Temizle" tüm parametreleri siler

  **Commit**: YES | Message: `feat: add SearchForm with debounce, tags, mobile toggle`

- [ ] 3. page.tsx - SearchForm entegrasyonu

  **What to do**:
  - `import SearchForm from "@/components/SearchForm"` ekle
  - `import Link from "next/link"` ve `import { TURKISH_CITIES }` hala lazım mı kontrol et (hayır, SearchForm içinde)
  - Form bloğunun tamamını (l.133-179) şununla değiştir:
    ```tsx
    <SearchForm
      categories={categories}
      initialSehir={sehir}
      initialQ={q}
      initialMinPuan={minPuan}
      initialSiralama={siralama}
      initialSelectedSlugs={selectedSlugs}
    />
    ```
  - `RATING_OPTIONS` sabitini sil (SearchForm içinde tanımlı)
  - Gereksiz import'ları temizle

  **Must NOT do**: Server-side query mantığını değiştirme; data fetching'i değiştirme

  **Files**: `src/app/ara/page.tsx`

  **Acceptance Criteria**:
  - [ ] Build hatasız geçer
  - [ ] Sayfa ilk yüklendiğinde server-side render edilir
  - [ ] Form aynı görsel düzende görünür

  **Commit**: YES | Message: `refactor: replace form with SearchForm in search page`

- [ ] 4. SearchViewToggle - highlight ekle

  **What to do**:
  - `q` prop'unu kullanarak highlight fonksiyonu yaz:
    ```tsx
    function highlightText(text: string, query: string) {
      if (!query || !text) return text;
      const words = query.trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) return text;
      const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);
      // use non-global regex to avoid lastIndex state issue
      const testRe = new RegExp(`^(${escaped})$`, 'i');
      return parts.map((part, i) =>
        testRe.test(part)
          ? <mark key={i} className="bg-montaj/30 text-white rounded px-0.5">{part}</mark>
          : part
      );
    }
    ```
  - `profile.companyName`'i `<h3>` içinde highlight'la
  - `profile.description`'ı `<p>` içinde highlight'la
  - `profile.category.name` badge metnini highlight'la
  - `pc.category.name` badge metinlerini highlight'la
  - `city` span'ini highlight'la
  - Her alan için `highlightText(field, q)` çağır
  - Badge'lerde highlight: `<Badge>...</Badge>` içinde metin kısmını highlight'la

  **Must NOT do**: Kart yapısını bozma; link çalışmasını etkileme

  **Files**: `src/components/SearchViewToggle.tsx`

  **Acceptance Criteria**:
  - [ ] `q` boşken highlight yapılmaz (normal metin)
  - [ ] `q` doluysa eşleşen kelimeler `<mark>` ile sarılır
  - [ ] Özel karakterler (+, ., *) hataya yol açmaz
  - [ ] Build hatasız geçer

  **Commit**: YES | Message: `feat: highlight search terms in results`

- [ ] 5. Build + PI deploy + test

  **What to do**:
  - `npm run build` yap
  - Build hatasızsa `pscp` ile PI'a dosyaları kopyala:
    - `src/components/CategoryFilter.tsx`
    - `src/components/SearchForm.tsx`
    - `src/app/ara/page.tsx`
    - `src/components/SearchViewToggle.tsx`
  - PI'da `npm run build` yap
  - `pm2 restart montajimvar` yap
  - Playwright ile test et:
    - Anlık arama: input'a yaz, 300ms sonra URL güncellenir
    - Select değişince URL anlık güncellenir
    - Highlight: `?q=mobilya` ile sonuçlarda highlight var
    - Mobil toggle: sayfayı 375px'de aç, filtreler gizli, butonla açılır
    - Filtre etiketleri: seçili kategoriler badge olarak görünür, çarpı ile kalkar

  **Files**: (deploy)

  **Acceptance Criteria**:
  - [ ] Build hatasız
  - [ ] Tüm özellikler canlıda çalışır

  **Commit**: NO

## Final Verification Wave
- [ ] F1. Build hatasız (local + PI)
- [ ] F2. Playwright test: debounce çalışıyor
- [ ] F3. Playwright test: highlight görünüyor
- [ ] F4. Playwright test: mobil toggle çalışıyor

## Commit Strategy
4 commit: CategoryFilter → SearchForm → page.tsx → SearchViewToggle

## Success Criteria
- Arama kutusuna yazınca beklemeden sonuçlar güncellenir
- Hangi filtrelerin aktif olduğu badge'lerle gösterilir
- Mobilde filtreler panel içinde gizlenir, gerektiğinde açılır
- Aranan kelimeler sonuçlarda sarı renkle vurgulanır
