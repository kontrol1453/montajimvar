# Matching Engine Review

## Current Matching Mechanism

Montajım Var does **not** have a dedicated matching algorithm. The current "matching" is purely manual/self-service:

### How Artisans Find Jobs

1. **Browse open jobs**: Artisans navigate to job listing pages and browse/filter
2. **Search**: `GET /api/jobs` supports search by `q` (text search on title/description), category, city, status
3. **Manual offer submission**: Artisan finds a job → reads details → submits offer with their price

### How Customers Find Artisans

1. **Search**: `GET /api/profiles` supports filtering by `categoryId`, `city`, `q` (text search on company name/description)
2. **Browse**: Listing pages with profiles sorted by `createdAt desc`
3. **No recommendation, no ranking, no relevance scoring**

## What's Missing for a True Matching Engine

### 1. Ranking & Relevance
- No profile ranking (best match, rating, distance)
- No job-to-artisan relevance scoring
- No "recommended for you" section
- Search results ordered by `createdAt desc` only

### 2. Profile Completeness Scoring
- Profiles have partial data (missing phone, website, coordinates are common)
- No completion score to encourage full profiles
- No validation that workingCities, categories, photos are filled

### 3. Location-Based Matching
- Coordinates exist on both jobs (address) and profiles (latitude/longitude) but never used
- `workingCities` stored as JSON string, never indexed or queried
- No radius/distance calculation
- No geocoding (users manually enter lat/lng)

### 4. Smart Recommendations
- No category-affinity scoring (what categories does this artisan work in vs. what job needs)
- No history-based recommendations (similar jobs the artisan completed before)
- No "artisans also viewed" or "customers also hired" patterns

### 5. Automated Matching
- No push notifications when a matching job is posted
- No email alerts for saved searches
- No auto-invite to bid on matching jobs

## What Exists That Could Be Repurposed

### AI Price Estimation (`/api/analyze`)
- `price-analyzer.ts` has category → base price mapping
- `vision-analyzer.ts` uses Gemini Vision for photo analysis
- Already called from job creation wizard
- Could be extended to estimate required artisan count, skill level, tooling

### Premium/Subscription
- Premium artisans get "higher search ranking" (stated in UI, but no ranking code exists)
- Premium badge displayed on profile
- Subscription plans are modeled

### Categories
- Jobs have multiple categories (JobCategory join table)
- Artisans have multiple categories (ProfileCategory join table)
- This is the primary matching axis: match Job.categories ∩ Profile.categories

## Recommendations

### P0 (Critical Path)
1. **Add profile ranking** by rating + premium status + job completion count
2. **Create job-artisan match score** based on category overlap + city match + rating
3. **Add geolocation matching** using lat/lng coordinates

### P1 (High Value)
4. **Index `workingCities`** — convert from JSON string to proper Many-to-Many
5. **Add search relevance scoring** — weight title matches > description matches > category matches
6. **Build "similar jobs" and "recommended artisans"** widgets

### P2 (Enhancement)
7. **Auto-invite top-rated artisans** to matching new jobs
8. **Email/push notifications** for new matching jobs
9. **Artisan "job feed"** with personalized recommendations
