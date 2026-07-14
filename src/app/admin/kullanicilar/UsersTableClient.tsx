"use client";

import { useRouter } from "next/navigation";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import { Trash2, Shield } from "lucide-react";

interface UsersTableClientProps {
  rows: {
    id: number;
    name: string;
    email: string;
    roles: string[];
    city: string | null;
    emailVerified: boolean;
    premiumUntil: Date | null;
    createdAt: Date;
  }[];
  columns: TableColumn<any>[];
}

export default function UsersTableClient({ rows, columns }: UsersTableClientProps) {
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