import { prisma } from "@/lib/prisma";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import CrmDashboard from "./CrmDashboard";

export const dynamic = "force-dynamic";

async function getCrmData() {
  const [totalJobs, pendingJobs, totalOffers, acceptedOffers, completedJobs, users, recentJobs] =
    await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: "pending" } }),
      prisma.offer.count(),
      prisma.offer.count({ where: { status: "accepted" } }),
      prisma.job.count({ where: { status: "completed" } }),
      prisma.user.count(),
      prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          customer: { select: { name: true, email: true, phone: true } },
          categories: { include: { category: { select: { name: true } } } },
          _count: { select: { offers: true } },
        },
      }),
    ]);

  return {
    totalJobs,
    pendingJobs,
    totalOffers,
    acceptedOffers,
    completedJobs,
    conversionRate: totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0,
    users,
    recentJobs,
  };
}

export default async function CrmPage() {
  const data = await getCrmData();
  return (
    <PageContainer>
      <PageTitle className="mb-6">CRM Paneli</PageTitle>
      <CrmDashboard data={data as any} />
    </PageContainer>
  );
}
