"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import { Trash2, Shield } from "lucide-react";

interface UserRow {
  id: number;
  name: string;
  email: string;
  roles: string[];
  city: string | null;
  emailVerified: boolean;
  premiumUntil: Date | null;
  createdAt: Date;
}

interface UsersTableClientProps {
  rows: UserRow[];
}

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Müşteri",
  ASSEMBLER: "Montajcı",
  MANUFACTURER: "Üretici",
  ADMIN: "Admin",
};

const ROLE_COLORS: Record<string, "neutral" | "success" | "warning"> = {
  CUSTOMER: "neutral",
  ASSEMBLER: "success",
  MANUFACTURER: "success",
  ADMIN: "warning",
};

const columns: TableColumn<UserRow>[] = [
  {
    header: "Ad",
    align: "left",
    accessor: (r) => <span className="font-medium">{r.name}</span>,
  },
  {
    header: "E-posta",
    hidden: "md",
    accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{r.email}</span>,
    className: "text-[var(--admin-text-secondary)]",
  },
  {
    header: "Rol",
    accessor: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.roles.map((role) => (
          <Badge key={role} variant={ROLE_COLORS[role] || "neutral"}>
            {ROLE_LABELS[role] || role}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: "Şehir",
    hidden: "lg",
    accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{r.city || "—"}</span>,
    className: "text-[var(--admin-text-secondary)]",
  },
  {
    header: "Kayıt",
    hidden: "lg",
    accessor: (r) => <span className="text-[var(--admin-text-secondary)]">{formatDate(r.createdAt)}</span>,
    className: "text-[var(--admin-text-secondary)]",
  },
  {
    header: "Onay",
    hidden: "lg",
    align: "center",
    accessor: (r) =>
      r.emailVerified ? (
        <span className="text-[var(--admin-success)] font-medium" title="E-posta doğrulanmış">✓</span>
      ) : (
        <span className="text-[var(--admin-danger)] font-medium" title="E-posta doğrulanmamış">✗</span>
      ),
  },
  {
    header: "Premium",
    accessor: (r) =>
      r.premiumUntil && new Date(r.premiumUntil) > new Date() ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--admin-premium-soft)] text-[var(--admin-premium)] text-xs font-medium rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Premium
        </span>
      ) : (
        <span className="text-xs text-[var(--admin-text-muted)]">—</span>
      ),
  },
];

export default function UsersTableClient({ rows }: UsersTableClientProps) {
  const router = useRouter();

  const bulkActions = [
    { label: "Sil", onClick: (selected: any[]) => alert(`${selected.length} user will be deleted`), variant: "danger" as const, icon: <Trash2 size={14} /> },
    { label: "Premium Ver", onClick: (selected: any[]) => alert(`${selected.length} user will be granted premium`), variant: "primary" as const, icon: <Shield size={14} /> },
  ];

  return (
    <AdminTable
      rows={rows}
      columns={columns}
      keyField={(r) => r.id}
      onRowClick={(row) => router.push(`/admin/kullanicilar/${row.id}`)}
      actions={(r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/kullanicilar/${r.id}?edit=true`); }}
            className="text-xs text-[var(--admin-primary)] hover:underline"
          >
            Düzenle
          </button>
          <button className="text-xs text-[var(--admin-danger)] hover:underline">Sil</button>
        </div>
      )}
      selectable={true}
      bulkActions={bulkActions}
    />
  );
}
