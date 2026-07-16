import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/ui/Typography";
import UserProfileSection from "./UserProfileSection";
import UserJobsSection from "./UserJobsSection";
import UserActivitySection from "./UserActivitySection";
import UserRelationsSection from "./UserRelationsSection";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) notFound();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      roles: true,
      emailVerified: true,
      premiumUntil: true,
      createdAt: true,
    },
  });
  if (!user) notFound();

  const [jobCount, profileCount, offerCount, reviewCount, totalSpent] = await Promise.all([
    prisma.job.count({ where: { customerId: userId } }),
    prisma.profile.count({ where: { userId } }),
    prisma.offer.count({ where: { artisanId: userId } }),
    prisma.review.count({ where: { userId } }),
    prisma.payment.aggregate({
      where: { job: { customerId: userId }, status: "completed" },
      _sum: { amount: true },
    }),
  ]);

  const stats = {
    jobCount,
    profileCount,
    offerCount,
    reviewCount,
    totalSpent: Number(totalSpent._sum.amount ?? 0),
  };

  return (
    <PageContainer size="full">
      <div className="flex flex-col gap-6">
        <UserProfileSection user={user} stats={stats} />
        <UserRelationsSection userId={userId} />
        <UserJobsSection userId={userId} />
        <UserActivitySection userId={userId} />
      </div>
    </PageContainer>
  );
}
