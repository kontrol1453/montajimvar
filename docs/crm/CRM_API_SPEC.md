# CRM API Specification

## Base URL: `/api/crm/`

## Authentication
All CRM endpoints require authentication. Admin endpoints additionally require ADMIN role. Permission checks use the existing `hasPermission()` / `RolePermission` system.

## Endpoints

### LEGACY — `/api/leads`
| Method | Path | Description |
|---|---|---|
| GET | `/api/leads` | List leads (filter: source, status, ownerId, page, limit) |
| POST | `/api/leads` | Create lead |
| GET | `/api/leads/[id]` | Get lead detail with activities + tasks |
| PATCH | `/api/leads/[id]` | Update lead (status, notes, owner) |
| DELETE | `/api/leads/[id]` | Delete lead |
| POST | `/api/leads/[id]/convert` | Convert lead → customer (creates User if needed) |

### PIPELINE — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/pipeline` | Pipeline overview (stages, counts, values) |
| GET | `/api/crm/pipeline/stages` | List pipeline stages |
| POST | `/api/crm/pipeline/stages` | Create stage (admin) |
| PATCH | `/api/crm/pipeline/stages/[id]` | Update stage (admin) |
| DELETE | `/api/crm/pipeline/stages/[id]` | Delete stage (admin) |
| GET | `/api/crm/deals` | List deals |
| POST | `/api/crm/deals` | Create deal |
| GET | `/api/crm/deals/[id]` | Deal detail |
| PATCH | `/api/crm/deals/[id]` | Update deal (stage transition etc.) |
| DELETE | `/api/crm/deals/[id]` | Archive deal |

### TASKS — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/tasks` | List tasks |
| POST | `/api/crm/tasks` | Create task |
| GET | `/api/crm/tasks/[id]` | Task detail |
| PATCH | `/api/crm/tasks/[id]` | Update task (status, priority, etc.) |
| DELETE | `/api/crm/tasks/[id]` | Delete task |

### CUSTOMERS — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/customers` | List customers |
| GET | `/api/crm/customers/[id]` | Customer detail (aggregated) |
| PATCH | `/api/crm/customers/[id]` | Update customer (admin notes, tags) |
| GET | `/api/crm/customers/[id]/timeline` | Customer activity timeline |

### COMPANIES — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/companies` | List companies |
| GET | `/api/crm/companies/[id]` | Company detail |
| POST | `/api/crm/companies` | Create company from Profile |
| PATCH | `/api/crm/companies/[id]` | Update company |
| POST | `/api/crm/companies/[id]/branches` | Add branch |
| PATCH | `/api/crm/branches/[id]` | Update branch |
| DELETE | `/api/crm/branches/[id]` | Delete branch |
| POST | `/api/crm/branches/[id]/departments` | Add department |
| PATCH | `/api/crm/departments/[id]` | Update department |
| DELETE | `/api/crm/departments/[id]` | Delete department |
| POST | `/api/crm/employees` | Add employee |
| PATCH | `/api/crm/employees/[id]` | Update employee |
| DELETE | `/api/crm/employees/[id]` | Remove employee |

### ACTIVITIES — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/activities` | List activities (filter: entityType, entityId, type, ownerId, page, limit) |
| POST | `/api/crm/activities` | Create activity record |

### DOCUMENTS — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/documents` | List documents |
| POST | `/api/crm/documents` | Upload/attach document |
| GET | `/api/crm/documents/[id]` | Get document metadata |
| DELETE | `/api/crm/documents/[id]` | Archive document |

### REMINDERS — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/reminders` | List reminders (filter: ownerId, isSent, date range) |
| POST | `/api/crm/reminders` | Create reminder |
| PATCH | `/api/crm/reminders/[id]` | Update/dismiss reminder |

### CONTACTS — `/api/crm/`

| Method | Path | Description |
|---|---|---|
| GET | `/api/crm/contacts` | List contact persons |
| POST | `/api/crm/contacts` | Create contact person |
| PATCH | `/api/crm/contacts/[id]` | Update contact |
| DELETE | `/api/crm/contacts/[id]` | Delete contact |

## Response Format

### List Endpoints
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Detail Endpoints
```json
{
  "data": {},
  "related": {},
  "aggregations": {}
}
```

### Error Format
```json
{
  "error": "Human-readable error message",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "title",
    "message": "Title is required"
  }
}
```

## Permission Mapping

| CRM Action | Permission Key | Roles |
|---|---|---|
| View leads | `crm_view_leads` | ADMIN, Company Manager |
| Create lead | `crm_create_lead` | ADMIN, Company User |
| View deals | `crm_view_deals` | ADMIN, Company Manager |
| Create deal | `crm_create_deal` | ADMIN, Company User |
| View tasks | `crm_view_tasks` | All |
| Create task | `crm_create_task` | All |
| Assign task | `crm_assign_task` | ADMIN, Company Manager |
| View customers | `crm_view_customers` | ADMIN, Company Manager |
| View companies | `crm_view_companies` | ADMIN, Company Manager |
| Manage pipeline | `crm_manage_pipeline` | ADMIN |
| View reports | `crm_view_reports` | ADMIN, Company Manager |
| Import data | `crm_import` | ADMIN |
| Export data | `crm_export` | ADMIN |

## Activity Sources (Auto-Created)

Activity records are automatically created from existing events:

| Existing Event | Activity Type | Entity Type |
|---|---|---|
| Job created | `status_change` | job, customer |
| Job status change | `status_change` | job |
| Offer accepted | `status_change` | job, deal |
| Payment released | `payment` | job, customer |
| Review left | `review` | customer, profile |
| Message sent | `message` | customer, profile |
| Task created | `task_update` | task, lead, deal, job |
| Task completed | `task_update` | task |
| Deal stage changed | `status_change` | deal |
| Lead created | `note` | lead |
| Document uploaded | `file_upload` | job, customer, profile, deal |
