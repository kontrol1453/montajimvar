import { prisma } from "@/lib/prisma";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import FirmsTableClient from "./FirmsTableClient";

interface ProfileRow {
  id: number;
  companyName: string;
  ownerName: string;
  categoryName: string;
  extraCategories: string[];
  extraCount: number;
  city: string;
  isVerified: boolean;
  isFeatured: boolean;
  categoryIds: number[];
  createdAt: Date;
}

export default async function AdminFirmsPage() {
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const rows: ProfileRow[] = profiles.map((p) => {
    const allCatNames = p.categories.map((pc) => pc.category.name);
    const mainName = p.category?.name ?? (allCatNames[0] ?? "—");
    const extras = allCatNames.filter((n) => n !== mainName);
    return {
      id: p.id,
      companyName: p.companyName,
      ownerName: p.user.name,
      categoryName: mainName,
      extraCategories: extras,
      extraCount: extras.length > 3 ? extras.length - 2 : extras.length,
      city: p.city,
      isVerified: p.isVerified,
      isFeatured: p.isFeatured,
      categoryIds: p.categories.map((pc) => pc.categoryId),
      createdAt: p.createdAt,
    };
  });

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <PageTitle>Firmalar</PageTitle>
        <a
          href="/api/admin/export?type=profiles"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium"
          aria-label="Firmaları CSV olarak dışa aktar"
        >
          ⬇ CSV Export
        </a>
      </div>

      <FirmsTableClient rows={rows} />
    </PageContainer>
  );
}