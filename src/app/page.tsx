import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CompanyCard from "@/components/CompanyCard";

export const dynamic = "force-dynamic";

async function getFeaturedProfiles() {
  const profiles = await prisma.profile.findMany({
    take: 6,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
  return profiles;
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function HomePage() {
  const [featuredProfiles, categories] = await Promise.all([
    getFeaturedProfiles(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-montaj via-montaj-dark to-[#cc5500] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Montajcınızı Bulun, İşinizi Büyütün
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80">
              Türkiye&apos;nin dört bir yanındaki güvenilir montaj firmaları, üreticiler ve
              müşterileri bir araya getiren platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/ara"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-montaj-dark font-semibold rounded-lg hover:bg-gray-100 transition text-center"
              >
                Firmaları Keşfet
              </Link>
              <Link
                href="/auth/kayit"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition text-center"
              >
                Hemen Katıl
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-16 md:py-20 bg-dark-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Nasıl Çalışır?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-montaj/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ara ve Bul</h3>
              <p className="text-muted-text">
                Şehrine ve ihtiyacına uygun montaj firmalarını filtrelerle kolayca bul.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-montaj/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">İncele ve Karşılaştır</h3>
              <p className="text-muted-text">
                Firma profillerini incele, deneyimlerini gör ve en uygununu seç.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-montaj/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">İletişime Geç</h3>
              <p className="text-muted-text">
                Platform üzerinden mesaj gönder, teklif al ve anlaşmaya var.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Kategoriler
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ara?kategori=${cat.slug}`}
                  className="flex items-center gap-3 p-4 border border-dark-border rounded-xl hover:border-montaj hover:bg-dark-card transition"
                >
                  <span className="font-medium text-white">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Öne Çıkan Firmalar */}
      {featuredProfiles.length > 0 && (
        <section className="py-16 md:py-20 bg-dark-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Öne Çıkan Firmalar</h2>
              <Link
                href="/ara"
                className="text-montaj hover:text-montaj-light font-medium hidden sm:inline"
              >
                Tümünü Gör →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProfiles.map((profile) => (
                <CompanyCard key={profile.id} profile={profile} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/ara"
                className="inline-block text-montaj hover:text-montaj-light font-medium"
              >
                Tümünü Gör →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
