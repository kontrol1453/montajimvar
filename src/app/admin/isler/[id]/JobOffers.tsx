"use client";

import Link from "next/link";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface OfferRow {
  id: number;
  artisanName: string;
  artisanId: number;
  amount: number;
  status: string;
  duration: string | null;
  companyName: string | null;
}

interface JobOffersProps {
  jobId: number;
  data?: { id: number; amount: number; status: string; duration: string | null; artisan: { id: number; name: string; email: string; profile?: { id: number; companyName: string } } }[];
}

const columns: TableColumn<OfferRow>[] = [
  {
    header: "Usta",
    accessor: (r) => (
      <div>
        <Link href={`/admin/kullanicilar/${r.artisanId}`} className="text-sm font-medium text-[var(--admin-primary)] hover:underline">
          {r.artisanName}
        </Link>
        {r.companyName && <p className="text-[10px] text-[var(--admin-text-muted)]">{r.companyName}</p>}
      </div>
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
];

export default function JobOffers({ jobId, data }: JobOffersProps) {
  if (!data) return null;

  const rows: OfferRow[] = data.map((o) => ({
    id: o.id, artisanName: o.artisan.name, artisanId: o.artisan.id,
    amount: o.amount, status: o.status, duration: o.duration,
    companyName: o.artisan.profile?.companyName ?? null,
  }));

  return (
    <div className="mt-4">
      <AdminTable<OfferRow>
        rows={rows}
        columns={columns}
        keyField={(r) => r.id}
        emptyState={<div className="py-8 text-center"><p className="text-sm text-[var(--admin-text-muted)]">Henüz teklif yok.</p></div>}
      />
    </div>
  );
}