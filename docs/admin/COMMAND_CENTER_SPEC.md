# Command Center Specification

## Current State
- Existing `/admin/komuta-merkezi` with 7 widgets
- Server-side data aggregation (15+ parallel queries)
- SectionErrorBoundary per widget

## Proposed Enhancements

### 1. Real-Time Status Bar
- **Location**: Top of command center (below header)
- **Content**: Connection status indicator (green/red dot), last updated timestamp, manual refresh button
- **Implementation**: Auto-poll every 60s via `setInterval`, manual refresh via button
- **Edge states**: Connection lost → yellow warning banner, stale data → grey indicator

### 2. Alert Priority Engine Improvements
- **New alert types**:
  - `payment_failure_high`: Multiple failed payment attempts
  - `user_escalation`: User escalated to admin (support flag)
  - `fraud_alert`: Suspicious activity pattern detected
  - `new_admin_action_needed`: Pending moderation queue > threshold
  - `subscription_expiring`: Premium users nearing expiry
- **Priority scoring**: severity × time_since_first_seen × affected_user_count
- **Dismissal**: Admin can dismiss alerts (hides for 24h via localStorage or db)

### 3. Enhanced Financial Overview
- **New metrics**:
  - MRR (Monthly Recurring Revenue)
  - ARPU (Average Revenue Per User)
  - Refund rate (refunded amount / total volume)
  - Payment method breakdown
  - Daily revenue sparkline (last 30 days)
- **New chart types**:
  - Revenue trend (area chart, 12 months)
  - Payment status pie chart
  - Commission vs volume comparison

### 4. AI-Powered Insights Section
- **Weekly summary**: Auto-generated text summary of platform health
- **Anomaly detection**: Flag unusual patterns (sudden drop in new users, spike in disputes)
- **Recommendations**: Data-driven suggestions (e.g., "promote category X", "review approval bottleneck")

### 5. Global Quick Actions
- Search bar with autocomplete (already exists in AdminShell)
- Shortcuts modal (already exists)
- Quick-create: New user, new blog post, send notification

### 6. Widget Customization
- Drag-and-drop widget reordering (localStorage persistence)
- Widget visibility toggles per admin
- Saved dashboard layouts

## Implementation Priority

### P0 — Done (existing)
- AttentionCenter, PlatformPulse, MarketplaceHealth
- OperationsCenter, FinancialOverview
- RecentActivity, QuickActions

### P1 — Implement Now
- Real-time status bar with polling
- Auto-refresh button
- New alert types (payment_failure, user_escalation, fraud_alert)
- Enhanced financial metrics (MRR, ARPU)
- Alert dismissal system

### P2 — Future
- AI insights section
- Widget customization
- Drag-and-drop layout
- Advanced chart library
