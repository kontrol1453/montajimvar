interface InstallerProfile {
  id: number;
  userId: number;
  companyName: string;
  city: string;
  workingCities: string[];
  categoryIds: number[];
  ratingAvg: number;
  reviewCount: number;
  completedJobs: number;
  totalOffers: number;
  acceptedOffers: number;
  avgResponseTimeHours: number;
  premiumUntil: Date | null;
  hasInsurance: boolean;
  hasGuarantee: boolean;
}

interface JobRequirements {
  categoryIds: number[];
  city: string;
}

interface ScoreResult {
  score: number;
  breakdown: {
    categoryMatch: number;
    cityMatch: number;
    rating: number;
    experience: number;
    acceptanceRate: number;
    responseTime: number;
    premium: number;
    insuranceGuarantee: number;
  };
}

const WEIGHTS = {
  CATEGORY_MATCH: 0.25,
  CITY_MATCH: 0.20,
  RATING: 0.10,
  EXPERIENCE: 0.10,
  ACCEPTANCE_RATE: 0.10,
  RESPONSE_TIME: 0.05,
  PREMIUM: 0.05,
  INSURANCE_GUARANTEE: 0.05,
  REVIEW_COUNT: 0.05,
  TOTAL_OFFERS: 0.05,
};

export function scoreInstaller(installer: InstallerProfile, job: JobRequirements): ScoreResult {
  const breakdown = {
    categoryMatch: 0,
    cityMatch: 0,
    rating: 0,
    experience: 0,
    acceptanceRate: 0,
    responseTime: 0,
    premium: 0,
    insuranceGuarantee: 0,
  };

  if (job.categoryIds.length > 0) {
    const overlap = installer.categoryIds.filter((c) => job.categoryIds.includes(c)).length;
    breakdown.categoryMatch = Math.round((overlap / job.categoryIds.length) * 100);
  }

  if (installer.city === job.city) {
    breakdown.cityMatch = 100;
  } else if (installer.workingCities.includes(job.city)) {
    breakdown.cityMatch = 60;
  }

  breakdown.rating = Math.round((installer.ratingAvg / 5) * 100);

  const cappedJobs = Math.min(installer.completedJobs, 100);
  breakdown.experience = Math.round((cappedJobs / 100) * 100);

  if (installer.totalOffers > 0) {
    breakdown.acceptanceRate = Math.round((installer.acceptedOffers / installer.totalOffers) * 100);
  }

  if (installer.avgResponseTimeHours < 1) {
    breakdown.responseTime = 100;
  } else if (installer.avgResponseTimeHours < 24) {
    breakdown.responseTime = 60;
  } else if (installer.avgResponseTimeHours < 72) {
    breakdown.responseTime = 30;
  }

  if (installer.premiumUntil && installer.premiumUntil > new Date()) {
    breakdown.premium = 100;
  }

  if (installer.hasInsurance) breakdown.insuranceGuarantee += 50;
  if (installer.hasGuarantee) breakdown.insuranceGuarantee += 50;

  const score = Math.round(
    breakdown.categoryMatch * WEIGHTS.CATEGORY_MATCH +
    breakdown.cityMatch * WEIGHTS.CITY_MATCH +
    breakdown.rating * WEIGHTS.RATING +
    breakdown.experience * WEIGHTS.EXPERIENCE +
    breakdown.acceptanceRate * WEIGHTS.ACCEPTANCE_RATE +
    breakdown.responseTime * WEIGHTS.RESPONSE_TIME +
    breakdown.premium * WEIGHTS.PREMIUM +
    breakdown.insuranceGuarantee * WEIGHTS.INSURANCE_GUARANTEE
  );

  return { score, breakdown };
}
