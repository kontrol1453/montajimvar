import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Stack } from "@/components/ui/Typography";
import { SectionErrorBoundary } from "@/components/admin/SectionContainer";
import CommandHeader from "./CommandHeader";
import AttentionCenter from "./AttentionCenter";
import PlatformPulse from "./PlatformPulse";
import MarketplaceHealth from "./MarketplaceHealth";
import OperationsCenter from "./OperationsCenter";
import FinancialOverview from "./FinancialOverview";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";

interface SummaryData {
  platform: {
    totalUsers: number;
    totalProfiles: number;
    totalJobs: number;
    totalOffers: number;
    totalJobReviews: number;
    totalFirmReviews: number;
  };
  marketplace: {
    jobsWithOffers: number;
    jobsWithoutOffers: number;
    jobsEligibleForOffers: number;
    averageOffersPerJob: number;
    acceptedOffers: number;
    offerAcceptanceRate: number;
    completedJobs: number;
    cancelledJobs: number;
    completionRate: number;
    activeJobs: number;
    pendingJobs: number;
    offersReceivedJobs: number;
  };
  operations: {
    unverifiedProfiles: number;
    openDisputes: number;
    totalDisputes: number;
    pendingCertificates: number;
  };
  financial: {
    totalRevenue: number;
    totalCommission: number;
    totalPayments: number;
    latestPayment: string | null;
    subscriptionRevenue: number;
    subscriptionCount: number;
  };
  recentUsers?: { id: number; name: string; email: string; createdAt: Date | string }[];
  recentProfiles?: { id: number; companyName: string; city: string | null; createdAt: Date | string; user: { name: string } }[];
  recentJobs?: { id: number; title: string; status: string; city: string; createdAt: Date | string; customer: { name: string } }[];
  recentDisputes?: { id: number; reason: string; status: string; createdAt: Date | string; openedBy: { name: string } }[];
  recentAuditLogs?: { id: number; action: string; entity: string; entityId: number; details: any; createdAt: Date | string }[];
}

