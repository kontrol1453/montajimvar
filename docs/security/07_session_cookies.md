# Session & Cookie Güvenliği

## JWT Stratejisi (NextAuth v5)

| Özellik | Değer |
|---------|-------|
| Strategy | `jwt` |
| Secret | `process.env.NEXTAUTH_SECRET` (fallback yok) |
| Token süresi | 30 gün (NextAuth default) |
| Algorithm | HS256 |
| Cookie adı | `next-auth.session-token` (dev) / `__Secure-next-auth.session-token` (prod) |
| HttpOnly | true |
| Secure | true (HTTPS) |
| SameSite | Lax |

### Token İçeriği

```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "User",
  "avatar": "https://...",
  "roles": ["CUSTOMER"],
  "tokenVersion": 0,
  "iat": 1752600000,
  "exp": 1755192000
}
```

### Token Invalidation (tokenVersion)

`User.tokenVersion` her rol değişikliğinde artırılır. JWT callback her refresh'te DB ile karşılaştırır:

```typescript
// src/lib/auth.ts → jwt callback
if (token.id && !user && !account) {
  const dbUser = await prisma.user.findUnique({
    where: { id: token.id },
    select: { tokenVersion: true, roles: true },
  });
  if (!dbUser) throw new Error("Kullanıcı bulunamadı");
  if (dbUser.tokenVersion !== token.tokenVersion) {
    throw new Error("Roller güncellendi, lütfen tekrar giriş yapın");
  }
  token.roles = dbUser.roles;
}
```

## Cookie Listesi

| Cookie | HttpOnly | Secure | SameSite | TTL | Amaç |
|--------|----------|--------|----------|-----|------|
| `next-auth.session-token` | ✓ | ✓ | Lax | 30 gün | JWT session |
| `next-auth.csrf-token` | ✓ | ✓ | Lax | session | CSRF koruması |
| `next-auth.callback-url` | ✗ | ✓ | Lax | session | Redirect after login |
| `google_signup_role` | ✗ | ✓ (prod) | Lax | 5 dakika | Google OAuth rol seçimi (HMAC imzalı) |

## Google OAuth Role Cookie (HMAC-SHA256)

### Akış

```
/auth/kayit → rol seç (CUSTOMER/ASSEMBLER/MANUFACTURER)
  → POST /api/auth/google-signup { role }
  → signCookieValue(role, 300) → Set-Cookie: google_signup_role=<signed>
  → signIn("google")
  → signIn callback: verifySignedCookie(cookie) → role
  → cookie.delete("google_signup_role")
```

### Format

```
google_signup_role = "<value>|<expiry_epoch>|<hmac_sha256(value|expiry, NEXTAUTH_SECRET)>"
```

Örnek: `CUSTOMER|1752698100|a3f8b9c2d1e5f7a9b3c6...`

### Güvenlik

- **Tampering önleme**: HMAC-SHA256 imzası `NEXTAUTH_SECRET` ile
- **Timing-safe karşılaştırma**: `crypto.timingSafeEqual`
- **TTL**: 5 dakika (300 sn)
- **Temizleme**: callback sonrası `maxAge: 0` ile silinir

## Refresh Token (Mobil API)

| Token | Secret | Süre |
|-------|--------|------|
| Access | `NEXTAUTH_SECRET` | 15 dakika |
| Refresh | `REFRESH_TOKEN_SECRET` | 7 gün |

### Rotasyon

`/api/auth/refresh` her seferinde yeni refresh token üretir (rotation). P2 öneri: refresh token DB'de tutulup revocation yapılabilmeli.

## P2 Öneriler

| # | Madde | Öneri |
|---|-------|-------|
| 1 | Session absolute timeout | 30 gün → 24 saat sliding + 7 gün absolute |
| 2 | Refresh token DB revocation | `refresh_tokens` tablosu + `userId + tokenHash` |
| 3 | Cookie prefix | `__Host-` prefix for session cookie (prod) |
| 4 | Session fixation | Login sonrası `tokenVersion` increment (session yenileme) |
