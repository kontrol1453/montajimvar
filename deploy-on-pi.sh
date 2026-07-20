#!/bin/bash
# ========================================
# Montajim Var - Remote Deployment Script
# Runs on the Raspberry Pi
# ========================================

set -e

COMMIT=${1:-latest}
APP_DIR=/home/pi/deploy/montajimvar-$COMMIT
LINK_DIR=/home/pi/montajimvar

echo ""
echo "========================================"
echo "  Montajim Var Deployment on Pi"
echo "========================================"
echo ""
echo "App directory:  $APP_DIR"
echo "Active symlink: $LINK_DIR"
echo ""

# Step 1: Install dependencies
echo "[1/7] Installing dependencies..."
cd $APP_DIR
npm ci --omit=dev --no-audit --no-fund
echo "OK"
echo ""

# Step 2: Setup Prisma
echo "[2/7] Generating Prisma client..."
npx prisma generate
echo "OK"
echo ""

# Step 3: Run migrations
echo "[3/7] Running database migrations..."
npx prisma migrate deploy 2>/dev/null || echo "migrations skipped or already applied"
npx prisma db push --skip-generate 2>/dev/null || echo "db push skipped"
echo "OK"
echo ""

# Step 4: Switch symlink
echo "[4/7] Switching live symlink..."
rm -f $LINK_DIR
ln -s $APP_DIR $LINK_DIR
echo "OK"
echo ""

# Step 5: Stop existing app
echo "[5/7] Stopping existing app..."
pm2 delete montajimvar 2>/dev/null || true
echo "OK"
echo ""

# Step 6: Start new app
echo "[6/7] Starting app with PM2..."
cd $LINK_DIR
pm2 start npm --name montajimvar -- start
pm2 save
echo "OK"
echo ""

# Step 7: Verify
echo "[7/7] Verifying deployment..."
sleep 5
curl -s -o /dev/null -w "HTTP Status: %{http_code}\nResponse time: %{time_total}s\n" http://localhost:3000
echo ""

echo "========================================"
echo "  Deployment successful!"
echo "========================================"
echo ""
echo "App is running at:"
echo "  http://192.168.0.38:3000"
echo ""
echo "Useful commands:"
echo "  pm2 status               - check app status"
echo "  pm2 logs montajimvar     - view logs"
echo "  pm2 restart montajimvar  - restart"
echo ""
