"use client";

import { formatDate } from "@/lib/utils";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";

interface CertRow {
  id: number;
  categoryName: string;
  title: string | null;
  certificate: string | null;
  verified: boolean;
  createdAt: Date | string;
}

interface UserCertificatesProps {
  userId: number;
  data?: {
    id: number;
    title: string | null;
    certificate: string | null;
    verified: boolean;
    createdAt: Date | string;
    category: { name: string };
  }[];
}

const columns: TableColumn<CertRow>[] = [
  {
    header: "Uzmanlık",
    accessor: (r) => <span className="font-medium text-sm">{r.categoryName}{r.title ? ` - ${r.title}` : ""}</span>,
  },
  {
    header: "Sertifika",
    hidden: "md",
    accessor: (r) =>
      r.certificate ? (
        <a href={r.certificate} target="_blank" rel="noopener noreferrer" className="text-[var(--admin-primary)] text-xs hover:underline">
          Belge ↗
        </a>
      ) : (
        <span className="text-xs text-[var(--admin-text-muted)]">—</span>
      ),
  },
  {
    header: "Durum",
    accessor: (r) =>
      r.verified ? (
        <EntityStatus variant="success" label="Onaylı" dot />
      ) : (
        <EntityStatus variant="warning" label="Beklemede" dot />
      ),
  },
  {
    header: "Tarih",
    hidden: "lg",
    accessor: (r) => <span className="text-xs text-[var(--admin-text-muted)]">{formatDate(new Date(r.createdAt))}</span>,
  },
];

export default function UserCertificates({ userId, data }: UserCertificatesProps) {
  if (!data) return null;

  const rows: CertRow[] = data.map((s) => ({
    id: s.id, categoryName: s.category.name, title: s.title,
    certificate: s.certificate, verified: s.verified, createdAt: s.createdAt,
  }));

  return (
    <div className="mt-4">
      <AdminTable<CertRow>
        rows={rows}
        columns={columns}
        keyField={(r) => r.id}
        emptyState={
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--admin-text-muted)]">Henüz sertifika kaydı bulunamadı.</p>
          </div>
        }
      />
    </div>
  );
}