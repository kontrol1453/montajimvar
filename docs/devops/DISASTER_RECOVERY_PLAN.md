# Disaster Recovery Plan — Montajım Var

## 1. RPO / RTO Targets

| Seviye | Senaryo | RPO | RTO |
|---|---|---|---|
| **L1** | Single-record corruption | 0 (transactional) | 15 dak |
| **L2** | Tablo veya şema bozulma | 1 saat (PITR) | 30 dak |
| **L3** | Database total loss | 24 saat | 2 saat |
| **L4** | Storage bucket silinmesi | 7 gün | 4 saat |
| **L5** | Pi hardware failure | 0 | 1 saat |
| **L6** | GitHub repo compromise | 0 (mirror) | 30 dak |
| **L7** | Bölgesel kesinti (Neon) | 7 gün | 8 saat |

## 2. Recovery Procedures (Detailed)

### L3 — Database Total Loss

```bash
# 1. Yeni Neon project oluştur
neonctl projects create montajimvar-recovery

# 2. Son backup'tan restore
pg_restore -d "$RECOVERY_DB_URL" \
  backups/pre-release-$(date +%Y%m%d).dump \
  --clean --if-exists --no-owner

# 3. .env DATABASE_URL güncelle
# 4. PM2 reload
pm2 reload montajimvar --update-env

# 5. Verify
curl https://test.montajimvar.xyz/api/health
```

### L5 — Pi Hardware Failure

```bash
# 1. Yeni Pi OS hazırla
# 2. Node 20.11 + npm 10 + PM2 kur
# 3. SSH key'i kopyala
# 4. Repo clone
git clone https://github.com/kontrol1453/montajimvar.git /home/pi/montajimvar
cd /home/pi/montajimvar

# 5. .env'i 1Password'dan kopyala
# 6. Install + build
npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy
npm run build

# 7. SSH-only auth
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# 8. PM2 başlat
pm2 start npm --name montajimvar -- start
pm2 save
pm2 startup

# 9. Reverse proxy (nginx) konfigüre
# (mevcut https://test.montajimvar.xyz → yeni Pi IP)

# 10. Verify
curl https://test.montajimvar.xyz/api/health
```

### L6 — Repo Compromise

1. **Pause**: all deploys, all PR merges
2. **Audit**: scope — kaç commit potansiyel zararlı?
3. **Force-push**: `main`'i son known-good hash'e resetle
4. **Rotate**: tüm secrets (NEXTAUTH_SECRET, REFRESH_TOKEN_SECRET, SUPABASE keys, SENDGRID, etc)
5. **Force logout**: bump User.tokenVersion → tüm session'lar invalidate
6. **Notify**: kullanıcılar + Discord
7. **Post-mortem**: ADR + yazılım

## 3. Pre-Recovery Verification

Herhangi bir recovery işleminden önce:

- [ ] Backup dosyası mevcut ve açılabilir?
- [ ] Checksum eşleşiyor mu?
- [ ] Recovery DB'sinde restore test edildi mi?
- [ ] Etkilenen kullanıcı sayısı tahmin edildi mi?
- [ ] Discord'a duyuru yapıldı mı?

## 4. Post-Recovery

- [ ] Health endpoint OK
- [ ] Smoke tests pass
- [ ] Sentry temiz
- [ ] PM2 logs hatasız
- [ ] Database count'lar eşleşiyor
- [ ] En son created ID'ler eşleşiyor
- [ ] Rollback sonrası normal traffic

## 5. Communication Plan

| Audience | Mesaj | Kanal | Zamanlama |
|---|---|---|---|
| Internal team | "DR ile karşilaşildi" | Slack/Discord | Anında |
| Users | "Kısa kesinti, çözüldü" | Status page | 5 dak içinde |
| Users (büyük) | "Bilgilendirme + etki" | E-posta | 1 saat içinde |
| Düzenleyici (KVKK) | Olası veri ihlali raporu | Resmi yazışma | 72 saat (KVKK Madde 10) |
- Public | "Service restored" | Status page | Stable sonra |

## 6. Test Schedule

| Sıklık | Tür | Sorumlu |
|---|---|---|
| Aylık | L1, L2 mock test | SRE |
| Çeyreklik | L3/L4 restore drill | SRE + DevOps |
| Yıllık | L5/L6/L7 tam simülasyon | Tüm ekip |

## 7. Tools / Contacts

| Araç | Kullanım |
|---|---|
- Neon CLI (`neonctl`) | DB branching, restore
| `pg_dump` / `pg_restore` | Manual backup/restore
- Supabase dashboard | Storage backups
- 1Password | Secrets vault
- `aws s3` | External backup sync (P2)
- `pm2` | Process management
- `nginx` | Reverse proxy

| Rol | Sorumluluk |
|---|---|
- SRE | DR drills, monitoring
| DevOps | Infrastructure setup
| Release Manager | DR activation kararı
