import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function FaturalarPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");
  const userId = (session.user as any).id;

  const invoices = await prisma.invoice.findMany({
    where: { recipientId: userId },
    include: { job: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalAmount = invoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Faturalarım</h1>
          <p className="text-sm text-sub-text mt-1">Toplam {invoices.length} fatura — {(totalAmount / 100).toLocaleString("tr-TR")} TL</p>
        </div>
      </div>

      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-section">
              <th className="text-left p-4 text-sub-text font-medium">Fatura No</th>
              <th className="text-left p-4 text-sub-text font-medium">İş</th>
              <th className="text-left p-4 text-sub-text font-medium hidden sm:table-cell">Tür</th>
              <th className="text-right p-4 text-sub-text font-medium">Tutar</th>
              <th className="text-left p-4 text-sub-text font-medium hidden md:table-cell">Durum</th>
              <th className="text-left p-4 text-sub-text font-medium hidden lg:table-cell">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {invoices.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-sub-text">Henüz faturanız bulunmuyor.</td></tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-dark-section/50">
                <td className="p-4 font-mono text-white text-xs">{inv.invoiceNo}</td>
                <td className="p-4">
                  <Link href={`/isler/${inv.job.id}`} className="text-montaj hover:underline">{inv.job.title}</Link>
                </td>
                <td className="p-4 text-muted-text hidden sm:table-cell capitalize">{inv.type === "sale" ? "Satış" : inv.type === "commission" ? "Komisyon" : "İade"}</td>
                <td className="p-4 text-right text-white font-medium">{(inv.amount / 100).toLocaleString("tr-TR")} TL</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${inv.status === "paid" ? "bg-green-900/30 text-green-400" : inv.status === "cancelled" ? "bg-red-900/30 text-red-400" : "bg-amber-900/30 text-amber-400"}`}>
                    {inv.status === "paid" ? "Ödendi" : inv.status === "cancelled" ? "İptal" : "Bekliyor"}
                  </span>
                </td>
                <td className="p-4 text-sub-text text-xs hidden lg:table-cell">{formatDate(inv.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
