# CRM Backlog

## P0 — Critical CRM Foundations

| # | Item | Area | Description | Depends On |
|---|---|---|---|---|
| 1 | **Task Model + API** | Task | Create `Task` model, `/api/crm/tasks` CRUD, activity logging | Database migration |
| 2 | **Lead Model + API** | Lead | Create `Lead` model, `/api/crm/leads` CRUD, source tracking | Database migration |
| 3 | **Activity Model + Auto-Logging** | Activity | Create `Activity` model, auto-log from existing events (job, offer, payment) | Database migration |
| 4 | **Customer Detail Aggregation API** | Customer | `GET /api/crm/customers/[id]` — aggregate User, Job, Offer, Payment, Message, Review | Existing models only |
| 5 | **Customer Timeline API** | Customer | `GET /api/crm/customers/[id]/timeline` — unified activity from all sources | Activity model |

## P1 — Pipeline & Company

| # | Item | Area | Description |
|---|---|---|---|
| 6 | **PipelineStage Model + API** | Pipeline | Create stages (admin-manageable), default pipeline seed |
| 7 | **Deal Model + API** | Pipeline | Create Deal linked to stages, CRUD, auto-create from Job |
| 8 | **Pipeline Dashboard Widget** | Dashboard | Pipeline funnel, win rate, expected revenue |
| 9 | **ContactPerson Model + API** | Contacts | Attach contacts to companies/customers |
| 10 | **Reminder Model + API** | Reminders | Create/dismiss reminders, auto-expiry |
| 11 | **Admin CRM Dashboard Page** | Admin | Unified CRM management page with widgets |
| 12 | **Company to CRM upgrade** | Company | Add Branch/Department/Employee management to existing Profiles |

## P2 — Documents & Reporting

| # | Item | Area | Description |
|---|---|---|---|
| 13 | **Document Model + API** | Documents | Upload, versioning, entity attachment |
| 14 | **CRM Reports API** | Reports | Customer acquisition, deal conversion, revenue by source |
| 15 | **Import Architecture** | Import | Excel/CSV import for customers, jobs, installers |
| 16 | **Customer Segments** | Customers | Auto-segment based on activity + spend |
| 17 | **Bulk Job Creation (Enterprise)** | Jobs | Corporate customers create multiple jobs at once |
| 18 | **Approval Workflow for Companies** | Companies | Manager approval before job publish |

## P3 — Automation & Polish

| # | Item | Area | Description |
|---|---|---|---|
| 19 | **Workflow Automation** | Automation | Trigger-action rules (deadline reminder, follow-up emails) |
| 20 | **Email Campaign Architecture** | Email | Templates, mailing lists, open tracking |
| 21 | **Advanced CRM Analytics** | Reports | Forecasting, churn prediction, LTV |
| 22 | **Mobile CRM** | Mobile | Offline sync, lightweight endpoints, PWA |
| 23 | **Gamification for CRM** | Gamification | Staff performance badges, leaderboard |
| 24 | **CRM Audit Trail** | Audit | Full user-action audit (not just admin) |

## Not Building (Out of Scope)

- Email provider implementations (Outlook, Gmail SMTP — design architecture only)
- Third-party CRM sync (HubSpot, Salesforce)
- AI-powered lead scoring
- Full ERP features (inventory, procurement, payroll)
