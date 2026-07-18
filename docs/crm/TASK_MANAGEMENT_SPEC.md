# Task Management Specification

## Purpose

Task management enables platform staff, admins, and company users to track operational to-dos, follow-ups, and recurring activities. Tasks are the atomic unit of CRM productivity.

## Task Model

| Field | Type | Description |
|---|---|---|
| `title` | String (required) | Task title |
| `description` | Text? | Detailed notes |
| `priority` | Enum | `low` | `medium` | `high` | `urgent` |
| `status` | Enum | `pending` | `in_progress` | `completed` | `cancelled` |
| `dueDate` | DateTime? | Deadline |
| `completedAt` | DateTime? | Auto-set on completion |
| `ownerId` | Int (required) | Who owns the task |
| `relatedJobId` | Int? | Linked marketplace Job |
| `relatedLeadId` | Int? | Linked Lead |
| `relatedDealId` | Int? | Linked Deal |
| `customerId` | Int? | Linked Customer |
| `profileId` | Int? | Linked Company |
| `isRecurring` | Boolean | Auto-generate on completion |
| `recurringRule` | String? | `daily` / `weekly` / `monthly` / cron |
| `checklist` | JSON? | Sub-task list: `[{text, done}]` |

## Task Lifecycle

```
pending ──► in_progress ──► completed
   │                           │
   └──► cancelled              └──► auto-recur (if recurring)
```

## API Endpoints

### `GET /api/crm/tasks` — List tasks
```
?status=pending&priority=high&ownerId=1&relatedJobId=1&page=1&limit=20
→ { tasks, pagination }
```

### `POST /api/crm/tasks` — Create task
```json
{
  "title": "Send quote to Acme Corp",
  "priority": "high",
  "dueDate": "2025-02-01T10:00:00Z",
  "ownerId": 1,
  "relatedDealId": 3,
  "checklist": [
    { "text": "Calculate estimate", "done": false },
    { "text": "Get manager approval", "done": false }
  ]
}
```

### `PATCH /api/crm/tasks/[id]` — Update task
```json
{ "status": "completed" }
// Auto-sets completedAt, optionally creates recurring task
```

### `DELETE /api/crm/tasks/[id]` — Delete task

## Task Views

### My Tasks (User Dashboard)
- Filter: All, Today, This Week, Overdue
- Sort: Priority (urgent first), Due Date (nearest first), Created
- Group: By related entity (Lead, Deal, Job)

### Team Tasks (Admin/Manager)
- Same filters + by owner, by department
- Workload view: tasks per person

### Related Entity Tasks
- When viewing a Deal, Lead, or Job, show associated tasks inline

## Recurring Tasks

Recurring tasks auto-generate a new task when the current instance completes:

| Rule | Example | Creates next |
|---|---|---|
| `daily` | "Check new leads" | Tomorrow |
| `weekly` | "Weekly report" | Next Monday |
| `monthly` | "Invoice generation" | Same day next month |
| `weekdays` | "Follow up pending" | Next weekday |
| Custom cron | `0 9 * * 1` | Per cron schedule |

## Task Notifications

1. **Deadline approaching**: Reminder 24h before dueDate
2. **Overdue**: Alert if past dueDate and not completed
3. **Assignment**: Notify when task assigned to you
4. **Completion**: Notify task creator when completed

## Integration with Existing Code

- **Activity Feed**: Task create/update/complete → Activity record
- **Dashboard**: Task widget on `/dashboard` and admin dashboard
- **Notifications**: Use existing `Notification` model for task alerts
- **Permissions**: Route through `hasPermission()` with new feature keys: `create_task`, `assign_task`, `complete_task`

## Task Priority Matrix

| Priority | SLA | Color | Icon |
|---|---|---|---|
| Urgent | < 4 hours | `#EF4444` (red) | 🔴 |
| High | < 24 hours | `#F59E0B` (amber) | 🟡 |
| Medium | < 72 hours | `#0B5FFF` (blue) | 🔵 |
| Low | < 1 week | `#6B7280` (gray) | ⚪ |
