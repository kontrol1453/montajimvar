import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageTitle, PageContainer } from "@/components/ui/Typography";
import { SearchInput } from "@/components/admin/DataTable/AdminToolbar";
import UserActions from "./UserActions";
import CreateUserForm from "./CreateUserForm";
import UsersTableClient from "./UsersTableClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
      city: true,
      emailVerified: true,
      premiumUntil: true,
      createdAt: true,
    },
  });

  const rows: UserRow[] = users.map((u) => ({
    ...u,
    roles: u.roles as string[],
    city: u.city,
  }));

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <PageTitle>Kullanıcılar</PageTitle>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export?type=users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-md hover:bg-[var(--admin-primary-strong)] transition text-sm font-medium"
            aria-label="Kullanıcıları CSV olarak dışa aktar"
          >
            ⬇ CSV Export
          </a>
          <CreateUserForm />
        </div>
      </div>

      <UsersTableClient rows={rows} />
    </PageContainer>
  );
}