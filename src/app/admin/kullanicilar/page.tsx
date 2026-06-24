import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import UserActions from "./UserActions";
import CreateUserForm from "./CreateUserForm";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Müşteri",
  ASSEMBLER: "Montajcı",
  MANUFACTURER: "Üretici",
  ADMIN: "Admin",
};

const ROLE_COLORS: Record<string, "default" | "success" | "warning"> = {
  CUSTOMER: "default",
  ASSEMBLER: "success",
  MANUFACTURER: "success",
  ADMIN: "warning",
};

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">SİSTEM TESTİ - GÜNCEL VERSİYON</h1>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export?type=users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-montaj text-white rounded-lg hover:bg-montaj-dark transition text-sm font-medium"
          >
            ⬇ CSV Export
          </a>
          <CreateUserForm />
        </div>
      </div>

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
                <th className="text-left p-4 text-sub-text font-medium hidden lg:table-cell">Onay</th>
                <th className="text-left p-4 text-sub-text font-medium">Premium</th>
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
                    <div className="flex flex-wrap gap-1">
                      {(user.roles as string[]).map((r) => (
                        <Badge key={r} variant={ROLE_COLORS[r] || "default"}>
                          {ROLE_LABELS[r] || r}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sub-text hidden lg:table-cell">
                    {user.city || "-"}
                  </td>
                  <td className="p-4 text-sub-text hidden lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 text-center hidden lg:table-cell">
                    {user.emailVerified ? (
                      <span className="text-green-500 font-medium" title="E-posta doğrulanmış">✓</span>
                    ) : (
                      <span className="text-red-500 font-medium" title="E-posta doğrulanmamış">✗</span>
                    )}
                  </td>
                  <td className="p-4">
                    {user.premiumUntil && new Date(user.premiumUntil) > new Date() ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Premium
                      </span>
                    ) : (
                      <span className="text-xs text-sub-text">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <UserActions
                      userId={user.id}
                      userName={user.name}
                      userRoles={user.roles as string[]}
                      premiumUntil={user.premiumUntil?.toISOString() ?? null}
                    />
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
