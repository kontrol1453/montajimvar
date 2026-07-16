# Backup & Disaster Recovery — Montajım Var

## 1. Backup Strategy

### 1.1 Database (Neon Postgres)

| Tür | Sıklık | Retention | Yöntem |
|---|---|---|---|
| Otomatik | Continuous (PITR) | 7 gün | Neon built-in |
| Manuel (pre-release) | Her release öncesi | 30 gün | `pg_dump` → S3 |
| Çeyreklik | Her 3 ay | 1 yıl | Neon backup → S3 archive |

#### Manual Backup (pre-release)

```bash
# Before every release, dump DB
pg_dump "$DATABASE_URL" --no-owner --no-privileges -F c -f "backups/pre-release-$(date +%Y%m%d-%H%M).dump"

# Upload to encrypted S3 (P2)
aws s3 cp "backups/pre-release-*.dump" s3://montajimvar-backups/db/
```

### 1.2 Storage (Supabase)

- **Türü**: Object storage (uploaded görseller)
- **Backup**: Supabase dashboard → Settings → Backups
- **Retention**: 30 gün point-in-time
- **P2**: Sync to external S3 weekly

### 1.3 Configuration

| Dosya | Backup Yeri | Retention |
|---|---|---|
| `.env` | 1Password vault (last 5 versions) | ∞ |
| `next.config.js` | Git | ∞ |
| `prisma/schema.prisma` | Git | ∞ |
| `deploy-on-pi.sh` | Git | ∞ |
| PM2 ecosystem config | Pi `/home/pi/` (gitignored) | Manual |

### 1.4 Environment

```bash
# Otomatize (P2)
tar -czf env-backup-$(date +%Y%m%d).tar.gz .env .env.local
gpg --symmetric --cipher-algo AES256 env-backup-*.tar.gz
```

## 2. Recovery Point Objective (RPO) & Recovery Time Objective (RTO)

| Senaryo | RPO | RTO |
|---|---|---|
| **Single-record kaybı** | 0 (transactional DB) | 5 dak |
| **Tablo corruption** | 1 saat (PITR) | 30 dak |
| **Database total loss** | 24 saat (son nightly) | 2 saat |
| **Storage bucket silinmesi** | 7 gün (Supabase backup) | 4 saat |
| **Pi hardware failure** | 0 (cloud-only data) | 1 saat |
| **GitHub repo compromise** | 0 (her push depolandı) | 30 dak |
| **Bölgesel kesinti (Neon)** | 7 gün (Son manuel) | 8 saat |

## 3. Disaster Recovery Plan

### 3.1 Database Restore

```bash
# Step 1: Yeni Neon branch oluştur (veya yeni DB)
createdb montajimvar-recovery

# Step 2: Latest dump'tan geri yükle
pg_restore -d "$RECOVERY_DB_URL" backups/pre-release-XXX.dump

# Step 3: App .env DATABASE_URL güncelle
# Step 4: PM2 restart
pm2 reload montajimvar --update-env

# Step 5: Smoke test
curl https://test.montajimvar.xyz/api/health
```

### 3.2 Storage Restore

1. Supabase dashboard → Settings → Backups
2. Select timestamp
3. Restore → Yeni bucket
4. Update `.env` `NEXT_PUBLIC_SUPABASE_URL`

### 3.3 Pi Hardware Failure

```bash
# Yeni Pi hazırla
ssh pi@new-pi
git clone https://github.com/kontrol1453/montajimvar.git
# .env'i 1Password'dan kopyala
npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy
pm2 start npm --name montajimvar -- start
```

### 3.4 Compromised Secret

```bash
# 1. Etkilenen secret rotate et
# 2. .env güncelle
# 3. Tüm kullanıcılar re-login (tokenVersion bump)
# 4. PM2 reload
```

## 4. Restore Testing

### Çeyreklik drill (her 3 ay)

1. **Backup al** (pre-drill baseline)
2. **Staging DB'de restore dene**:
   ```bash
   pg_restore -d "$STAGING_DB_URL" backups/test-restore.dump --clean --if-exists
   ```
3. **Verify**:
   - Kullanıcı sayısı eşleşiyor mu?
   - Son 10 kayıt var mı?
   - Schema version uyumlu mu?
4. **Document**: `docs/devops/drills/<date>.md`

### Yıl: Tam felaket simülasyonu

- Yeni Neon + Supabase + Pi sıfırdan
- Tüm veriyi restore
- Uygulama ayağa kalkmalı < 2 saat
- Rapor + iyileştirme önerileri

## 5. Backup Verification

Her backup'ı 7 gün sonra restore et ve checksum kontrolü yap:

```bash
# Checksum karşılaştırma
pg_dump "$DATABASE_URL" | sha256sum > new.sha
sha256sum -c baseline.sha
```

## 6. P2 İyileştirmeler

- [ ] GitHub Actions weekly `pg_dump` cron → S3
- [ ] Supabase storage mirror (Supabase → S3 sync)
- [ ] Encrypted backup to Backblaze B2
- [ ] Tiered retention (daily 7, weekly 4, monthly 12, yearly 3)
- [ ] Automated restore test cron
- [ ] Status page (status.montajimvar.xyz)
