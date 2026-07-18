"use client";

import Link from "next/link";
"use client";

import { formatDate } from "@/lib/utils";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface ReviewRow {
  id: number;
  type: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
  entityName: string;
  entityId: number;
  entityHref: string;
}

interface UserReviewsProps {
  userId: number;
  data?: {
    written: { id: number; rating: number; comment: string | null; createdAt: Date | string; profile: { id: number; companyName: string } }[];
    received: { id: number; rating: number; comment: string | null; createdAt: Date | string; user: { id: number; name: string } }[];
  };
}

const columns: TableColumn<ReviewRow>[] = [
  {
    header: "Tür",
    accessor: (r) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.type === "yazdı" ? "bg-[var(--admin-info-soft)] text-[var(--admin-info)]" : "bg-[var(--admin-success-soft)] text-[var(--admin-success)]"}`}>
        {r.type === "yazdı" ? "Yazdığı" : "Aldığı"}
      </span>
    ),
  },
  {
    header: "Puan",
    align: "center",
    accessor: (r) => <span className="text-amber-500 text-sm font-medium">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>,
  },
  {
    header: "Yorum",
    hidden: "md",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-secondary)] line-clamp-2">{r.comment || "—"}</span>,
  },
  {
    header: "Firma",
    accessor: (r) => (
      <Link href={r.entityHref} className="text-[var(--admin-primary)] text-xs hover:underline">
        {r.entityName}
      </Link>
    ),
  },
  {
    header: "Tarih",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{formatDate(new Date(r.createdAt))}</span>,
  },
];

export default function UserReviews({ userId, data }: UserReviewsProps) {
  if (!data) return null;

  const rows: ReviewRow[] = [
    ...data.written.map((r) => ({
      id: r.id, type: "yazdı" as const, rating: r.rating, comment: r.comment,
      createdAt: r.createdAt, entityName: r.profile.companyName, entityId: r.profile.id,
      entityHref: `/admin/firmalar/${r.profile.id}`,
    })),
    ...data.received.map((r) => ({
      id: r.id, type: "aldı" as const, rating: r.rating, comment: r.comment,
      createdAt: r.createdAt, entityName: r.user.name, entityId: r.user.id,
      entityHref: `/admin/kullanicilar/${r.user.id}`,
    })),
  ];

  return (
    <div className="mt-4">
      <AdminTable<ReviewRow>
        rows={rows}
        columns={columns}
        keyField={(r) => `${r.type}-${r.id}`}
        emptyState={
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--admin-text-muted)]">Henüz yorum kaydı bulunamadı.</p>
          </div>
        }
      />
    </div>
  );
}