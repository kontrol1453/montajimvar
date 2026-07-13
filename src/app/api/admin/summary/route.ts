import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  try {
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
    const totalJobsEligible = totalJobsWithOffers + totalJobsWithoutOffers;

    const completedCount = jobsByStatus["completed"] || 0;
    const cancelledCount = jobsByStatus["cancelled"] || 0;
    const pendingJobs = jobsByStatus["pending"] || 0;
    const offersReceivedCount = jobsByStatus["offers_received"] || 0;

    return NextResponse.json({
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
        jobsEligibleForOffers: totalJobsEligible,
        averageOffersPerJob: totalJobsWithOffers > 0
          ? Math.round((offerCount / totalJobsWithOffers) * 10) / 10
          : 0,
        acceptedOffers: offersByStatus["accepted"] || 0,
        offerAcceptanceRate: offerCount > 0
          ? Math.round(((offersByStatus["accepted"] || 0) / offerCount) * 100)
          : 0,
        completedJobs: completedCount,
        cancelledJobs: cancelledCount,
        completionRate: jobCount > 0
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
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json(
      { error: "Özet yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
