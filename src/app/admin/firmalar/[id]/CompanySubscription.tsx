"use client";

import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface CompanySubscriptionProps {
  profileId: number;
  data?: {
    id: number;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string | null;
    description: string | null;
    createdAt: string | Date;
    plan: { name: string };
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  completed: "Tamamlandı",
  pending: "Bekliyor",
  failed: "Başarısız",
  refunded: "İade",
};
const STATUS_VARIANTS: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
  refunded: "danger",
};

const columns: TableColumn<CompanySubscriptionProps["data"] extends Array<infer T> ? T : any>[] = [
  {
    header: "Plan",
    accessor: (r) => <span className="font-medium text-sm">{r.plan.name}</span>,
  },
  {
    header: "Tutar",
    accessor: (r) => <span className="font-mono text-sm">{r.amount > 0 ? `${(r.amount / 100).toLocaleString("tr-TR")} TL` : "Ücretsiz"}</span>,
  },
  {
    header: "Durum",
    accessor: (r) => (
      <EntityStatus
        variant={STATUS_VARIANTS[r.status] || "neutral"}
        label={STATUS_LABELS[r.status] || r.status}
        dot
      />
    ),
  },
  {
    header: "Tarih",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{formatDate(new Date(r.createdAt))}</span>,
  },
];

export default function CompanySubscription({ profileId, data }: CompanySubscriptionProps) {
  if (!data) return null;

  return (
    <div className="mt-4">
      <AdminTable<any>
        rows={data}
        columns={columns}
        keyField={(r) => r.id}
        emptyState={<div className="py-8 text-center"><p className="text-sm text-[var(--admin-text-muted)]">Henüz ödeme kaydı yok.</p></div>}
      />
    </div>
  );
}