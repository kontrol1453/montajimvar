# AI Services Specification

## Service Inventory

| Service | ID | Priority | Sync/Async | Provider | Current State |
|---|---|---|---|---|---|
| Photo Analysis | `photo_analysis` | P1 | Async | Gemini/OpenAI | Live (sync, no prompt mgmt) |
| Job Analysis | `job_analysis` | P1 | Async | Gemini | Not built |
| Price Estimation | `price_estimation` | P2 | Sync | Rules + AI | Live (rules only) |
| Duration Estimation | `duration_estimation` | P2 | Sync | Rules + AI | Partial (in price-analyzer) |
| Material Estimation | `material_estimation` | P2 | Sync | AI | Not built |
| Risk Analysis | `risk_analysis` | P2 | Async | AI | Not built |
| Installer Recommendation | `recommendation` | P1 | Sync | Rules + AI | Not built |
| Route Optimization | `route_optimization` | P3 | Async | AI/API | Not built |
| Quality Inspection | `quality_inspection` | P3 | Async | AI | Not built |
| Quote Drafting | `quote_drafting` | P2 | Async | AI | Not built |
| Knowledge Assistant | `knowledge_assistant` | P3 | Sync | AI | Not built |
| Document Analysis | `document_analysis` | P3 | Async | AI | Not built |

## Service Interface

```typescript
// lib/ai/services/base.ts
interface AIService<TInput, TOutput> {
  serviceId: string;
  validate(input: TInput): ValidationResult;
  execute(input: TInput): Promise<ServiceResult<TOutput>>;
}

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  confidence: number;
  warnings: string[];
  auditEntry: AIAuditLog;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

## Photo Analysis Service

```typescript
interface PhotoAnalysisInput {
  photoUrls: string[];
  categoryIds?: number[];
  description?: string;
}

interface PhotoAnalysisOutput {
  products: Array<{ name: string; count: number; confidence: number }>;
  difficulty: "easy" | "medium" | "hard";
  difficultyConfidence: number;
  estimatedHours: number;
  estimatedWorkers: number;
  specialTools: string[];
  risks: string[];
  missingInfo: string[];
  suggestedQuestions: string[];
}
```

## Job Analysis Service

```typescript
interface JobAnalysisInput {
  title: string;
  description: string;
  categoryIds: number[];
  city: string;
  urgency: string;
  photoCount: number;
  budgetMin?: number;
  budgetMax?: number;
}

interface JobAnalysisOutput {
  descriptionQuality: "low" | "medium" | "high";
  missingDetails: string[];
  requiredCertifications: string[];
  requiredEquipment: string[];
  safetyConcerns: string[];
  estimatedDifficulty: "easy" | "medium" | "hard" | "expert";
  estimatedDuration: { min: number; max: number; unit: "hours" | "days" };
  estimatedWorkforce: { min: number; max: number };
  materialRequirements: string[];
  recommendations: string[];
}
```

## Installer Recommendation Service

```typescript
interface RecommendationInput {
  jobId: number;
  categoryIds: number[];
  city: string;
  budgetMin?: number;
  budgetMax?: number;
  urgency?: string;
  limit?: number;
}

interface RecommendationOutput {
  recommendations: Array<{
    profileId: number;
    userId: number;
    companyName: string;
    score: number;
    signals: {
      categoryMatch: number;
      cityMatch: number;
      rating: number;
      completedJobs: number;
      acceptanceRate: number;
      responseTime: number;
      premium: boolean;
      distance?: number;
    };
  }>;
}
```

## Price Estimation Service (Enhanced)

```typescript
interface PriceEstimationInput {
  categoryIds: number[];
  categoryNames: string[];
  city: string;
  urgency: string;
  description: string;
  photoCount: number;
  historicalData?: HistoricalPriceData[];
}

interface PriceEstimationOutput {
  estimatedRange: { min: number; max: number; suggested: number };
  confidence: number;
  breakdown: {
    labor: { min: number; max: number };
    materials?: { min: number; max: number };
    travel?: number;
    platformFee: number;
  };
  factors: Array<{ name: string; impact: number; description: string }>;
  similarJobs: Array<{ title: string; amount: number; city: string }>;
}
```

## API Endpoint Mapping

| Endpoint | Service | Method | Auth |
|---|---|---|---|
| `/api/ai/analyze` | Photo + Price | POST | Required |
| `/api/ai/analyze/photo` | Photo only | POST | Required |
| `/api/ai/analyze/job` | Job analysis | POST | Required |
| `/api/ai/estimate` | Price estimation | POST | Required |
| `/api/ai/recommend/installers` | Recommendation | POST | Required |
| `/api/ai/risk` | Risk analysis | POST | Required |
| `/api/ai/quote` | Quote draft | POST | Required |
| `/api/ai/knowledge` | Knowledge query | POST | Required |

All endpoints support `?async=true` for heavy operations.
