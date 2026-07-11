import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function GelirlerPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");
  const userId = (session.user as any).id;

  const payments = await prisma.payment.findMany({
    where: {
      OR: [{ customerId: userId }, { artisanId: userId }],
      status: { not: "cancelled" },
    },
    include: { job: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const now = new Date();
  const daily = payments.filter((p) => p.paidAt && p.paidAt > new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const monthly = payments.filter((p) => p.paidAt && p.paidAt.getMonth() === now.getMonth() && p.paidAt.getFullYear() === now.getFullYear());
  const totalGross = payments.reduce((s, p) => s + p.amount, 0);
  const totalCommission = payments.reduce((s, p) => s + p.commission, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">Gelirler</h1>
      <p className="text-sm text-sub-text mb-6">Kazanç ve ödeme geçmişiniz</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-dark-card rounded-xl border border-dark-border p-5">
          <p className="text-sm text-sub-text mb-1">Bugün</p>
          <p className="text-2xl font-bold text-white">{daily.reduce((s, p) => s + p.amount, 0).toLocaleString("tr-TR")} TL</p>
          <p className="text-xs text-sub-text mt-1">{daily.filter((p) => p.status === "released").length} iş</p>
        </div>
        <div className="bg-dark-card rounded-xl border border-dark-border p-5">
          <p className="text-sm text-sub-text mb-1">Bu Ay</p>
          <p className="text-2xl font-bold text-white">{monthly.reduce((s, p) => s + p.amount, 0).toLocaleString("tr-TR")} TL</p>
          <p className="text-xs text-sub-text mt-1">{monthly.filter((p) => p.status === "released").length} iş</p>
        </div>
        <div className="bg-dark-card rounded-xl border border-dark-border p-5">
          <p className="text-sm text-sub-text mb-1">Toplam (Net)</p>
          <p className="text-2xl font-bold text-white">{(totalGross - totalCommission).toLocaleString("tr-TR")} TL</p>
          <p className="text-xs text-sub-text mt-1">{payments.length} işlem</p>
        </div>
      </div>

      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-section">
              <th className="text-left p-4 text-sub-text font-medium">İş</th>
              <th className="text-right p-4 text-sub-text font-medium">Tutar</th>
              <th className="text-right p-4 text-sub-text font-medium hidden sm:table-cell">Komisyon</th>
              <th className="text-left p-4 text-sub-text font-medium">Durum</th>
              <th className="text-left p-4 text-sub-text font-medium hidden md:table-cell">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {payments.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-sub-text">Henüz ödeme kaydı yok.</td></tr>
            ) : payments.map((p) => (
              <tr key={p.id} className="hover:bg-dark-section/50">
                <td className="p-4 text-montaj text-xs">{p.job.title}</td>
                <td className="p-4 text-right text-white font-medium">{p.amount.toLocaleString("tr-TR")} TL</td>
                <td className="p-4 text-right text-sub-text hidden sm:table-cell">-{p.commission.toLocaleString("tr-TR")} TL</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    p.status === "released" ? "bg-green-900/30 text-green-400" :
                    p.status === "escrow" ? "bg-amber-900/30 text-amber-400" :
                    "bg-red-900/30 text-red-400"
                  }`}>
                    {p.status === "released" ? "Serbest" : p.status === "escrow" ? "Emanette" : "İade"}
                  </span>
                </td>
                <td className="p-4 text-sub-text text-xs hidden md:table-cell">{p.paidAt ? formatDate(p.paidAt) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
