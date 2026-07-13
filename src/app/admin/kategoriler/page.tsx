import { prisma } from "@/lib/prisma";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import CategoryManager from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { profiles: true } },
    },
  });

  return (
    <PageContainer>
      <PageTitle className="mb-6">Kategoriler</PageTitle>
      <CategoryManager categories={categories} />
    </PageContainer>
  );
}
