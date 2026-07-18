# User Personas & Workflows

## Persona 1: Customer (Job Poster)

**Profile**: Homeowner, renter, or business owner who needs furniture assembly, installation, or home improvement services.

**Signup flow**: Email/password registration → automatically gets CUSTOMER role → no profile needed.

### Workflow 1: Post a Job and Hire an Artisan

```
1. Visit montajimvar.com
2. Click "İş Ver" → 5-step wizard
3. Select category (e.g., "Mobilya Montajı")
4. Upload photos of items to assemble
5. Enter location (city, district, address)
6. Fill details: title, description, urgency, budget (AI-suggested)
7. Agree to KVKK + privacy
8. Submit → Job is live
   └── Timeline: "İş oluşturuldu" + "İş onaylandı"
9. Wait for offers (dashboard → "Tekliflerim")
10. Review offers from artisans (amount, duration, artisan profile)
11. Accept the best offer
    └── Timeline: "Teklif kabul edildi"
    └── Payment created in escrow
12. Communicate via job messages
13. Confirm work started → "in_progress"
14. Confirm work completed → "completed"
15. Leave a review (job + artisan profile)
```

### Workflow 2: Find and Hire an Artisan Directly

```
1. Visit /ara (search page)
2. Filter by category + city
3. Browse artisan profiles (view ratings, reviews, photos)
4. Click "İletişime Geç" → sends a direct message
5. Negotiate terms via messages
6. Artisan creates a custom job or customer posts a job
```

### Workflow 3: Track Budget

```
1. Visit dashboard → see "Aktif İş Bütçesi" and "Bu Ay Harcanan"
2. View individual job costs
3. No per-category or per-month budget breakdown exists
```

---

## Persona 2: Artisan (ASSEMBLER / MANUFACTURER)

**Profile**: Professional assembly technicians, furniture movers, handymen, or manufacturing workshop owners.

**Signup flow**: Email/password → must create a company profile (FirmaForm) to access artisan workflows.

### Workflow 1: Set Up Profile

```
1. Register → get ASSEMBLER or MANUFACTURER role
2. Visit /dashboard/firma
3. Fill: company name, categories (multi-select), primary category, city
4. Add: working cities (multi-select from 81 Turkish cities)
5. Add: description, address, phone, WhatsApp, website
6. Toggle: insurance, guarantee
7. Optionally: add lat/lng coordinates
8. Submit → profile created (approval not required)
9. Add portfolio photos via ImageGallery
```

### Workflow 2: Find and Bid on Jobs

```
1. Visit /is-ilanlari job listing page
2. Search/filter by category, city, budget
3. Click a job → read details (photos, description, budget range)
4. Click "Teklif Ver" → enter amount, duration, note
5. Submit → offer is pending
   └── If first offer on this job: job status → "offers_received"
6. Wait for customer response
7. If accepted → job appears in dashboard
8. If rejected → job is closed
9. If withdrawn → offer is retracted
```

### Workflow 3: Execute Job

```
1. Accepted offer → job in "assigned" status
2. Contact customer via job messages
3. Travel to location (address + coordinates available)
4. Arrive → mark "in_progress" (or customer does)
5. Complete work → mark "completed" (customer does)
6. In dashboard: release escrow payment → "paid"
7. This month's earnings update in /dashboard/gelirler
```

### Workflow 4: Premium Subscription

```
1. Visit /dashboard/uyelik
2. Browse subscription plans (Free / Premium tiers)
3. Select plan → if free, immediate activation
4. If paid: "Ödeme entegrasyonu yakında aktif olacak"
5. Premium benefits (according to UI):
   - Higher search ranking (not implemented)
   - Premium badge on profile
   - Showcase/vitrin support
   - Advanced analytics
```

### Workflow 5: Manage Reputation

```
1. Profile shows: ratingAvg (5-star), reviewCount, completedJobs
2. Customers leave firm reviews (upsert — one per customer)
3. Job reviews (per-job) are separate
4. Favorites count shows popularity
5. View analytics: profile views, sent messages, offer counts
```

---

## Persona 3: Admin

**Profile**: Platform operator managing users, jobs, disputes, and content.

### Workflow 1: Platform Monitoring

```
1. Visit /admin → admin dashboard
2. View summary stats:
   - Platform: total users, profiles, jobs, offers, reviews
   - Marketplace: jobs with/without offers, completion rate, acceptance rate
   - Operations: unverified profiles, open disputes, pending certificates
   - Financial: total revenue, total commission, subscription revenue
3. Drill into specific sections
```

### Workflow 2: User Management

```
1. View all users via admin users list (GET /api/admin/users)
2. View profiles via admin profiles (GET /api/admin/profiles)
3. Admin search across users, profiles, jobs
4. Admin export of platform data
```

### Workflow 3: Dispute Resolution

```
1. View disputes list (GET /api/admin/disputes)
2. Each dispute shows: job title, opener, payment amount/status
3. Currently read-only — no resolve/dismiss actions available
```

### Workflow 4: Content Management

```
1. Manage categories (CRUD)
2. Manage skills (verify artisan certificates)
3. Manage blog + blog categories
4. Manage city landing pages for SEO
5. Manage subscription plans
6. Send push notifications (via /send-push)
```

---

## Persona 4: Visitor (Unauthenticated)

**Current limitations:**
- Can browse public job listings
- Can view artisan profiles
- Cannot see prices/offers
- Cannot message
- Must register to post jobs or submit offers

---

## Cross-Persona Interaction Matrix

| Action | Customer | Artisan | Admin | Visitor |
|---|---|---|---|---|
| Browse jobs | ✅ | ✅ | ✅ | ✅ |
| View profile | ✅ | ✅ | ✅ | ✅ |
| Post job | ✅ | ❌ | ❌ | ❌ |
| Submit offer | ❌ | ✅ | ❌ | ❌ |
| Accept offer | ✅ | ❌ | ✅ | ❌ |
| Message | ✅ (job + direct) | ✅ (job + direct) | ❌ | ❌ |
| Review | ✅ (profile + job) | ❌ | ❌ | ❌ |
| Release payment | ❌ | ✅ | ✅ | ❌ |
| Cancel job | ✅ | ❌ | ✅ | ❌ |
| Manage platform | ❌ | ❌ | ✅ | ❌ |
