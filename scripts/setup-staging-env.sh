#!/bin/bash
# Staging .env setup — runs on Pi
set -e

# Copy prod .env to staging
cp /home/pi/montajimvar/.env /home/pi/staging/.env.staging

# Apply staging-specific changes
sed -i 's|^NEXTAUTH_URL=.*|NEXTAUTH_URL=https://staging.montajimvar.xyz|' /home/pi/staging/.env.staging

# NEXT_PUBLIC_APP_URL: replace if exists, append otherwise
if grep -q '^NEXT_PUBLIC_APP_URL=' /home/pi/staging/.env.staging; then
  sed -i 's|^NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://staging.montajimvar.xyz|' /home/pi/staging/.env.staging
else
  echo "NEXT_PUBLIC_APP_URL=https://staging.montajimvar.xyz" >> /home/pi/staging/.env.staging
fi

# Insert PORT=3010 at very top if not already
grep -q '^PORT=' /home/pi/staging/.env.staging && \
  sed -i 's|^PORT=.*|PORT=3010|' /home/pi/staging/.env.staging || \
  sed -i '1i PORT=3010' /home/pi/staging/.env.staging

# SENTRY_ENVIRONMENT = staging
grep -q '^SENTRY_ENVIRONMENT=' /home/pi/staging/.env.staging && \
  sed -i 's|^SENTRY_ENVIRONMENT=.*|SENTRY_ENVIRONMENT=staging|' /home/pi/staging/.env.staging || \
  echo "SENTRY_ENVIRONMENT=staging" >> /home/pi/staging/.env.staging

echo "=== Staging .env ready ==="
echo "--- HEAD ---"
head -5 /home/pi/staging/.env.staging
echo "--- changed vars ---"
grep -E '^(PORT|NEXTAUTH_URL|NEXT_PUBLIC_APP_URL|SENTRY_ENVIRONMENT)=' /home/pi/staging/.env.staging
echo "--- DB still shared with prod (per user decision) ---"
grep '^DATABASE_URL=' /home/pi/staging/.env.staging | sed -E 's/(:[^:@]*@/:***@/'
