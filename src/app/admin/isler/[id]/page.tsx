import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/ui/Typography";
import JobDetailHeader from "./JobDetailHeader";
import JobOffersSection from "./JobOffersSection";
import JobTimelineSection from "./JobTimelineSection";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const jobId = Number(id);
  if (isNaN(jobId)) notFound();

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      categories: { include: { category: true } },
      offers: {
        include: {
          artisan: { select: { id: true, name: true, email: true } },
        },
        orderBy: { amount: "asc" },
      },
      payment: { select: { id: true, amount: true, commission: true, status: true, createdAt: true } },
      _count: { select: { messages: true, offers: true } },
    },
  });
  if (!job) notFound();

  return (
    <PageContainer size="full">
      <div className="flex flex-col gap-6">
        <JobDetailHeader job={job} />
        <JobOffersSection offers={job.offers} />
        <JobTimelineSection jobId={jobId} />
      </div>
    </PageContainer>
  );
}
