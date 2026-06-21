import { prisma } from "@/lib/prisma";
import CategoryManager from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { profiles: true } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Kategoriler</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
