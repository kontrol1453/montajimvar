import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/ui/Typography";
import { SectionErrorBoundary } from "@/components/admin/SectionContainer";
import CompanyWorkspace from "./CompanyWorkspace";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function CompanyDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) redirect("/auth/giris");

  const { id } = await params;
  const profileId = Number(id);
  if (isNaN(profileId)) redirect("/admin/firmalar");

  const { tab } = await searchParams;

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      category: true,
      user: {
        select: { id: true, name: true, email: true, phone: true, avatar: true, city: true, createdAt: true, premiumUntil: true, roles: true },
      },
      subscription: true,
      _count: { select: { reviews: true } },
      categories: { include: { category: { select: { name: true } } } },
    },
  });

  if (!profile) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
          <p className="text-lg font-semibold text-[var(--admin-danger)]">Firma bulunamadı</p>
          <p className="text-sm text-[var(--admin-text-secondary)] mt-1">Bu firma silinmiş veya ID geçersiz.</p>
        </div>
      </PageContainer>
    );
  }

  const [jobCounts, totalJobs] = await Promise.all([
    prisma.job.groupBy({ by: ["status"], where: { customerId: profile.userId }, _count: true }),
    prisma.job.count({ where: { customerId: profile.userId } }),
  ]);
  const statusMap = Object.fromEntries(jobCounts.map((s) => [s.status, s._count]));

  const summary = {
    totalJobs,
    completedJobs: statusMap["completed"] || 0,
    activeJobs: (statusMap["assigned"] || 0) + (statusMap["en_route"] || 0) + (statusMap["in_progress"] || 0),
    pendingJobs: statusMap["pending"] || 0,
    cancelledJobs: statusMap["cancelled"] || 0,
  };

  const enrichedProfile = {
    ...profile,
    categoryNames: profile.categories.map((pc) => pc.category.name),
    extraCount: Math.max(0, profile.categories.length - 1),
  };

  return (
    <PageContainer size="full">
      <SectionErrorBoundary section="Firma 360">
        <CompanyWorkspace profile={enrichedProfile as any} summary={summary} activeTab={tab} />
      </SectionErrorBoundary>
    </PageContainer>
  );
}