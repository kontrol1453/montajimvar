# Company CRM Specification

## Current State

Companies are represented by the `Profile` model, which already includes:
- `companyName`, `description`, `categoryId`, `city`, `address`
- `phone`, `website`, `whatsapp`
- `latitude`, `longitude` (coordinates)
- `hasInsurance`, `hasGuarantee`
- `workingCities` (JSON string)
- `categoryId` + `categories` (via ProfileCategory join)
- `ratingAvg`, `reviewCount`, `viewCount`
- `isVerified`, `isFeatured`
- `premiumUntil`, `subscriptionId`
- `profileImages` (via ProfileImage model)

This is already a robust company record — the CRM enhancement adds organizational hierarchy and enterprise features.

## Enhancement: Company Hierarchy

### Single Company (Sole Proprietor) — Existing
```
Profile (company)
└── User (owner)
```

### Multi-Branch Enterprise
```
Profile (company HQ)
├── CompanyBranch (Şişli office)
│   ├── Department (Montaj Ekibi)
│   │   └── Employee (Ahmet - team lead)
│   │   └── Employee (Mehmet - technician)
│   └── Department (Satış)
│       └── Employee (Ayşe - sales rep)
├── CompanyBranch (Kadıköy office)
│   ├── Department (Montaj Ekibi)
│   └── Department (Müşteri Hizmetleri)
└── ContactPerson (Ali - procurement manager)
```

## Branch Management

| Field | Type | Description |
|---|---|---|
| `name` | String | Branch name (e.g., "Kadıköy Şubesi") |
| `address` | Text? | Physical address |
| `city` | String? | City |
| `phone` | String? | Branch phone |
| `email` | String? | Branch email |
| `managerId` | Int? | Branch manager (User) |
| `latitude/longitude` | Float? | Map coordinates |
| `isActive` | Boolean | Soft disable |

## Department Management

| Field | Type | Description |
|---|---|---|
| `name` | String | Department name |
| `description` | Text? | Department purpose |
| `managerId` | Int? | Department head |
| `isActive` | Boolean | Soft disable |

## Employee Management

| Field | Type | Description |
|---|---|---|
| `userId` | Int (unique) | Linked User account |
| `departmentId` | Int? | Department assignment |
| `position` | String? | Role within company |
| `title` | String? | Job title |
| `isActive` | Boolean | Employment status |
| `joinedAt` | DateTime | Hire date |

## Company CRM API

### `GET /api/crm/companies` — List companies
```
?search=name|city|category&isVerified=true&page=1&limit=20
→ { companies, pagination }
```

### `GET /api/crm/companies/[id]` — Company detail
```
→ Full company profile with:
  ├── Branches
  ├── Departments (per branch)
  ├── Employees (per department)
  ├── Contact Persons
  ├── Job History (jobs where this company's employees were assigned)
  ├── Reviews (firm reviews)
  ├── Documents (contracts, certificates)
  ├── Subscription Status
  └── Activity Timeline
```

### `POST /api/crm/companies` — Create company (from Profile)
```json
{ "profileId": 5 }
// Upgrades an existing Profile to full CRM company
```

### `POST /api/crm/companies/[id]/branches` — Add branch
### `PATCH /api/crm/branches/[id]` — Update branch
### `DELETE /api/crm/branches/[id]` — Remove branch

### `POST /api/crm/branches/[id]/departments` — Add department
### `PATCH /api/crm/departments/[id]` — Update department

### `POST /api/crm/employees` — Add employee
```json
{ "userId": 10, "departmentId": 3, "position": "Montaj Teknisyeni", "title": "Kıdemli Usta" }
```
### `PATCH /api/crm/employees/[id]` — Update employee
### `DELETE /api/crm/employees/[id]` — Remove employee

## Company Dashboard Widgets

1. **Company Health**: Profile completeness score, verification status, premium status
2. **Employee Roster**: Active employees, department breakdown
3. **Branch Map**: Geographic distribution (if multi-branch)
4. **Job Distribution**: Jobs by branch/department over time
5. **Performance**: Rating trend, completion rate, response time

## Integration with Subscription

Premium subscription plans should map to company features:
- Free: 1 branch, 1 department, 5 employees
- Premium: 3 branches, 5 departments, 20 employees
- Enterprise: Unlimited
