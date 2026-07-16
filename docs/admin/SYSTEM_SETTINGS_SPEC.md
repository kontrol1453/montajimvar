# System Settings Specification

## Overview
A unified `/admin/ayarlar` page consolidating all system configuration into one navigable interface.

## Page Structure

### Navigation
```
System Settings
├── General
│   ├── Platform Name
│   ├── Platform URL
│   ├── Maintenance Mode (toggle)
│   ├── Default Language
│   └── Contact Email
├── Registration
│   ├── Allow New Registrations (toggle)
│   ├── Require Email Verification (toggle)
│   ├── Default User Role
│   ├── Minimum Password Length
│   └── Captcha Enabled (toggle)
├── Marketplace
│   ├── Commission Rate (%)
│   ├── Minimum Job Budget
│   ├── Maximum Job Budget
│   ├── Auto-Cancel Unassigned Jobs After (hours)
│   ├── Offer Acceptance Window (hours)
│   └── Featured Profile Price (KRW)
├── Notifications
│   ├── Admin Notification Emails
│   ├── New User Alert (toggle)
│   ├── New Profile Alert (toggle)
│   ├── New Dispute Alert (toggle)
│   ├── Daily Digest (toggle, cron)
│   └── Push Notification Config
├── Payments
│   ├── Currency (TRY)
│   ├── Payment Provider (Iyzico)
│   ├── Escrow Release Period (days)
│   ├── Minimum Withdrawal Amount
│   └── Refund Policy
├── Security
│   ├── Session Timeout (minutes)
│   ├── Max Login Attempts
│   ├── Password Reset Expiry (hours)
│   ├── Admin IP Whitelist
│   ├── 2FA Enforcement (Admin Only / All Users / Disabled)
│   └── Rate Limiting (requests/min)
└── Integrations
    ├── Google Business API Key
    ├── Map Provider (API Key)
    ├── SMS Provider (API Key)
    ├── Email Provider (SMTP Config)
    └── CDN / Storage Config
```

## Data Model

New Prisma model for settings (or use existing infrastructure):

```prisma
model SystemSetting {
  id          Int      @id @default(autoincrement())
  key         String   @unique
  value       String   // JSON-encoded value
  type        String   // string, number, boolean, json
  category    String   // general, registration, marketplace, notifications, payments, security, integrations
  label       String   // Human-readable label
  description String?
  updatedAt   DateTime @updatedAt
  updatedBy   Int?
}
```

## API Endpoints

```
GET  /api/admin/settings          — List all settings grouped by category
GET  /api/admin/settings/:key     — Get single setting
PUT  /api/admin/settings/:key     — Update setting value
POST /api/admin/settings/bulk     — Bulk update settings
```

## Security
- Only SUPER_ADMIN and ADMIN roles can access settings
- All changes logged to AdminAuditLog
- Sensitive values (API keys) encrypted at rest
- Confirmation dialog for destructive changes

## Implementation Priority

### P1 — Implement Now
- Settings data model migration
- API endpoints (CRUD)
- General + Registration + Marketplace tabs
- Audit logging for setting changes

### P2 — Future
- Notifications + Payments + Security tabs
- Bulk import/export settings
- Settings version history with rollback
- Environment-aware settings (dev/staging/prod)
