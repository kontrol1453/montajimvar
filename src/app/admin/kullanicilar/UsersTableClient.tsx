"use client";

import { useRouter } from "next/navigation";
import AdminTable, { type TableColumn } from "@/components/admin/DataTable/AdminTable";
import UserActions from "./UserActions";

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

  return (
    <AdminTable
      rows={rows}
      columns={columns}
      keyField={(r) => r.id}
      onRowClick={(row) => router.push(`/admin/kullanicilar/${row.id}`)}
      actions={(r) => (
        <UserActions
          userId={r.id}
          userName={r.name}
          userRoles={r.roles}
          premiumUntil={r.premiumUntil?.toISOString() ?? null}
        />
      )}
    />
  );
}