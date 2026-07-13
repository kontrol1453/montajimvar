"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface OfferRow {
  id: number;
  jobTitle: string;
  jobId: number;
  amount: number;
  status: string;
  duration: string | null;
  createdAt: Date | string;
}

interface UserOffersProps {
  userId: number;
  data?: {
    id: number;
    amount: number;
    status: string;
    duration: string | null;
    createdAt: Date | string;
    job: { id: number; title: string; status: string };
  }[];
}

const columns: TableColumn<OfferRow>[] = [
  {
    header: "İş",
    accessor: (r) => (
      <Link href={`/admin/isler/${r.jobId}`} className="font-medium text-[var(--admin-primary)] hover:underline">
        {r.jobTitle}
      </Link>
    ),
  },
  {
    header: "Tutar",
    accessor: (r) => <span className="font-mono text-sm">{r.amount.toLocaleString("tr-TR")} TL</span>,
  },
  {
    header: "Süre",
    hidden: "md",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-secondary)]">{r.duration || "—"}</span>,
  },
  {
    header: "Durum",
    accessor: (r) => {
      const v = r.status === "accepted" ? "success" : r.status === "rejected" ? "danger" : r.status === "withdrawn" ? "neutral" : "warning";
      const l = r.status === "accepted" ? "Kabul" : r.status === "rejected" ? "Red" : r.status === "withdrawn" ? "Geri Çekildi" : "Bekliyor";
      return <EntityStatus variant={v} label={l} dot />;
    },
  },
  {
    header: "Tarih",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{formatDate(new Date(r.createdAt))}</span>,
  },
];

export default function UserOffers({ userId, data }: UserOffersProps) {
  if (!data) return null;

  const rows: OfferRow[] = data.map((o) => ({
    id: o.id,
    jobTitle: o.job.title,
    jobId: o.job.id,
    amount: o.amount,
    status: o.status,
    duration: o.duration,
    createdAt: o.createdAt,
  }));

  return (
    <div className="mt-4">
      <AdminTable<OfferRow>
        rows={rows}
        columns={columns}
        keyField={(r) => r.id}
        emptyState={
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--admin-text-muted)]">Henüz teklif kaydı bulunamadı.</p>
          </div>
        }
      />
    </div>
  );
}