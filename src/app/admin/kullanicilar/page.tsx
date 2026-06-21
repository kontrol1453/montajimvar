import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import UserActions from "./UserActions";

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Müşteri",
  ASSEMBLER: "Montajcı",
  MANUFACTURER: "Üretici",
  ADMIN: "Admin",
};

const ROLE_COLORS: Record<string, "default" | "success"> = {
  CUSTOMER: "default",
  ASSEMBLER: "success",
  MANUFACTURER: "success",
  ADMIN: "default",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      city: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Kullanıcılar</h1>

      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border bg-dark-section">
                <th className="text-left p-4 text-sub-text font-medium">Ad</th>
                <th className="text-left p-4 text-sub-text font-medium hidden md:table-cell">E-posta</th>
                <th className="text-left p-4 text-sub-text font-medium">Rol</th>
                <th className="text-left p-4 text-sub-text font-medium hidden lg:table-cell">Şehir</th>
                <th className="text-left p-4 text-sub-text font-medium hidden lg:table-cell">Kayıt</th>
                <th className="text-right p-4 text-sub-text font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-dark-section transition">
                  <td className="p-4">
                    <span className="font-medium text-white">{user.name}</span>
                  </td>
                  <td className="p-4 text-sub-text hidden md:table-cell">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <Badge variant={ROLE_COLORS[user.role] || "default"}>
                      {ROLE_LABELS[user.role] || user.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-sub-text hidden lg:table-cell">
                    {user.city || "-"}
                  </td>
                  <td className="p-4 text-sub-text hidden lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 text-right">
                    <UserActions userId={user.id} userName={user.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
