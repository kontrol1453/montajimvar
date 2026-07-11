import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
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
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) redirect("/");

  const data = await getCrmData();

  return <CrmDashboard data={data as any} />;
}
