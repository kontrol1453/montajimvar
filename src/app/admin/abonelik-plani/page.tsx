import { prisma } from "@/lib/prisma";
import PlanManager from "./PlanManager";

export default async function AdminSubscriptionPlansPage() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { profiles: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Abonelik Planları</h1>
      <PlanManager plans={plans} />
    </div>
  );
}
