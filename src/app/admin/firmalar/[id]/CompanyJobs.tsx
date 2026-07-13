"use client";

import Link from "next/link";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface JobRow {
  id: number;
  title: string;
  status: string;
  city: string;
  offerCount: number;
  createdAt: Date | string;
}

interface CompanyJobsProps {
  profileId: number;
  data?: {
    id: number; title: string; status: string; city: string;
    createdAt: string | Date; _count: { offers: number };
  }[];
}

function statusLabel(s: string) {
  const m: Record<string, string> = {
    pending: "Bekliyor", offers_received: "Teklif Aldı", assigned: "Atandı",
    en_route: "Yolda", in_progress: "Devam Ediyor", completed: "Tamamlandı",
    review_pending: "Yorum Bekliyor", cancelled: "İptal",
  };
  return m[s] || s;
}

function statusVariant(s: string): "warning" | "info" | "success" | "neutral" | "danger" {
  const m: Record<string, "warning" | "info" | "success" | "neutral" | "danger"> = {
    pending: "warning", offers_received: "info", assigned: "success",
    en_route: "neutral", in_progress: "info", completed: "success",
    review_pending: "warning", cancelled: "danger",
  };
  return m[s] || "neutral";
}

const columns: TableColumn<JobRow>[] = [
  {
    header: "İş",
    accessor: (r) => (
      <Link href={`/admin/isler/${r.id}`} className="font-medium text-[var(--admin-primary)] hover:underline">
        {r.title}
      </Link>
    ),
  },
  {
    header: "Durum",
    accessor: (r) => <EntityStatus variant={statusVariant(r.status)} label={statusLabel(r.status)} dot />,
  },
  {
    header: "Teklif",
    hidden: "md",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-secondary)]">{r.offerCount}</span>,
    align: "center",
  },
  {
    header: "Şehir",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{r.city || "—"}</span>,
  },
];

export default function CompanyJobs({ profileId, data }: CompanyJobsProps) {
  if (!data) return null;

  const rows: JobRow[] = data.map((j) => ({
    id: j.id, title: j.title, status: j.status, city: j.city,
    offerCount: j._count.offers, createdAt: j.createdAt,
  }));

  return (
    <div className="mt-4">
      <AdminTable<JobRow>
        rows={rows}
        columns={columns}
        keyField={(r) => r.id}
        emptyState={<div className="py-8 text-center"><p className="text-sm text-[var(--admin-text-muted)]">Henüz iş kaydı yok.</p></div>}
      />
    </div>
  );
}