import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import VerifyButton from "./VerifyButton";
import FeaturedButton from "./FeaturedButton";
import CategoryEditor from "./CategoryEditor";
import DeleteProfileButton from "./DeleteProfileButton";
import { Trash2, Shield } from "lucide-react";

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

const columns: TableColumn<ProfileRow>[] = [
  {
    header: "Firma",
    accessor: (r) => <span className="font-medium">{r.companyName}</span>,
  },
  {
    header: "Sahip",
    hidden: "md",
    accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{r.ownerName}</span>,
    className: "text-[var(--admin-text-secondary)]",
  },
  {
    header: "Kategori",
    accessor: (r) => (
      <div className="flex flex-wrap gap-1">
        <Badge variant="neutral">{r.categoryName}</Badge>
        {r.extraCategories.map((name, i) => (
          i < 2 ? <Badge key={name} variant="neutral">{name}</Badge> : null
        ))}
        {r.extraCount > 0 && (
          <span className="text-xs text-[var(--admin-text-muted)] self-center">+{r.extraCount}</span>
        )}
      </div>
    ),
  },
  {
    header: "Şehir",
    hidden: "lg",
    accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{r.city}</span>,
    className: "text-[var(--admin-text-secondary)]",
  },
  {
    header: "Durum",
    accessor: (r) =>
      r.isVerified ? (
        <Badge variant="success">Onaylı</Badge>
      ) : (
        <Badge variant="neutral">Bekliyor</Badge>
      ),
  },
  {
    header: "Vitrin",
    hidden: "xl",
    accessor: (r) =>
      r.isFeatured ? (
        <Badge variant="warning">Vitrin</Badge>
      ) : (
        <span className="text-xs text-[var(--admin-text-muted)]">—</span>
      ),
  },
  {
    header: "Kayıt",
    hidden: "lg",
    accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{formatDate(r.createdAt)}</span>,
    className: "text-[var(--admin-text-secondary)]",
  },
];

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

      <AdminTable<ProfileRow>
        rows={rows}
        columns={columns}
        keyField={(r) => r.id}
        onRowClick={(r) => window.location.href = `/admin/firmalar/${r.id}`}
        selectable={true}
        bulkActions={[
          { label: "Sil", onClick: (selected: any[]) => alert(`${selected.length} firma silinecek`), variant: "danger" as const, icon: <Trash2 size={14} /> },
          { label: "Onay Ver", onClick: (selected: any[]) => alert(`${selected.length} firma onaylanacak`), variant: "primary" as const, icon: <Shield size={14} /> },
        ]}
        actions={(r) => (
          <div className="flex items-center justify-end gap-2">
            <CategoryEditor profileId={r.id} selectedCategoryIds={r.categoryIds} />
            <FeaturedButton profileId={r.id} isFeatured={r.isFeatured} />
            <VerifyButton profileId={r.id} isVerified={r.isVerified} />
            <DeleteProfileButton profileId={r.id} companyName={r.companyName} />
          </div>
        )}
      />
    </PageContainer>
  );
}