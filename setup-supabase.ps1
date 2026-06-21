param(
  [Parameter(Mandatory = $true, HelpMessage = "Supabase Project URL (https://xxx.supabase.co)")]
  [string]$SupabaseUrl,
  [Parameter(Mandatory = $true, HelpMessage = "Supabase anon public key")]
  [string]$SupabaseKey,
  [Parameter(Mandatory = $true, HelpMessage = "Database connection string (postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres)")]
  [string]$DatabaseUrl,
  [Parameter(Mandatory = $false, HelpMessage = "NEXTAUTH_SECRET (optional, will auto-generate if empty)")]
  [string]$NextAuthSecret = "",
  [Parameter(Mandatory = $false, HelpMessage = "Site URL for NEXTAUTH_URL")]
  [string]$SiteUrl = "https://montajimvar.vercel.app"
)

Write-Host "🔧 Montajım Var - Supabase Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Generate NEXTAUTH_SECRET if not provided
if (-not $NextAuthSecret) {
  $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
  $NextAuthSecret = -join ((1..64) | ForEach-Object { Get-Random -Maximum $chars.Length | ForEach-Object { $chars[$_] } })
  Write-Host "  ⚡ NEXTAUTH_SECRET otomatik oluşturuldu" -ForegroundColor Yellow
}

# Write .env file
@"
# PostgreSQL (Supabase)
DATABASE_URL="${DatabaseUrl}"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="${SupabaseUrl}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${SupabaseKey}"

# NextAuth
NEXTAUTH_URL="${SiteUrl}"
NEXTAUTH_SECRET="${NextAuthSecret}"
"@ | Out-File -FilePath ".env" -Encoding UTF8 -Force

Write-Host "  ✅ .env dosyası oluşturuldu" -ForegroundColor Green

# Generate Prisma client and run migration
Write-Host "  ⏳ Prisma migration çalıştırılıyor..." -ForegroundColor Yellow
npx prisma migrate dev --name init 2>&1
if ($?) {
  Write-Host "  ✅ Migration başarılı" -ForegroundColor Green
} else {
  Write-Host "  ⚠️ Migration hatası - dev.db'den veri aktarmak gerekebilir" -ForegroundColor Red
  Write-Host "     Önce şunu dene: npx prisma db push" -ForegroundColor Yellow
}

# Seed database
Write-Host "  ⏳ Seed çalıştırılıyor..." -ForegroundColor Yellow
npm run seed 2>&1
if ($?) {
  Write-Host "  ✅ Seed başarılı" -ForegroundColor Green
} else {
  Write-Host "  ⚠️ Seed hatası" -ForegroundColor Red
}

# Build test
Write-Host "  ⏳ Build test ediliyor..." -ForegroundColor Yellow
npm run build 2>&1
if ($?) {
  Write-Host "  ✅ Build başarılı" -ForegroundColor Green
} else {
  Write-Host "  ⚠️ Build hatası" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================" -ForegroundColor Cyan
Write-Host "İşlem tamamlandı!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sonraki adım: Vercel'e deploy" -ForegroundColor Cyan
Write-Host "  npx vercel" -ForegroundColor Yellow
Write-Host ""
Write-Host "Veya Git ile push'layıp Vercel'e bağla:" -ForegroundColor Cyan
Write-Host "  git add ." -ForegroundColor Yellow
Write-Host '  git commit -m "Supabase migration"' -ForegroundColor Yellow
Write-Host "  git push" -ForegroundColor Yellow
Write-Host ""
Write-Host "Vercel'de şu env'leri eklemeyi unutma:" -ForegroundColor Yellow
Write-Host "  DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL," -ForegroundColor Yellow
Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXTAUTH_URL," -ForegroundColor Yellow
Write-Host "  NEXTAUTH_SECRET" -ForegroundColor Yellow
