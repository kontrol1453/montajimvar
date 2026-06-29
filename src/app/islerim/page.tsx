import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  offers_received: "bg-blue-500/20 text-blue-400",
  assigned: "bg-purple-500/20 text-purple-400",
  en_route: "bg-cyan-500/20 text-cyan-400",
  in_progress: "bg-montaj/20 text-montaj",
  completed: "bg-green-500/20 text-green-400",
  review_pending: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Teklif Bekliyor",
  offers_received: "Teklifler Geldi",
  assigned: "Usta Atandı",
  en_route: "Yolda",
  in_progress: "Devam Ediyor",
  completed: "Tamamlandı",
  review_pending: "Değerlendiriliyor",
  cancelled: "İptal Edildi",
};

export default async function IslerimPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = Number((session.user as any).id);

  const jobs = await prisma.job.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      categories: {
        include: { category: { select: { id: true, name: true, icon: true } } },
      },
      _count: { select: { offers: true } },
    },
  });

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">İşlerim</h1>
            <p className="text-muted-text text-sm mt-1">
              Verdiğiniz işleri görüntüleyin ve yönetin
            </p>
          </div>
          <Link
            href="/is-ver"
            className="px-5 py-2.5 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all"
          >
            + Yeni İş Ver
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-card flex items-center justify-center">
              <svg className="w-10 h-10 text-sub-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Henüz İş Vermediniz</h2>
            <p className="text-muted-text mb-6">İlk işinizi verin ve ustalardan teklif almaya başlayın</p>
            <Link
              href="/is-ver"
              className="inline-flex px-6 py-3 bg-montaj text-white font-semibold rounded-xl hover:bg-montaj-dark transition-all"
            >
              İlk İşi Ver
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const photos: string[] = (() => {
                try {
                  return JSON.parse(job.photos);
                } catch {
                  return [];
                }
              })();

              return (
                <Link
                  key={job.id}
                  href={`/isler/${job.id}`}
                  className="group bg-dark-card border border-white/[0.06] rounded-xl p-5 hover:border-montaj/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {photos.length > 0 ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-dark-section">
                        <img
                          src={photos[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg shrink-0 bg-dark-section flex items-center justify-center">
                        <svg className="w-8 h-8 text-sub-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[job.status] || "bg-gray-500/20 text-gray-400"}`}>
                          {STATUS_LABELS[job.status] || job.status}
                        </span>
                        {job._count.offers > 0 && (
                          <span className="text-xs text-montaj font-medium">
                            {job._count.offers} teklif
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold truncate group-hover:text-montaj transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-sub-text mt-1.5">
                        <span>{job.city}</span>
                        {job.budgetMin && (
                          <span>
                            {(job.budgetMin / 100).toLocaleString("tr-TR")} ₺
                            {job.budgetMax && ` - ${(job.budgetMax / 100).toLocaleString("tr-TR")} ₺`}
                          </span>
                        )}
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                      {job.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.categories.map((jc) => (
                            <span
                              key={jc.id}
                              className="px-2 py-0.5 bg-dark-section text-sub-text rounded text-xs"
                            >
                              {jc.category.icon && <span className="mr-0.5">{jc.category.icon}</span>}
                              {jc.category.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
