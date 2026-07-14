"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import Badge from "@/components/ui/Badge";

interface Dispute {
  id: number;
  job: { id: number; title: string };
  openedBy: { id: number; name: string };
  reason: string;
  resolution: string | null;
  status: string;
  payment: { amount: number; status: string } | null;
  createdAt: string;
  resolvedAt: string | null;
}

const RESOLUTIONS = [
  { value: "refund_customer", label: "Müşteriye İade" },
  { value: "release_artisan", label: "Ustaya Ödeme" },
  { value: "split_50", label: "%50-%50 Bölüşüm" },
];

const RESOLUTION_LABEL = Object.fromEntries(RESOLUTIONS.map((r) => [r.value, r.label]));

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/disputes")
      .then((r) => r.json())
      .then(setDisputes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function resolve(id: number, resolution: string) {
    const res = await fetch(`/api/admin/disputes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution }),
    });
    if (res.ok) {
      setDisputes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "resolved", resolution, resolvedAt: new Date().toISOString() } : d))
      );
    }
  }

  const columns: TableColumn<Dispute>[] = [
    {
      header: "İş",
      accessor: (r) => <span className="font-medium text-sm">{r.job.title}</span>,
    },
    {
      header: "Açan",
      hidden: "sm",
      accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{r.openedBy.name}</span>,
    },
    {
      header: "Sebep",
      accessor: (r) => (
        <Link href={`/admin/anlasmazliklar/${r.id}`} className="text-[var(--admin-text-primary)] text-xs max-w-[200px] truncate block hover:text-[var(--admin-primary)] transition-colors">{r.reason}</Link>
      ),
    },
    {
      header: "Ödeme",
      hidden: "md",
      accessor: (r) => (
        <span className="text-[var(--admin-text-secondary)]">
          {r.payment ? `${r.payment.amount} TL` : "—"}
        </span>
      ),
    },
    {
      header: "Durum",
      accessor: (r) =>
        r.status === "open" ? (
          <Badge variant="warning">Açık</Badge>
        ) : (
          <Badge variant="success">Çözüldü</Badge>
        ),
    },
    {
      header: "Tarih",
      hidden: "lg",
      accessor: (r) => (
        <span className="text-[var(--admin-text-secondary)] text-xs">{formatDate(new Date(r.createdAt))}</span>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <PageTitle>Anlaşmazlıklar</PageTitle>
        <a
          href="/api/admin/export?type=disputes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium"
          aria-label="Anlaşmazlıkları CSV olarak dışa aktar"
        >
          ⬇ CSV Export
        </a>
      </div>

      <AdminTable<Dispute>
        rows={disputes}
        columns={columns}
        keyField={(r) => r.id}
        onRowClick={(r) => window.location.href = `/admin/anlasmazliklar/${r.id}`}
        actions={(r) =>
          r.status === "open" ? (
            <select
              onChange={(e) => { if (e.target.value) resolve(r.id, e.target.value); }}
              defaultValue=""
              className="bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-md px-2 py-1 text-xs text-[var(--admin-text-primary)] focus:outline-none"
            >
              <option value="">Çözüm Seç</option>
              {RESOLUTIONS.map((res) => (
                <option key={res.value} value={res.value}>{res.label}</option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-[var(--admin-text-muted)]">
              {RESOLUTION_LABEL[r.resolution ?? ""] || r.resolution}
            </span>
          )
        }
      />
    </PageContainer>
  );
}
