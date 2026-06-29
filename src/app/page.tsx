import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Search,
  Briefcase,
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
  Play,
  Camera,
  Building2,
  HardHat,
} from "lucide-react";
import HomeHero from "./HomeHero";
import HomeServices from "./HomeServices";
import HomeStats from "./HomeStats";
// HomeBrands, HomeHowItWorks defined inline below
import HomeCta from "./HomeCta";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [profileCount, cities, ratingAgg, categoryCount, parentCategories] =
    await Promise.all([
      prisma.profile.count(),
      prisma.profile.findMany({
        select: { city: true },
        distinct: ["city"],
        where: { city: { not: "" } },
      }),
      prisma.profile.aggregate({ _avg: { ratingAvg: true } }),
      prisma.category.count(),
      prisma.category.findMany({
        where: { parentId: null, isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 8,
        include: {
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            take: 4,
          },
        },
      }),
    ]);
  return {
    profileCount,
    cityCount: cities.length,
    avgRating: ratingAgg._avg.ratingAvg
      ? Number(ratingAgg._avg.ratingAvg.toFixed(1))
      : 0,
    categoryCount,
    parentCategories,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="overflow-hidden">
      {/* ─── HERO ─── */}
      <HomeHero />

      {/* ─── MARKALAR ─── */}
      <HomeBrands />

      {/* ─── HİZMET KATEGORİLERİ ─── */}
      <HomeServices categories={data.parentCategories} />

      {/* ─── NASIL ÇALIŞIR ─── */}
      <HomeHowItWorks />

      {/* ─── VİDEO SEKTÖRÜ ─── */}
      <VideoSection />

      {/* ─── İSTATİSTİKLER ─── */}
      <HomeStats
        profileCount={data.profileCount}
        cityCount={data.cityCount}
        avgRating={data.avgRating}
        categoryCount={data.categoryCount}
      />

      {/* ─── AI TEKLİF ─── */}
      <AiSection />

      {/* ─── BLOG ─── */}
      <BlogSection />

      {/* ─── SSS ─── */}
      <FaqSection />

      {/* ─── CTA ─── */}
      <HomeCta />
    </div>
  );
}

/* ================================================================
   MARKALAR
   ================================================================ */
function HomeBrands() {
  const brands = [
    { name: "Vestel", icon: Building2 },
    { name: "Koçtaş", icon: Building2 },
    { name: "Tekzen", icon: Building2 },
    { name: "MediaMarkt", icon: Building2 },
    { name: "IKEA", icon: Building2 },
    { name: "Bellona", icon: Building2 },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-app">
        <p className="text-center text-sm font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-8">
          Montajım Var&apos;a güvenen markalar
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2 text-[var(--color-text-tertiary)] grayscale hover:grayscale-0 hover:text-[var(--color-text-tertiary)] transition-all duration-300"
            >
              <brand.icon size={24} />
              <span className="text-lg font-bold tracking-tight">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   NASIL ÇALIŞIR
   ================================================================ */
const steps = [
  {
    number: "01",
    title: "İşini Ver",
    desc: "Fotoğraf ekle, konum seç ve işini açıkla. Bütçeni belirt, teklif almaya başla.",
    icon: Briefcase,
    color: "#0B5FFF",
  },
  {
    number: "02",
    title: "Teklif Al",
    desc: "Doğrulanmış montaj ekiplerinden teklifler gelir. Puanları ve fiyatları karşılaştır.",
    icon: Users,
    color: "#00C853",
  },
  {
    number: "03",
    title: "İşi Takip Et",
    desc: "Canlı haritada ekibini takip et, iş ilerledikçe durum güncellemelerini gör.",
    icon: CheckCircle,
    color: "#0B5FFF",
  },
  {
    number: "04",
    title: "Güvenle Öde",
    desc: "İş tamamlanana kadar ödemen emanette. Onay verince ustanın hesabına aktarılır.",
    icon: Shield,
    color: "#00C853",
  },
];

function HomeHowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Süreç
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Dört basit adımda ihtiyacınız olan montaj uzmanını bulun ve işinizi halledin.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="card p-8 text-center group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative mx-auto mb-6">
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: `${step.color}10` }}
                >
                  <step.icon size={28} style={{ color: step.color }} />
                </div>
                <span
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: step.color }}
                >
                  {step.number}
                </span>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif", color: "var(--color-dark)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 text-[var(--color-border-default)]">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   VİDEO
   ================================================================ */
