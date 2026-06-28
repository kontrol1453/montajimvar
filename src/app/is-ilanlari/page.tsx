import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

const URGENCY_STYLES: Record<string, string> = {
  normal: "bg-gray-500/10 text-gray-400",
  acil: "bg-orange-500/10 text-orange-400",
  cok_acil: "bg-red-500/10 text-red-400",
};

const URGENCY_LABELS: Record<string, string> = {
  normal: "Normal",
  acil: "Acil",
  cok_acil: "Çok Acil",
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });
}

export default async function IsIlanlariPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; city?: string; q?: string }>;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userRoles = (session?.user as any)?.roles || [];

  const sp = await searchParams;
  const categoryId = sp.categoryId;
  const city = sp.city;
  const q = sp.q;

  const where: Record<string, unknown> = {
    status: { in: ["pending", "offers_received"] },
  };

  if (city) where.city = city;
  if (categoryId) {
    where.categories = { some: { categoryId: Number(categoryId) } };
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      categories: {
        include: { category: { select: { id: true, name: true, icon: true } } },
      },
      _count: { select: { offers: true } },
    },
  });

  // Fetch categories for filter
  const categories = await prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, icon: true },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">İş İlanları</h1>
          <p className="text-muted-text">
            İş ilanlarını inceleyin ve teklif gönderin
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            href="/is-ilanlari"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              !categoryId && !city && !q
                ? "bg-montaj text-white border-montaj"
                : "bg-dark-card text-muted-text border-white/[0.06] hover:border-montaj/30"
            }`}
          >
            Tümü
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/is-ilanlari?categoryId=${cat.id}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                Number(categoryId) === cat.id
                  ? "bg-montaj text-white border-montaj"
                  : "bg-dark-card text-muted-text border-white/[0.06] hover:border-montaj/30"
              }`}
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name}
            </Link>
          ))}
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-card flex items-center justify-center">
              <svg className="w-10 h-10 text-sub-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">İlan Bulunamadı</h2>
            <p className="text-muted-text">Şu anda uygun iş ilanı bulunmuyor. Daha sonra tekrar kontrol edin.</p>
          </div>
        ) : (
          <div className="space-y-4">
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
                  className="block bg-dark-card border border-white/[0.06] rounded-xl p-5 hover:border-montaj/20 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {photos.length > 0 ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-dark-section">
                        <img src={photos[0]} alt="" loading="lazy" className="w-full h-full object-cover" />
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
                        {job.urgency && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${URGENCY_STYLES[job.urgency] || ""}`}>
                            {URGENCY_LABELS[job.urgency] || job.urgency}
                          </span>
                        )}
                        <span className="text-xs text-sub-text">{timeAgo(job.createdAt)}</span>
                        {job._count.offers > 0 && (
                          <span className="text-xs text-montaj">{job._count.offers} teklif</span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold truncate group-hover:text-montaj transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-muted-text text-sm line-clamp-2 mt-1">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-sub-text mt-2">
                        <span>{job.city}{job.district ? ` / ${job.district}` : ""}</span>
                        {job.budgetMin && (
                          <span>
                            {(job.budgetMin / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                            {job.budgetMax && ` - ${(job.budgetMax / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}`}
                          </span>
                        )}
                        {photos.length > 0 && (
                          <span>{photos.length} 📷</span>
                        )}
                      </div>
                      {job.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.categories.map((jc) => (
                            <span key={jc.id} className="px-2 py-0.5 bg-dark-section text-sub-text rounded text-xs">
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
