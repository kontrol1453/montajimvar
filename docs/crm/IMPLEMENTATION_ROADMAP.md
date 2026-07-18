# CRM Implementation Roadmap

## Phase A — P0: Foundations (Week 1-2)

### Day 1-2: Database Migration
1. Add `Activity` model to Prisma schema
2. Run `npx prisma migrate dev --name add_activity_model`
3. Add `Task` model
4. Add `Lead` model
5. Run migration for both

### Day 3-4: Activity Engine
1. Create `/api/crm/activities` CRUD
2. Create activity auto-logging utility: `logActivity(type, subject, entityType, entityId, ownerId)`
3. Instrument existing routes to log activities:
   - Job creation → activity
   - Job status change → activity  
   - Offer accept → activity
   - Payment release → activity
   - Review left → activity

### Day 5-6: Task Management
1. Create `/api/crm/tasks` CRUD
2. Create task dashboard widget component
3. Wire task notifications via existing Notification model

### Day 7-8: Lead Management
1. Create `/api/crm/leads` CRUD
2. Implement lead → customer conversion
3. Seed leads from existing Favorites

### Day 9-10: Customer View
1. Create `GET /api/crm/customers` — list with search/filter/pagination
2. Create `GET /api/crm/customers/[id]` — aggregated detail
3. Create `GET /api/crm/customers/[id]/timeline` — unified activity timeline

## Phase B — P1: Pipeline & Companies (Week 3-4)

### Week 3: Pipeline
1. PipelineStage model + admin CRUD
2. Deal model + CRUD API
3. Auto-create Deal from Job (for new customers)
4. Pipeline dashboard widget

### Week 4: Companies
1. CompanyBranch model + API
2. Department model + API
3. Employee model + API
4. Company upgrade page (existing Profile → CRM company)

## Phase C — P2: Documents & Reporting (Week 5-6)
Document model, CRM reports, import infrastructure, customer segments

## Phase D — P3: Advanced (Week 7+)
Workflow automation, email architecture, advanced analytics

## P0 Implementation — Detailed Task Breakdown

### Task 1: Activity Model

**Schema**:
```prisma
model Activity {
  id          Int      @id @default(autoincrement())
  type        String
  subject     String
  description String?
  entityType  String
  entityId    Int
  ownerId     Int?
  metadata    Json?
  createdAt   DateTime @default(now())
  owner       User?    @relation(fields: [ownerId], references: [id])
}
```

**Utility** (`lib/crm-activity.ts`):
```typescript
export async function logActivity(params: {
  type: string;
  subject: string;
  description?: string;
  entityType: string;
  entityId: number;
  ownerId?: number;
  metadata?: Record<string, unknown>;
}) {
  await prisma.activity.create({ data: params });
}
```

**Instrumented routes**:
- `POST /api/jobs` → activity `{ type: "status_change", subject: "Job created", entityType: "job", entityId: job.id, ownerId: userId }`
- `PATCH /api/jobs/[id]` → activity on status change
- `PATCH /api/offers/[id]` (accept) → activity
- `PATCH /api/payments/[id]` → activity
- `POST /api/jobs/[id]/review` → activity

### Task 2: Task Model

**API**: `/api/crm/tasks` with full CRUD supporting:
- Filtering by status, priority, owner, related entity
- Auto-recurring task generation on completion
- Activity logging on create/update/complete

### Task 3: Lead Model

**API**: `/api/crm/leads` with:
- Source tracking (favorite, direct, referral, website, import, manual)
- Status workflow (new → contacted → qualified → converted → lost)
- Owner assignment
- Conversion to User (creates User + links to Lead)

### Task 4: Customer Aggregation

**API**: `GET /api/crm/customers/[id]` returns:
```json
{
  "customer": { /* User fields */ },
  "stats": {
    "totalJobs": 12,
    "completedJobs": 8,
    "totalSpend": 45000,
    "activeJobs": 2,
    "reviewsGiven": 5,
    "favoriteCount": 3,
    "lastActive": "2025-01-15T10:00:00Z",
    "memberSince": "2024-06-01T00:00:00Z"
  },
  "recentJobs": [ /* last 10 jobs */ ],
  "recentMessages": [ /* last 10 messages */ ],
  "segment": "active"
}
```

## Migration Commands

```bash
# Phase A migrations (sequential, additive)
npx prisma migrate dev --name add_crm_activity
npx prisma migrate dev --name add_crm_task
npx prisma migrate dev --name add_crm_lead

# Phase B migrations
npx prisma migrate dev --name add_crm_pipeline
npx prisma migrate dev --name add_crm_company

# Phase C migrations
npx prisma migrate dev --name add_crm_document
npx prisma migrate dev --name add_crm_reminder
```

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Migration conflicts with existing data | High | All new models are additive (no ALTER TABLE on existing) |
| Activity logging slows write paths | Medium | Fire-and-forget (async, no await on activity log) |
| Customer aggregation queries are slow | Medium | Add partial DB indexes, limit result sets, use pagination |
| Pipeline stages conflict with job statuses | Low | Separate concepts: pipeline = sales, job status = service delivery |
| Role permission migration incomplete | Low | Default to permissive; CRM roles can be refined iteratively |
