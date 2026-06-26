# MontajımVar Push Service - Raspberry Pi Kurulumu

## 1. Gereksinimler

```bash
# Node.js 18+ yükle
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs git

# PM2 yükle
npm install -g pm2

# cloudflared yükle (Cloudflare Tunnel)
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
```

## 2. Servisi Kopyala

```bash
# Bu dosyaları Pi'e kopyala (USB/SCP/git)
# Proje klasörünü Pi'ye kopyala
mkdir -p ~/montajimvar-push
# push-service/ içindeki tüm dosyaları buraya kopyala
```

Ya da bu repo'dan clone'la:
```bash
git clone https://github.com/kontrol1453/montajimvar.git ~/montajimvar
cd ~/montajimvar/push-service
```

## 3. Bağımlılıkları Yükle

```bash
cd ~/montajimvar-push
npm install
```

## 4. VAPID Anahtarlarını Oluştur

```bash
node setup.js
```
Bu komut `.env` dosyasını oluşturur. NOT: `.env` dosyası zaten mevcutsa anahtarları korur ve sadece ekrana yazdırır.

## 5. Vercel'e VAPID Public Key'i Ekle

Setup çıktısındaki `NEXT_PUBLIC_VAPID_PUBLIC_KEY` değerini Vercel dashboard'da Environment Variables'a ekle:
1. https://vercel.com/fb-s-projects4/montajimvar_app/settings/environment-variables
2. `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = (setup.js çıktısındaki değer)
3. Environment: Production
4. Save

## 6. Push Service Key Oluştur

```bash
# Rastgele bir anahtar oluştur
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Bu anahtarı 2 yere ekle:
1. `~/montajimvar-push/.env` içinde `PUSH_SERVICE_KEY=` kısmına yapıştır
2. Vercel dashboard'da `PUSH_SERVICE_KEY` olarak ekle (Environment: Production)

## 7. Servisi Başlat

```bash
cd ~/montajimvar-push
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # çıktıdaki komutu da çalıştır (systemd için)
```

Kontrol:
```bash
pm2 status
curl http://localhost:3001/health
```

## 8. Cloudflare Tunnel Kurulumu

```bash
# Cloudflare'a giriş yap (bir kere)
cloudflared tunnel login

# Tunnel oluştur
cloudflared tunnel create montajimvar-push

# DNS kaydı ekle
cloudflared tunnel route dns montajimvar-push push.montajimvar.xyz

# Tunnel config dosyasını oluştur (~/.cloudflared/config.yml):
# tunnel: <tunnel-id>
# credentials-file: /home/pi/.cloudflared/<tunnel-id>.json
# ingress:
#   - hostname: push.montajimvar.xyz
#     service: http://localhost:3001
#   - service: http_status:404

# Tunnel'i çalıştır (servis olarak)
sudo cloudflared service install
```

Alternatif (daha basit) - Quick Tunnel:
```bash
cloudflared tunnel --url http://localhost:3001
```
Bu rastgele bir URL verir (örn. `https://abc123.trycloudflare.com`).
Çıktıdaki URL'yi Vercel'de `NEXT_PUBLIC_PUSH_SERVICE_URL` olarak ekle.

## 9. Vercel'de Env Var'ları Güncelle

Vercel dashboard'da şu değişkenleri ayarla:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = (setup.js çıktısı)
- `NEXT_PUBLIC_PUSH_SERVICE_URL` = (cloudflare URL'si veya push.montajimvar.xyz)
- `PUSH_SERVICE_KEY` = (6. adımda oluşturduğun anahtar)

## 10. Test

```bash
# Servis çalışıyor mu?
curl https://push.montajimvar.xyz/health

# VAPID key dönüyor mu?
curl https://push.montajimvar.xyz/vapid-public-key

# Push gönderme testi (servis key ile)
curl -X POST https://push.montajimvar.xyz/send \
  -H "Content-Type: application/json" \
  -H "X-Push-Service-Key: <PUSH_SERVICE_KEY>" \
  -d '{"userId":1,"title":"Test","body":"Merhaba dünya"}'
```

## Sorun Giderme

```bash
# Logları izle
pm2 logs montajimvar-push

# Servisi yeniden başlat
pm2 restart montajimvar-push

# Tunnel durumu
cloudflared tunnel info montajimvar-push

# Port dinleniyor mu?
sudo lsof -i :3001
```
