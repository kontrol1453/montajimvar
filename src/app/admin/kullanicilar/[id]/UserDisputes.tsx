"use client";

import Link from "next/link";
"use client";

import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface DisputeRow {
  id: number;
  jobTitle: string;
  jobId: number;
  reason: string;
  status: string;
  resolution: string | null;
  createdAt: Date | string;
  resolvedAt: Date | string | null;
}

interface UserDisputesProps {
  userId: number;
  data?: {
    id: number;
    reason: string;
    status: string;
    resolution: string | null;
    createdAt: Date | string;
    resolvedAt: Date | string | null;
    job: { id: number; title: string };
  }[];
}

const RES_LABELS: Record<string, string> = {
  refund_customer: "Müşteriye İade",
  release_artisan: "Ustaya Ödeme",
  split_50: "%50-%50",
};

const columns: TableColumn<DisputeRow>[] = [
  {
    header: "İş",
    accessor: (r) => (
      <Link href={`/admin/isler/${r.jobId}`} className="font-medium text-sm text-[var(--admin-primary)] hover:underline">
        {r.jobTitle}
      </Link>
    ),
  },
  {
    header: "Sebep",
    hidden: "md",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-secondary)] line-clamp-1 max-w-[180px]">{r.reason}</span>,
  },
  {
    header: "Durum",
    accessor: (r) =>
      r.status === "open" ? (
        <EntityStatus variant="danger" label="Açık" dot />
      ) : (
        <EntityStatus variant="success" label="Çözüldü" dot />
      ),
  },
  {
    header: "Çözüm",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{r.resolution ? RES_LABELS[r.resolution] || r.resolution : "—"}</span>,
  },
  {
    header: "Tarih",
    hidden: "lg",
    accessor: (r) => (
      <div className="text-xs text-[var(--admin-text-muted)]">
        <div>Açıldı: {formatDate(new Date(r.createdAt))}</div>
        {r.resolvedAt && <div>Çözüldü: {formatDate(new Date(r.resolvedAt))}</div>}
      </div>
    ),
  },
];

export default function UserDisputes({ userId, data }: UserDisputesProps) {
  if (!data) return null;

  const rows: DisputeRow[] = data.map((d) => ({
    id: d.id, jobTitle: d.job.title, jobId: d.job.id, reason: d.reason,
    status: d.status, resolution: d.resolution, createdAt: d.createdAt, resolvedAt: d.resolvedAt,
  }));

  return (
    <div className="mt-4">
      <AdminTable<DisputeRow>
        rows={rows}
        columns={columns}
        keyField={(r) => r.id}
        emptyState={
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--admin-text-muted)]">Henüz anlaşmazlık kaydı bulunamadı.</p>
          </div>
        }
      />
    </div>
  );
}