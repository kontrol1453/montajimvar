# CRM Architecture

## Existing CRM Capabilities (Readiness Audit)

The repository already contains substantial CRM-like functionality. Below is every feature mapped to CRM domains:

### Already Implemented (Reusable)

| CRM Domain | Existing Code | Notes |
|---|---|---|
| **Customer Records** | `User` model, `/api/user/route.ts` | Basic profile (name, email, phone, city, avatar). No company/contact person model. |
| **Company Records** | `Profile` model (`companyName`, `description`, `categoryId`, `city`, `address`, `phone`, `website`, `workingCities`, `hasInsurance`, `hasGuarantee`) | Serves as de-facto company CRM. Missing: branches, departments, contracts. |
| **Job History** | `Job` model + `JobTimeline` | Full per-job timeline with status transitions. One of the strongest CRM features. |
| **Offer History** | `Offer` model | Full bid history per job. Status: pending/accepted/rejected/withdrawn. |
| **Activity Logs** | `AdminAuditLog` model, `logAdminAction()` | Admin-scoped only. No user-facing activity log. 17 action types, 12 entity types. |
| **Notes/Timeline** | `JobTimeline` model | Attached to jobs only. No standalone notes entity. |
| **Messages** | `Message` + `JobMessage` models | Two messaging systems: direct user-to-user and job-scoped threads. |
| **Notifications** | `Notification` model, `notifyAdmin()` | Admin-only notification. No user notification infrastructure. |
| **Reports** | `GET /api/admin/summary` | Aggregate platform stats. No time-series, no export reports. |
| **File Attachments** | `Upload` + `ProfileImage` models | Photo upload for jobs and profiles. No document management. |
| **Calendar** | `/dashboard/takvim` page + `CalendarView` | Basic calendar showing jobs by date. No meetings, tasks, or CRM events. |
| **Permissions** | `RolePermission` model, `hasPermission()` | Role-feature matrix. 8 features defined. Admin-manageable. |
| **Reviews** | `Review` + `JobReview` models | Both firm-level and job-level reviews. Rating aggregation on profile. |
| **Favorites** | `Favorite` model | User can favorite profiles. De-facto lead tracking. |
| **Invoices** | `Invoice` model | Linked to Payment. Schema exists but minimal API surface. |
| **Subscription** | `SubscriptionPlan` + `SubscriptionPayment` models | Plans are CRUD-manageable. Paid plans not yet functional. |
| **Disputes** | `Dispute` model + admin read API | Read-only admin view. No user-facing creation. |
| **Search** | `GET /api/profiles`, `GET /api/jobs` | Basic search with ILIKE. No faceted search, no full-text. |
| **Email** | `sendEmail()` in `lib/email.ts` | Transactional emails (verify, password reset). No campaign architecture. |

### CRM Gaps (Need to Build)

| CRM Domain | Current State | Priority |
|---|---|---|
| **Lead Management** | No lead model. Favorites partially fills this role. | P0 |
| **Pipeline/Stages** | No pipeline stages. Jobs are status-based, not sales-pipeline. | P0 |
| **Task Management** | No task model. No to-do, no assignment, no due date. | P0 |
| **Activity Timeline (unified)** | Each entity has its own timeline. No cross-entity timeline. | P1 |
| **Corporate Accounts** | No company hierarchy (HQ → branch → department → employee). | P1 |
| **Contact Persons** | No contact person model. Only User (single identity). | P1 |
| **Document Management** | No document model. No versioning, no contracts, no certificates. | P2 |
| **CRM Dashboard Widgets** | Dashboard is marketplace-focused. No CRM KPIs. | P2 |
| **Workflow Automation** | No trigger-action rules. | P3 |
| **Advanced Analytics** | No conversion rates, no sales forecasting. | P3 |
| **Bulk Import (Excel/CSV)** | No import infrastructure. | P2 |
| **Email Campaign** | No mailing list, no templates, no tracking. | P3 |

## CRM Architecture Principles

1. **Extend, don't replace** — All CRM entities must extend existing models (User, Profile, Job) rather than duplicate them
2. **Progressive enhancement** — Add CRM fields to existing models via optional relations
3. **Unified timeline** — Every entity gets an `Activity` record on state changes
4. **Permission-aware** — All CRM actions route through the existing `RolePermission` system
5. **Marketplace-aware** — CRM stages align with job statuses, not replace them

## Entity Relationship Diagram (CRM Extension)

```
                    ┌─────────────────────────┐
                    │       Company           │
                    │  (new — extended from    │
                    │   Profile)              │
                    └────┬────────────────────┘
                         │
                    ┌────▼────────────────────┐
                    │       Branch             │
                    │  (new — multi-location)  │
                    └────┬────────────────────┘
                         │
                    ┌────▼────────────────────┐
                    │     Department           │
                    │  (new)                  │
                    └────┬────────────────────┘
                         │
                    ┌────▼────────────────────┐
                    │     Employee             │
                    │  (extends User + Profile)│
                    └─────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Lead      │────►│  Pipeline    │────►│  Deal        │
│  (new)       │     │  Stage (new) │     │  (new)       │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Task       │     │  Activity    │     │  Document    │
│  (new)       │     │  (new)       │     │  (new)       │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│  Contact     │     │  Reminder    │
│  Person (new)│     │  (new)       │
└──────────────┘     └──────────────┘
```

## Integration Points with Existing Code

| Existing Model | CRM Role | Integration |
|---|---|---|
| `User` → | `Employee` / `Contact Person` | Add `companyId`, `departmentId`, `position` fields |
| `Profile` → | `Company` | Already has most fields. Add `companyType`, `taxId`, `contractStart/End` |
| `Job` → | `Deal` / `Opportunity` | Pipeline stages map to job statuses + deal-specific fields |
| `JobTimeline` → | `Activity` records | Create Activity for every timeline entry |
| `Notification` → | Activity feed | Keep as admin notification + add user notification model |
| `AdminAuditLog` → | Activity log | Extend entity types with CRM entities |
| `Review` → | CRM feedback | Already linked to Profile |
| `Favorite` → | Lead source | Can seed leads from favorites |
