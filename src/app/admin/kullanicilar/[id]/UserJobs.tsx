"use client";

import Link from "next/link";
"use client";

import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface JobRow {
  id: number;
  title: string;
  status: string;
  city: string;
  createdAt: Date | string;
  role: string;
  customerName?: string;
  offerCount?: number;
}

interface UserJobsProps {
  userId: number;
  data?: {
    created: { id: number; title: string; status: string; city: string; createdAt: Date | string; _count: { offers: number } }[];
    assigned: { id: number; title: string; status: string; city: string; createdAt: Date | string; customer: { id: number; name: string } }[];
  };
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
    header: "Rol",
    hidden: "md",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-secondary)]">{r.role}</span>,
  },
  {
    header: "Durum",
    accessor: (r) => (
      <EntityStatus
        variant={getStatusVariant(r.status)}
        label={getStatusLabel(r.status)}
        dot
      />
    ),
  },
  {
    header: "Şehir",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{r.city || "—"}</span>,
  },
  {
    header: "Tarih",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{formatDate(new Date(r.createdAt))}</span>,
  },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Bekliyor", offers_received: "Teklif Alındı", assigned: "Atandı",
  en_route: "Yolda", in_progress: "Devam Ediyor", completed: "Tamamlandı",
  review_pending: "Yorum Bekliyor", cancelled: "İptal",
};

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

function getStatusVariant(status: string): "warning" | "info" | "success" | "neutral" | "danger" {
  const m: Record<string, "warning" | "info" | "success" | "neutral" | "danger"> = {
    pending: "warning", offers_received: "info", assigned: "success",
    en_route: "neutral", in_progress: "info", completed: "success",
    review_pending: "warning", cancelled: "danger",
  };
  return m[status] || "neutral";
}

export default function UserJobs({ userId, data: rawData }: UserJobsProps) {
  if (!rawData) return null;

  const rows: JobRow[] = [
    ...rawData.created.map((j) => ({
      id: j.id, title: j.title, status: j.status, city: j.city, createdAt: j.createdAt,
      role: "İş Sahibi", offerCount: j._count.offers,
    })),
    ...rawData.assigned.map((j) => ({
      id: j.id, title: j.title, status: j.status, city: j.city, createdAt: j.createdAt,
      role: "Atanan Usta", customerName: j.customer.name,
    })),
  ];

  return (
    <div className="mt-4">
      <AdminTable<JobRow>
        rows={rows}
        columns={columns}
        keyField={(r) => `${r.role}-${r.id}`}
        emptyState={
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--admin-text-muted)]">Henüz iş kaydı bulunamadı.</p>
          </div>
        }
      />
    </div>
  );
}