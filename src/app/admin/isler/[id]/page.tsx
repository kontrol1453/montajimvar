import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/ui/Typography";
import { SectionErrorBoundary } from "@/components/admin/SectionContainer";
import JobWorkspace from "./JobWorkspace";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function JobDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) redirect("/auth/giris");

  const { id } = await params;
  const jobId = Number(id);
  if (isNaN(jobId)) redirect("/admin/isler");

  const { tab } = await searchParams;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      customer: { select: { id: true, name: true, email: true, profile: { select: { id: true, companyName: true } } } },
      categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
      _count: { select: { offers: true, messages: true } },
    },
  });

  if (!job) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
          <p className="text-lg font-semibold text-[var(--admin-danger)]">İş bulunamadı</p>
          <p className="text-sm text-[var(--admin-text-secondary)] mt-1">Bu iş silinmiş veya ID geçersiz.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="full">
      <SectionErrorBoundary section="İş 360">
        <JobWorkspace job={job as any} activeTab={tab} />
      </SectionErrorBoundary>
    </PageContainer>
  );
}