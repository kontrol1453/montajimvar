import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/ui/Typography";
import CompanyProfileSection from "./CompanyProfileSection";
import CompanyJobsSection from "./CompanyJobsSection";
import CompanyReviewsSection from "./CompanyReviewsSection";
import CompanyActivitySection from "./CompanyActivitySection";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const profileId = Number(id);
  if (isNaN(profileId)) notFound();

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      category: true,
      categories: { include: { category: true } },
      _count: { select: { reviews: true, favorites: true, images: true } },
    },
  });
  if (!profile) notFound();

  return (
    <PageContainer size="full">
      <div className="flex flex-col gap-6">
        <CompanyProfileSection profile={profile} />
        <CompanyJobsSection profileId={profileId} />
        <CompanyReviewsSection profileId={profileId} />
        <CompanyActivitySection profileId={profileId} />
      </div>
    </PageContainer>
  );
}
