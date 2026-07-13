import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/ui/Typography";
import { SectionErrorBoundary } from "@/components/admin/SectionContainer";
import UserWorkspace from "./UserWorkspace";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

async function fetchUserData(userId: number) {
  const [user, counts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            category: true,
            subscription: true,
          },
        },
      },
    }),
    Promise.all([
      prisma.job.count({ where: { customerId: userId } }),
      prisma.offer.count({ where: { artisanId: userId } }),
      prisma.job.count({
        where: {
          offers: { some: { artisanId: userId, status: "accepted" } },
          status: "completed",
        },
      }),
      prisma.review.count({ where: { userId } }),
      prisma.dispute.count({ where: { openedById: userId } }),
      prisma.artisanSkill.count({ where: { userId } }),
      prisma.payment.count({ where: { customerId: userId } }),
      prisma.payment.count({ where: { artisanId: userId } }),
    ]),
  ]);

  if (!user) return null;

  const [totalJobs, totalOffers, completedJobs, totalReviews, totalDisputes, totalCertificates, paymentsMade, paymentsReceived] = counts;

  return {
    user,
    summary: {
      totalJobs,
      totalOffers,
      completedJobs,
      totalReviews,
      totalDisputes,
      totalCertificates,
      paymentsMade,
      paymentsReceived,
    },
  };
}

export default async function UserDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    redirect("/auth/giris");
  }

  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) redirect("/admin/kullanicilar");

  const { tab } = await searchParams;
  const data = await fetchUserData(userId);

  if (!data) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
          <p className="text-lg font-semibold text-[var(--admin-danger)]">Kullanıcı bulunamadı</p>
          <p className="text-sm text-[var(--admin-text-secondary)] mt-1">
            Bu kullanıcı silinmiş veya ID geçersiz olabilir.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="full">
      <SectionErrorBoundary section="Kullanıcı 360">
        <UserWorkspace data={data as any} userId={userId} activeTab={tab} />
      </SectionErrorBoundary>
    </PageContainer>
  );
}