async function fetchSummary(): Promise<SummaryData | null> {
  try {
    const session = await auth();
    if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
      return null;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      userCount,
      profileCount,
      jobCount,
      offerCount,
      paymentAgg,
      disputeCount,
      openDisputeCount,
      unverifiedProfileCount,
      pendingSkillCount,
      jobStatusCounts,
      offerStatusCounts,
      jobReviewCount,
      firmReviewCount,
      subscriptionPaymentAgg,
      recentUsers,
      recentProfiles,
      recentJobs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.profile.count(),
      prisma.job.count(),
      prisma.offer.count(),
      prisma.payment.aggregate({
        _sum: { amount: true, commission: true },
        _count: true,
        _max: { createdAt: true },
      }),
      prisma.dispute.count(),
      prisma.dispute.count({ where: { status: "open" } }),
      prisma.profile.count({ where: { isVerified: false } }),
      prisma.artisanSkill.count({ where: { verified: false } }),
      prisma.job.groupBy({ by: ["status"], _count: true }),
      prisma.offer.groupBy({ by: ["status"], _count: true }),
      prisma.jobReview.count(),
      prisma.review.count(),
      prisma.subscriptionPayment.aggregate({
        _sum: { amount: true },
        _count: true,
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.profile.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, companyName: true, city: true, createdAt: true, user: { select: { name: true } } },
      }),
      prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, title: true, status: true, city: true, createdAt: true, customer: { select: { name: true } } },
      }),
      prisma.dispute.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, reason: true, status: true, createdAt: true, openedBy: { select: { name: true } } },
      }),
      prisma.adminAuditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, action: true, entity: true, entityId: true, details: true, createdAt: true },
      }),
    ]);

    const jobsByStatus = Object.fromEntries(
      jobStatusCounts.map((s) => [s.status, s._count])
    );
    const offersByStatus = Object.fromEntries(
      offerStatusCounts.map((s) => [s.status, s._count])
    );

    const activeStatuses = ["assigned", "en_route", "in_progress"];
    const activeJobs = activeStatuses.reduce(
      (sum, s) => sum + (jobsByStatus[s] || 0), 0
    );

    const totalJobsWithOffers = await prisma.job.count({
      where: { offers: { some: {} }, status: { not: "cancelled" } },
    });
    const totalJobsWithoutOffers = await prisma.job.count({
      where: {
        offers: { none: {} },
        status: { notIn: ["cancelled", "completed"] },
      },
    });

    const completedCount = jobsByStatus["completed"] || 0;
    const cancelledCount = jobsByStatus["cancelled"] || 0;
    const pendingJobs = jobsByStatus["pending"] || 0;
    const offersReceivedCount = jobsByStatus["offers_received"] || 0;

    return {
      platform: {
        totalUsers: userCount,
        totalProfiles: profileCount,
        totalJobs: jobCount,
        totalOffers: offerCount,
        totalJobReviews: jobReviewCount,
        totalFirmReviews: firmReviewCount,
      },
      marketplace: {
        jobsWithOffers: totalJobsWithOffers,
        jobsWithoutOffers: totalJobsWithoutOffers,
        jobsEligibleForOffers: totalJobsWithOffers + totalJobsWithoutOffers,
        averageOffersPerJob:
          totalJobsWithOffers > 0
            ? Math.round((offerCount / totalJobsWithOffers) * 10) / 10
            : 0,
        acceptedOffers: offersByStatus["accepted"] || 0,
        offerAcceptanceRate:
          offerCount > 0
            ? Math.round(((offersByStatus["accepted"] || 0) / offerCount) * 100)
            : 0,
        completedJobs: completedCount,
        cancelledJobs: cancelledCount,
        completionRate:
          jobCount > 0
            ? Math.round((completedCount / jobCount) * 100)
            : 0,
        activeJobs,
        pendingJobs,
        offersReceivedJobs: offersReceivedCount,
      },
      operations: {
        unverifiedProfiles: unverifiedProfileCount,
        openDisputes: openDisputeCount,
        totalDisputes: disputeCount,
        pendingCertificates: pendingSkillCount,
      },
      financial: {
        totalRevenue: Number(paymentAgg._sum?.amount ?? 0),
        totalCommission: Number(paymentAgg._sum?.commission ?? 0),
        totalPayments: Number(paymentAgg._count ?? 0),
        latestPayment: paymentAgg._max?.createdAt?.toISOString() ?? null,
        subscriptionRevenue: Number(subscriptionPaymentAgg._sum?.amount ?? 0),
        subscriptionCount: Number(subscriptionPaymentAgg._count ?? 0),
      },
      recentUsers,
      recentProfiles,
      recentJobs,
      recentDisputes,
      recentAuditLogs,
    } as any;
  } catch (error) {
    console.error("Command Center data fetch error:", error);
    return null;
  }
}

export default async function CommandCenterClient() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    redirect("/auth/giris");
  }

  const data = await fetchSummary();
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
        <p className="text-lg font-semibold text-[var(--admin-danger)]">Veri yüklenemedi</p>
        <p className="text-sm text-[var(--admin-text-secondary)] mt-1">
          Komuta merkezi verileri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </p>
      </div>
    );
  }

  return (
    <Stack size="lg">
      <SectionErrorBoundary section="Komuta Merkezi">
        <CommandHeader />
      </SectionErrorBoundary>

      <SectionErrorBoundary section="Dikkat Gerektirenler">
        <AttentionCenter data={data} />
      </SectionErrorBoundary>

      <SectionErrorBoundary section="Platform Durumu">
        <PlatformPulse data={data} />
      </SectionErrorBoundary>

      <SectionErrorBoundary section="Pazar Yeri Sağlığı">
        <MarketplaceHealth data={data} />
      </SectionErrorBoundary>

      <SectionErrorBoundary section="Operasyonlar">
        <OperationsCenter data={data} />
      </SectionErrorBoundary>

      <SectionErrorBoundary section="Finansal Görünüm">
        <FinancialOverview data={data} />
      </SectionErrorBoundary>

      <SectionErrorBoundary section="Son Aktiviteler">
        <RecentActivity data={data} />
      </SectionErrorBoundary>

      <SectionErrorBoundary section="Operasyonel Kısayollar">
        <QuickActions data={data} />
      </SectionErrorBoundary>
    </Stack>
  );
}
