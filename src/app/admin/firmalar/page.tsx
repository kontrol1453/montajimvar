import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import VerifyButton from "./VerifyButton";

export default async function AdminFirmsPage() {
  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Firmalar</h1>

      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border bg-dark-section">
                <th className="text-left p-4 text-sub-text font-medium">Firma</th>
                <th className="text-left p-4 text-sub-text font-medium hidden md:table-cell">Sahip</th>
                <th className="text-left p-4 text-sub-text font-medium">Kategori</th>
                <th className="text-left p-4 text-sub-text font-medium hidden lg:table-cell">Şehir</th>
                <th className="text-left p-4 text-sub-text font-medium">Durum</th>
                <th className="text-left p-4 text-sub-text font-medium hidden lg:table-cell">Kayıt</th>
                <th className="text-right p-4 text-sub-text font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-dark-section transition">
                  <td className="p-4">
                    <span className="font-medium text-white">{profile.companyName}</span>
                  </td>
                  <td className="p-4 text-sub-text hidden md:table-cell">
                    {profile.user.name}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="default">{profile.category.name}</Badge>
                      {profile.categories
                        .filter((pc) => pc.category.name !== profile.category.name)
                        .slice(0, 2)
                        .map((pc) => (
                          <Badge key={pc.category.name} variant="default">{pc.category.name}</Badge>
                        ))}
                      {profile.categories.length > 3 && (
                        <span className="text-xs text-sub-text self-center">
                          +{profile.categories.length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sub-text hidden lg:table-cell">
                    {profile.city}
                  </td>
                  <td className="p-4">
                    {profile.isVerified ? (
                      <Badge variant="success">Onaylı</Badge>
                    ) : (
                      <Badge variant="default">Bekliyor</Badge>
                    )}
                  </td>
                  <td className="p-4 text-sub-text hidden lg:table-cell">
                    {formatDate(profile.createdAt)}
                  </td>
                  <td className="p-4 text-right">
                    <VerifyButton
                      profileId={profile.id}
                      isVerified={profile.isVerified}
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
