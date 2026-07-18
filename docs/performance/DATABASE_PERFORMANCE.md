# Database Performance Audit

## Schema

- 25+ models (User, Profile, Job, Offer, Payment, Dispute, etc.)
- Prisma ORM with PostgreSQL (via Supabase)
- Many-to-many: JobCategory, ProfileCategory, ArtisanSkill

## Query Analysis

### Heavy Queries (from sitemap.ts)
```ts
// sitemap.ts — runs 5+ full table scans
prisma.profile.findMany({ select: { id: true, updatedAt: true }, orderBy: { updatedAt: "desc" } })
prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } })
prisma.category.findMany({ select: { slug: true } })
prisma.cityServicePage.findMany({ select: { slug: true, updatedAt: true } })
```

**Impact**: Full table scans on every sitemap request. Generates a massive response on large datasets.

### Heavy Queries (from homepage)
```ts
prisma.profile.findMany({ select: { city: true }, distinct: ["city"] })
prisma.category.findMany({ where: { parentId: null, isActive: true }, include: { children: { where: { isActive: true } } } })
```

### N+1 Risks
- `Job` → `offers.artisan` — nested relation loading
- `Profile` → `categories.category` — batch loading via `include` (OK if indexed)
- User detail page loads `adminAuditLog` then separate admin user queries

### Missing Indexes (recommended)
```sql
-- High-traffic queries
CREATE INDEX IF NOT EXISTS idx_profile_city ON "Profile"("city");
CREATE INDEX IF NOT EXISTS idx_job_status_city ON "Job"("status", "city");
CREATE INDEX IF NOT EXISTS idx_offer_job_status ON "Offer"("jobId", "status");
CREATE INDEX IF NOT EXISTS idx_payment_status ON "Payment"("status");
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_entity ON "AdminAuditLog"("entity", "entityId");
CREATE INDEX IF NOT EXISTS idx_blog_post_published ON "BlogPost"("isPublished", "publishedAt");
```

## Recommendations

### P0 — Immediate
1. Add composite indexes for top queries (job status+city, profile city)
2. Cache sitemap output (see cache strategy)
3. Add pagination to sitemap profile queries (limit 50000)

### P1 — Short-term
4. Add `EXPLAIN ANALYZE` for slow queries
5. Add Prisma query logging in dev
6. Add connection pooling configuration

### P2 — Medium-term
7. Add read replicas for analytics queries
8. Implement materialized views for dashboard aggregations
9. Add database monitoring (pg_stat_statements)
