"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface ReviewRow {
  id: number;
  rating: number;
  comment: string | null;
  userName: string;
  userId: number;
  createdAt: Date | string;
}

interface CompanyReviewsProps {
  profileId: number;
  data?: {
    id: number; rating: number; comment: string | null;
    createdAt: string | Date;
    user: { id: number; name: string };
  }[];
}

const columns: TableColumn<ReviewRow>[] = [
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
    header: "Kullanıcı",
    accessor: (r) => (
      <Link href={`/admin/kullanicilar/${r.userId}`} className="text-[var(--admin-primary)] text-xs hover:underline">
        {r.userName}
      </Link>
    ),
  },
  {
    header: "Tarih",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{formatDate(new Date(r.createdAt))}</span>,
  },
];

export default function CompanyReviews({ profileId, data }: CompanyReviewsProps) {
  if (!data) return null;

  const rows: ReviewRow[] = data.map((r) => ({
    id: r.id, rating: r.rating, comment: r.comment,
    userName: r.user.name, userId: r.user.id, createdAt: r.createdAt,
  }));

  return (
    <div className="mt-4">
      <AdminTable<ReviewRow>
        rows={rows}
        columns={columns}
        keyField={(r) => r.id}
        emptyState={<div className="py-8 text-center"><p className="text-sm text-[var(--admin-text-muted)]">Henüz yorum yok.</p></div>}
      />
    </div>
  );
}