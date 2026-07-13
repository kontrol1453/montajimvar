import { prisma } from "@/lib/prisma";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import PlanManager from "./PlanManager";

export default async function AdminSubscriptionPlansPage() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { profiles: true } },
    },
  });

  return (
    <PageContainer>
      <PageTitle className="mb-6">Abonelik Planları</PageTitle>
      <PlanManager plans={plans} />
    </PageContainer>
  );
}