function VideoSection() {
  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Montaj Süreci
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Profesyonel Montajın Her Aşaması
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Saha ekiplerimizin gerçek montaj görüntüleri.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden bg-[var(--color-dark)] aspect-video flex items-center justify-center group cursor-pointer shadow-elevated">
          {/* Placeholder visual */}
          <div className="absolute inset-0 grid grid-cols-3 gap-px opacity-40">
            {["AVM Montajı", "Reklam Tabelası", "Mobilya Kurulumu", "Fuar Standı", "Elektrik Montajı", "Endüstriyel"].map((label, i) => (
              <div key={label} className="bg-[var(--color-dark)]/80 flex items-center justify-center p-4">
                <div className="text-center">
                  <HardHat size={32} className="mx-auto mb-2 text-white" />
                  <p className="text-xs text-white">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Play button */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/30">
            <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
            <Play size={32} className="text-white ml-1" fill="white" />
          </div>

          <p className="absolute bottom-6 left-6 text-white text-sm font-medium flex items-center gap-2">
            <Camera size={16} />
            Montaj görüntülerini izleyin
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   AI TEKLİF
   ================================================================ */
function AiSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Mock AI Flow */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-3xl blur-2xl" />
              <div className="relative bg-[var(--color-surface-secondary)] rounded-2xl p-8 border border-[var(--color-border-light)]">
                <div className="space-y-5">
                  {/* Step 1 */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">1</div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-dark)]">Fotoğraf Yükle</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">İş yerinin fotoğraflarını çek</p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center text-[var(--color-text-tertiary)]">
                    <ArrowRight size={20} />
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] font-bold text-sm">2</div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-dark)]">AI Analiz</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">Yapay zeka işi analiz eder</p>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center text-[var(--color-text-tertiary)]">
                    <ArrowRight size={20} />
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">3</div>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-dark)]">Tahmini Süre</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">~2 saat</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-dark)]">Tahmini Bütçe</p>
                        <p className="text-xs text-[var(--color-accent)] font-semibold">₺1.200 - ₺1.800</p>
                      </div>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center text-[var(--color-text-tertiary)]">
                    <ArrowRight size={20} />
                  </div>
                  {/* Step 4 */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm ring-1 ring-[var(--color-primary)]/20">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[var(--color-accent)]" />
                      <p className="text-sm font-semibold text-[var(--color-dark)]">Teklifler Hazır</p>
                      <span className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-0.5 rounded-full font-medium">3 teklif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Text */}
            <div>
              <span className="section-label">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                Yapay Zeka Destekli
              </span>
              <h2 className="heading-lg mt-4 mb-3">
                Fotoğrafı Yükle,{" "}
                <span className="text-[var(--color-primary)]">AI Analiz Etsin</span>
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                İş yerinin fotoğraflarını çek, yapay zeka montajı analiz etsin.
                Tahmini süre, bütçe ve uygun ekip önerileri anında karşında.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Fotoğraftan otomatik iş analizi",
                  "Yapay zeka ile tahmini fiyatlandırma",
                  "İşine en uygun montaj ekibi eşleştirmesi",
                  "Anlık teklif karşılaştırma",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                    <CheckCircle size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/is-ver" className="btn-primary">
                Şimdi Dene
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BLOG
   ================================================================ */
async function BlogSection() {
  let posts: { title: string; slug: string; excerpt: string | null; coverImage: string | null }[] = [];

  try {
    const result = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { title: true, slug: true, excerpt: true, coverImage: true },
    });
    posts = result;
  } catch {
    // Blog table may not exist yet
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Blog
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Montaj Sektöründen Haberler
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Profesyonel montaj ipuçları, sektör haberleri ve rehberler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card overflow-hidden group">
                <div className="aspect-[16/9] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <Camera size={32} className="text-[var(--color-text-tertiary)]" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[var(--color-dark)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length >= 3 && (
          <div className="text-center mt-10">
            <Link href="/blog" className="btn-secondary">
              Tüm Yazılar
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================
   SSS
   ================================================================ */
function FaqSection() {
  const faqs = [
    {
      q: "Nasıl montaj ekibi bulabilirim?",
      a: "İş Ver sayfasından işinizi tanımlayın, fotoğraflarınızı ekleyin ve bütçenizi belirtin. Sistemimiz size uygun doğrulanmış montaj ekiplerinden teklifleri anında iletir.",
    },
    {
      q: "Montaj ekibi nasıl kayıt olabilir?",
      a: "Kaydol sayfasından ücretsiz hesap oluşturun, firma bilgilerinizi ekleyin ve doğrulama sürecini tamamlayın. Onaylanan ekipler hemen teklif almaya başlayabilir.",
    },
    {
      q: "Ödeme nasıl korunuyor?",
      a: "Ödemeniz iş tamamlanana kadar emanet sistemimizde tutulur. İşi onayladığınızda ödeme otomatik olarak montaj ekibine aktarılır.",
    },
    {
      q: "Hangi şehirlerde hizmet veriyorsunuz?",
      a: "Türkiye genelinde 81 şehirde hizmet veriyoruz. Büyükşehirlerde aynı gün hizmet, diğer şehirlerde 24-48 saat içinde montaj ekibi yönlendiriyoruz.",
    },
    {
      q: "Kurumsal çözümler sunuyor musunuz?",
      a: "Evet, zincir mağaza kurulumları, AVM montajları ve fuar standı projeleri için kurumsal çözümler sunuyoruz. Toplu işlerde özel fiyatlandırma ve öncelikli destek sağlıyoruz.",
    },
  ];

  return (
    <section className="py-24 bg-white" id="sss">
      <div className="container-app">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              SSS
            </span>
            <h2 className="heading-lg mt-4 mb-3">
              Sık Sorulan Sorular
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Merak ettiğiniz her şeyin cevabı burada.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="card overflow-hidden group open:ring-1 open:ring-[var(--color-primary)]/10"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-sm font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors">
                  {faq.q}
                  <ArrowRight size={16} className="shrink-0 transition-transform group-open:rotate-90 text-[var(--color-text-tertiary)]" />
                </summary>
                <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border-light)] pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

