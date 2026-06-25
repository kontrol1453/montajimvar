# Montajım Var - iOS Mobil Uygulama Planı

## 1. Executive Summary
Montajım Var web platformu için **React Native + Expo** tabanlı cross-platform mobil uygulama geliştirilecek. Mevcut Next.js API'leri doğrudan kullanılacak, NextAuth JWT tabanlı kimlik doğrulama sistemi native mobil ortamda yeniden implemente edilecek. MVP kapsamında kullanıcılar firmaları görüntüleyebilecek, favori sistemini kullanabilecek, mesajlaşabilecek. Admin Rolleri de NativeSwift/Obj-C vs - React Native ile çoktan.

## 2. Teknoloji Seçimi ve Gerekçesi

| Kriter | React Native + Expo | Flutter | Swift (Native) |
|--------|---------------------|---------|----------------|
| **Geliştirme Süresi** | Kısa (mevcut React bilişleri) | Orta | Uzun |
| **API Paylaşımı** | Tamamen mümkün (aynı backend) | API çevirisi gerekir | Tamamen mümkün |
| **Takım Yetkinliği** | React biliyorlarsak avantaj | Flutter bilmek gerekir | iOS dışı için ikinci uygulama |
| **App Store Dağıtım** | Standard (EAS Build) | Standard | Standard |
| **Performans** | nativee yakın | çok iyi | en iyi |
| **Tavsiye** | ✅ **Seçildi** - hızlı POC, aynı ekiple geliştirme | - | - |

### Backend Stratejisi
- **API Client:** Mevcut `/api/*` endpointleri doğrudan kullanılacak (BFF katmanı gerekmez)
- **Neden:** NextAuth JWT tabanlı, HTTP-only cookie + Bearer token destekli. Mobile'de `accessToken` döndürme endpoint'i yeterli.

## 3. Mimari Tasarım

### 3.1 API Client
```
src/api/client.ts
- Base URL: https://montajimvar.xyz/api
- Interceptor: Auth token ekleme/refresh
- Error handling: 401 -> auto logout
- Retry logic: exponential backoff
```

### 3.2 Kimlik Doğrulama Akışı
```
1. Kullanıcı giriş yapar (email/password)
2. Backend /api/auth/[...nextauth] endpoint'ine POST
3. Access token (JWT) + Refresh token döner
4. Secure storage'a kaydet (/expo-secure-store)
5. Her API isteğinde Authorization: Bearer <token> header'ı
6. 401 hatasında refresh token ile yenileme dene
7. Refresh başarasız olursa logout
```

### 3.3 State Management
- **Zustand** - hafif, TypeScript tipli, React hooks tabanlı
- Store'lar: authStore, favoritesStore, messagesStore, profileStore

### 3.4 Navigation
- **React Navigation v6** - Stack Navigator + Tab Navigator
- Auth flow: Login -> Register -> Main Tabs
- Main Tabs: Home (Firmalar), Favorites, Messages, Dashboard/Profile

## 4. MVP Kapsamı (v1.0) vs v1.1+

### v1.0 - Minimum Viable Product
- [x] iOS + Android aynı kod tabanı
- [ ] Authentication (Email/Password + Google)
- [ ] Firmaları listeleme/görüntüleme
- [ ] Favori ekleme/çıkarma
- [ ] Mesaj gönderme/alıcı listesi
- [ ] Kullanıcı profili görüntüleme
- [ ] Basic arama/filtreleme

### v1.1 - Role-Aware Features  
- [ ] Admin: Kullanıcı rolü değiştirme
- [ ] Montajcı/Üretici: Firma oluşturma/düzenleme
- [ ] Premium badge gösterimi

### v1.2 - Advanced Features
- [ ] Harita entegrasyonu (Mapview)
- [ ] Bildirimler (Push notifications - Expo)
- [ ] In-app messaging
- [ ] Review sistemi

## 5. Geliştirme Aşamaları ve Milestone'lar

| Hafta | İçerik | Deliverable |
|-------|--------|-------------|
| **Hafta 1** | Proje setup, Expo init, navigation, auth flow | Boş şablon + giriş ekranı |
| **Hafta 2** | API client, NextAuth entegrasyonu | Login/logout çalışan |
| **Hafta 3** | Firma listeleme (Home), filtreleme | Arama/filtreleme ekranı |
| **Hafta 4** | Firma detay, favori sistemi | Favori ekleme çıkarma |
| **Hafta 5** | Mesajlaşma (list + send) | Mesaj gönder/al |
| **Hafta 6** | Profil yönetimi, premium kontrolü | Dashboard/profile |
| **Hafta 7** | Test, bug fix, App Store hazırlığı | TestFlight beta |
| **Hafta 8** | App Store submission | Yayında! |

## 6. Risk Analizi ve Mitigasyon Stratejileri

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|------------|
| **NextAuth JWT mobilde sync hatası** | Orta | Yüksek | /api/auth/mobile-login endpoint'i yeni token döndürecek |
| **CORS/Header sorunu** | Düşük | Orta | API'de CORS mobile origin'leri ekle |
| **Push notification entegrasyon hatası** | Orta | Orta | Expo Notification service kullan |
| **Harita performans sorunu** | Düşük | Orta | FlatList + lazy loading + map clustering |
| **App Store onay gecikmesi** | Düşük | Orta | Guideline'lara tam uyum, test flight önceden gönder |

## 7. Kullanılacak Kütüphaneler

### Authentication
- `expo-secure-store` - Token saklama (iOS Keychain/Android Keystore)
- `jwt-decode` - Token parse etme

### Core
- `react-navigation` - Ekran geçişleri
- `zustand` - State management
- `axios` - HTTP client

### UI
- `react-native-paper` veya `nativewind` - Component library
- `expo-router` (isteğe bağlı) - File-based routing

### Maps
- `react-native-maps` - Harita görüntüleme
- `expo-location` - Konum izinleri

### Notifications
- `expo-notifications` - Push bildirimleri

## 8. Test Stratejisi

- **Unit Tests:** Jest + React Native Testing Library (küçük, mantıksal)
- **Integration Tests:** API endpoint'leri mock'lu test (msw)
- **E2E Tests:** Detox - gerçek cihazda akış testleri
- **Beta Test:** TestFlight (10-20 internal tester)

## 9. App Store Dağıtım Süreci

1. **EAS Build** ile production build al
2. **App Store Connect** hesabı (Apple developer profil)
3. **Bundle ID** belirle: `com.montajimvar.app`
4. **Screenshot** ve açıklamalar çek
5. **App Store** yükle - 1-2 hafta onay bekle
6. **TestFlight** için invite kodları isteyenler için paylaş

---

## Onay Bekliyor
Bu planı **Momus** ile gözden geçirmemizi ister misiniz, yoksa doğrudan **implementation** aşamasına geçelim?