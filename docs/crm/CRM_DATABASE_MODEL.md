# CRM Database Model

## New Models (Prisma Schema Additions)

```prisma
// ─── LEAD MANAGEMENT ───

model Lead {
  id          Int      @id @default(autoincrement())
  source      String   // "favorite" | "direct" | "referral" | "website" | "import" | "manual"
  status      String   @default("new") // new, contacted, qualified, converted, lost
  customerId  Int?     // Converted to existing user
  profileId   Int?     // Company lead (for B2B)
  name        String?
  email       String?
  phone       String?
  city        String?
  notes       String?
  budget      Decimal?
  probability Int      @default(10) // 0-100
  ownerId     Int?     // Assigned user/admin
  convertedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  customer    User?     @relation(fields: [customerId], references: [id])
  profile     Profile?  @relation(fields: [profileId], references: [id])
  owner       User?     @relation("LeadOwner", fields: [ownerId], references: [id])
  activities  Activity[]
  tasks       Task[]
}

// ─── PIPELINE ───

model PipelineStage {
  id          Int      @id @default(autoincrement())
  name        String   // "Yeni Talep", "Kalifiye", "Teklif", "Görüşme", "Kazanıldı", "Kaybedildi"
  slug        String   @unique
  sortOrder   Int      @default(0)
  color       String   @default("#0B5FFF")
  probability Int      @default(50) // Default win probability %
  isDefault   Boolean  @default(false)
  isFinal     Boolean  @default(false) // terminal: won/lost/archived
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  deals       Deal[]
}

model Deal {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  value       Decimal  @default(0)
  probability Int      @default(50)
  stageId     Int
  customerId  Int?
  profileId   Int?     // B2B
  ownerId     Int?
  jobId       Int?     // Linked marketplace job (if converted)
  expectedCloseAt DateTime?
  closedAt    DateTime?
  lostReason  String?
  nextAction  String?
  nextActionDate DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  stage       PipelineStage @relation(fields: [stageId], references: [id])
  customer    User?         @relation(fields: [customerId], references: [id])
  profile     Profile?      @relation(fields: [profileId], references: [id])
  owner       User?         @relation("DealOwner", fields: [ownerId], references: [id])
  job         Job?          @relation(fields: [jobId], references: [id])
  activities  Activity[]
  tasks       Task[]
}

// ─── TASK MANAGEMENT ───

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  priority    String    @default("medium") // low, medium, high, urgent
  status      String    @default("pending") // pending, in_progress, completed, cancelled
  dueDate     DateTime?
  completedAt DateTime?
  ownerId     Int
  relatedJobId  Int?
  relatedLeadId Int?
  relatedDealId Int?
  customerId  Int?
  profileId   Int?
  isRecurring Boolean   @default(false)
  recurringRule String? // "daily" | "weekly" | "monthly" | cron expression
  checklist   Json?     // [{text: string, done: boolean}]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  owner       User      @relation(fields: [ownerId], references: [id])
  relatedJob  Job?      @relation(fields: [relatedJobId], references: [id])
  relatedLead Lead?     @relation(fields: [relatedLeadId], references: [id])
  relatedDeal Deal?     @relation(fields: [relatedDealId], references: [id])
  customer    User?     @relation("TaskCustomer", fields: [customerId], references: [id])
  profile     Profile?  @relation(fields: [profileId], references: [id])
  activities  Activity[]
}

// ─── UNIFIED ACTIVITY TIMELINE ───

model Activity {
  id          Int      @id @default(autoincrement())
  type        String   // "note" | "call" | "email" | "message" | "status_change" | "task_update" | "payment" | "review" | "file_upload" | "meeting"
  subject     String   // Short description
  description String?
  entityType  String   // "lead" | "deal" | "job" | "customer" | "profile" | "task"
  entityId    Int
  ownerId     Int?
  metadata    Json?    // Extra data (call duration, email subject, etc.)
  createdAt   DateTime @default(now())

  owner       User?    @relation(fields: [ownerId], references: [id])
}

// ─── COMPANY CRM ───

model CompanyBranch {
  id          Int      @id @default(autoincrement())
  profileId   Int      // Parent company (Profile)
  name        String
  address     String?
  city        String?
  phone       String?
  email       String?
  managerId   Int?     // Branch manager (User)
  latitude    Float?
  longitude   Float?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  profile     Profile  @relation(fields: [profileId], references: [id])
  manager     User?    @relation(fields: [managerId], references: [id])
  departments Department[]
}

model Department {
  id          Int      @id @default(autoincrement())
  branchId    Int
  name        String
  description String?
  managerId   Int?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  branch      CompanyBranch @relation(fields: [branchId], references: [id])
  manager     User?         @relation(fields: [managerId], references: [id])
  employees   Employee[]
}

model Employee {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  departmentId Int?
  position    String?
  title       String?
  phone       String?
  isActive    Boolean  @default(true)
  joinedAt    DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
  department  Department? @relation(fields: [departmentId], references: [id])
}

// ─── DOCUMENT MANAGEMENT ───

model Document {
  id          Int      @id @default(autoincrement())
  name        String
  type        String   // "contract" | "invoice" | "certificate" | "insurance" | "photo" | "report" | "other"
  fileUrl     String
  fileSize    Int?
  mimeType    String?
  entityType  String   // "job" | "customer" | "profile" | "deal" | "lead"
  entityId    Int
  uploadedById Int
  version     Int      @default(1)
  isArchived  Boolean  @default(false)
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  uploadedBy  User     @relation(fields: [uploadedById], references: [id])
}

// ─── CONTACT PERSON ───

model ContactPerson {
  id          Int      @id @default(autoincrement())
  profileId   Int?     // Company
  customerId  Int?     // Or customer (not both, but either)
  name        String
  email       String?
  phone       String?
  position    String?
  isPrimary   Boolean  @default(false)
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  profile     Profile? @relation(fields: [profileId], references: [id])
  customer    User?    @relation(fields: [customerId], references: [id])
}

// ─── REMINDER ───

model Reminder {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  remindAt    DateTime
  entityType  String?  // "task" | "deal" | "job" | "lead"
  entityId    Int?
  ownerId     Int
  isSent      Boolean  @default(false)
  createdAt   DateTime @default(now())

  owner       User     @relation(fields: [ownerId], references: [id])
}
```

## Existing Models Used by CRM (No Changes Needed)

| Model | CRM Usage |
|---|---|
| `User` | Customer identity, employee identity, activity owner |
| `Profile` | Company profile, B2B customer |
| `Job` | Deal conversion target, service record |
| `JobTimeline` | Job-scoped timeline (source for Activity records) |
| `Offer` | Bid history |
| `Payment` | Financial record |
| `Review` | Customer feedback |
| `Message` | Communication log |
| `Notification` | Admin alerts |
| `AdminAuditLog` | Admin action trail |
| `RolePermission` | CRM action authorization |

## Migration Strategy

1. **Phase A (P0)**: Add `Lead`, `Task`, `Activity`, `PipelineStage`, `Deal` models — no FK constraints on existing tables
2. **Phase B (P1)**: Add `ContactPerson`, `Reminder` — extend via optional nullable FKs
3. **Phase C (P2)**: Add `CompanyBranch`, `Department`, `Employee`, `Document` — requires Profile extension
4. **No destructive migrations**: All new models are additive, no existing tables altered
