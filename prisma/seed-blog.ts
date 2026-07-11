import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    title: "Mobilya Montajı İçin Bilmeniz Gereken Her Şey",
    slug: "mobilya-montaji-rehberi",
    excerpt: "Mobilya montajı sırasında dikkat edilmesi gerekenler, ortalama fiyatlar ve profesyonel yardım almadan önce bilmeniz gereken ipuçları.",
    content: `<p>Mobilya montajı, yeni aldığınız mobilyaların doğru ve güvenli bir şekilde kurulması için profesyonel yardım gerektiren bir işlemdir. Özellikle IKEA, Koçtaş, Tekzen gibi büyük mağazalardan alınan mobilyaların montajı, uzmanlık ve doğru ekipman gerektirir.</p>
<h2>Mobilya Montajı Neden Profesyonellere Bırakılmalı?</h2>
<p>Yanlış montaj, mobilyalarınızın ömrünü kısaltabilir ve güvenlik riski oluşturabilir. Profesyonel bir montajcı, mobilyanızı üretici talimatlarına uygun şekilde kurar ve olası hasarların önüne geçer.</p>
<h2>Ortalama Mobilya Montaj Fiyatları 2026</h2>
<p>Mobilya montaj fiyatları, ürünün karmaşıklığına ve parça sayısına göre değişir. Tek parça bir dolap montajı 500-1500 TL arasında değişirken, komple bir oda takımı montajı 3000-8000 TL arasında olabilir.</p>
<h2>Montaj Öncesi Hazırlık</h2>
<p>Montaj öncesinde odanızı hazırlayın, mobilya parçalarını kontrol edin ve montaj alanının temiz olduğundan emin olun. Profesyonel montajcınıza doğru iletişim bilgilerini ve adresi verdiğinizden emin olun.</p>`,
    categorySlug: "genel",
    tags: ["mobilya-montaji", "montaj-rehberi", "ev-dekorasyonu"],
    metaTitle: "Mobilya Montajı Rehberi 2026 | Fiyatlar ve İpuçları",
    metaDesc: "Mobilya montajı hakkında bilmeniz gereken her şey: fiyatlar, ipuçları, nelere dikkat edilmeli. Profesyonel montajcılarla güvenli kurulum.",
    city: null,
    serviceSlug: "mobilya-montaji",
  },
  {
    title: "Klima Montajı Fiyatları ve Dikkat Edilmesi Gerekenler",
    slug: "klima-montaji-fiyatlari",
    excerpt: "Klima montajı fiyatları 2026 güncel liste, montaj öncesi hazırlık ve doğru usta seçimi hakkında kapsamlı rehber.",
    content: `<p>Klima montajı, yaz aylarında artan taleple birlikte en çok aranan hizmetlerden biridir. Doğru montaj, klimanızın verimli çalışması ve uzun ömürlü olması için kritik öneme sahiptir.</p>
<h2>Klima Montaj Fiyatları 2026</h2>
<p>Split klima montajı 2000-5000 TL, multi split montajı 4000-10000 TL arasında değişmektedir. Fiyatlar klimanın BTU değerine, montajın zorluğuna ve şehre göre farklılık gösterir.</p>
<h2>Klima Montajında Nelere Dikkat Edilmeli?</h2>
<p>Klima montajı sırasında dış ünite konumu, iç ünite yerleşimi, vakum işlemi ve elektrik bağlantıları gibi kritik noktalar bulunur. Yetkili ve deneyimli bir usta, bu işlemleri güvenle gerçekleştirir.</p>`,
    categorySlug: "genel",
    tags: ["klima-montaji", "iklimlendirme", "yaz-hazirlik"],
    metaTitle: "Klima Montajı Fiyatları 2026 | Profesyonel Klima Kurulumu",
    metaDesc: "Güncel klima montaj fiyatları, montaj süreci ve doğru usta seçimi. Split, multi split ve VRF klima montajı için hemen teklif alın.",
    city: null,
    serviceSlug: "klima-montaji",
  },
  {
    title: "İstanbul'da Mobilya Montajı: En İyi Ustalar ve Fiyatlar",
    slug: "istanbul-mobilya-montaji",
    excerpt: "İstanbul'da mobilya montajı yaptıracaklar için güncel fiyatlar, güvenilir ustalar ve montaj öncesi ipuçları.",
    content: `<p>İstanbul'da mobilya montajı hizmeti arıyorsanız, doğru yerdesiniz. Büyükşehirde yaşamanın getirdiği yoğun tempo içinde mobilya montajı gibi işleri profesyonellere bırakmak hem zaman hem de işçilik kalitesi açısından avantaj sağlar.</p>
<h2>İstanbul Mobilya Montaj Fiyatları</h2>
<p>İstanbul'da mobilya montaj fiyatları, Avrupa ve Anadolu yakasına göre küçük farklılıklar gösterebilir. Ortalama olarak tek parça mobilya montajı 500-2000 TL arasında değişmektedir.</p>
<h2>İstanbul'un Hangi Bölgelerinde Hizmet Veriliyor?</h2>
<p>İstanbul'un tüm ilçelerinde profesyonel montaj hizmeti bulabilirsiniz. Kadıköy, Beşiktaş, Şişli, Üsküdar, Maltepe, Pendik ve daha birçok ilçede deneyimli ustalarımız hizmet vermektedir.</p>`,
    categorySlug: "sehir-rehberi",
    tags: ["istanbul", "mobilya-montaji", "sehir-rehberi"],
    metaTitle: "İstanbul Mobilya Montajı | Güvenilir Ustalar ve Güncel Fiyatlar",
    metaDesc: "İstanbul'da mobilya montajı için profesyonel ustalar. Avrupa ve Anadolu yakasında hızlı ve güvenilir montaj hizmeti. Hemen teklif alın.",
    city: "İstanbul",
    serviceSlug: "mobilya-montaji",
  },
  {
    title: "Ankara Klima Montajı: Deneyimli Ustalarla Güvenli Kurulum",
    slug: "ankara-klima-montaji",
    excerpt: "Ankara'da klima montajı yaptıracaklar için kapsamlı rehber. Güncel fiyatlar, montaj süreci ve usta seçimi ipuçları.",
    content: `<p>Ankara'nın karasal ikliminde yaz ayları oldukça sıcak geçer. Klima montajı, bu sıcak günlerde serinlemek için en doğru çözümdür. Profesyonel klima montajı ile evinizde veya işyerinizde konforlu bir ortam yaratın.</p>
<h2>Ankara Klima Montaj Fiyatları</h2>
<p>Ankara'da klima montaj fiyatları genellikle İstanbul'a göre daha ekonomiktir. Split klima montajı 1500-4000 TL arasında değişmektedir.</p>`,
    categorySlug: "sehir-rehberi",
    tags: ["ankara", "klima-montaji", "sehir-rehberi"],
    metaTitle: "Ankara Klima Montajı | Profesyonel Klima Kurulumu 2026",
    metaDesc: "Ankara'da klima montajı için deneyimli ustalar. Split, multi split klima montajı ve bakım hizmetleri. Hemen teklif alın.",
    city: "Ankara",
    serviceSlug: "klima-montaji",
  },
  {
    title: "Montaj Öncesi ve Sonrası Fotoğraf Çekmenin Önemi",
    slug: "montaj-fotograf-oncesi-sonrasi",
    excerpt: "İş öncesi ve sonrası fotoğraf çekmek neden önemlidir? Montajcınızla yaşanabilecek anlaşmazlıkları önlemenin en kolay yolu.",
    content: `<p>Bir montaj işine başlamadan önce ve iş bittikten sonra fotoğraf çekmek, hem müşteri hem de usta için büyük önem taşır. Bu basit alışkanlık, birçok anlaşmazlığın önüne geçebilir.</p>
<h2>Neden Öncesi/Sonrası Fotoğraf Çekmelisiniz?</h2>
<p>Montaj öncesi fotoğraflar, mevcut durumu belgelemek için önemlidir. Montaj sonrası fotoğraflar ise yapılan işin kalitesini gösterir. Ayrıca olası hasar durumlarında kanıt niteliği taşır.</p>`,
    categorySlug: "ipuclari",
    tags: ["ipuclari", "fotograf", "montaj"],
    metaTitle: "Montaj Öncesi ve Sonrası Fotoğraf Çekme Rehberi",
    metaDesc: "Montaj işlerinde öncesi ve sonrası fotoğraf çekmenin önemi. Anlaşmazlıkları önleyin, iş kalitesini belgeleyin.",
    city: null,
    serviceSlug: null,
  },
  {
    title: "Beyaz Eşya Montajı: Çamaşır Makinesi, Bulaşık Makinesi ve Buzdolabı Kurulumu",
    slug: "beyaz-esya-montaji-rehberi",
    excerpt: "Beyaz eşya montajı hakkında bilmeniz gerekenler. Çamaşır makinesi, bulaşık makinesi ve buzdolabı kurulum fiyatları ve ipuçları.",
    content: `<p>Yeni aldığınız beyaz eşyaların montajı, ürünlerin verimli çalışması ve garanti koşullarının korunması için profesyonel ellerde yapılmalıdır.</p>
<h2>Beyaz Eşya Montaj Fiyatları</h2>
<p>Çamaşır makinesi montajı 300-800 TL, bulaşık makinesi montajı 300-800 TL, buzdolabı montajı 400-1000 TL arasında değişmektedir. Ankastre set kurulumu daha yüksek ücretlidir.</p>`,
    categorySlug: "genel",
    tags: ["beyaz-esya", "montaj", "ev-aletleri"],
    metaTitle: "Beyaz Eşya Montajı Rehberi | Fiyatlar ve Kurulum İpuçları",
    metaDesc: "Çamaşır makinesi, bulaşık makinesi ve buzdolabı montajı hakkında her şey. Profesyonel kurulum ile cihazlarınızın ömrünü uzatın.",
    city: null,
    serviceSlug: "beyaz-esya-montaji",
  },
];

async function main() {
  console.log("Seeding blog posts...");

  const categories = await prisma.blogCategory.findMany();
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));

  // Auto-create categories if missing
  const needed = ["genel", "sehir-rehberi", "ipuclari"];
  for (const slug of needed) {
    if (!catMap.has(slug)) {
      const name = slug === "genel" ? "Genel" : slug === "sehir-rehberi" ? "Şehir Rehberi" : "İpuçları";
      const cat = await prisma.blogCategory.create({ data: { name, slug } });
      catMap.set(slug, cat.id);
      console.log(`  kategori oluşturuldu: ${name}`);
    }
  }

  let created = 0;
  for (const post of POSTS) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (exists) continue;

    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        categoryId: catMap.get(post.categorySlug) || null,
        author: "MontajımVar",
        tags: JSON.stringify(post.tags),
        metaTitle: post.metaTitle,
        metaDesc: post.metaDesc,
        city: post.city,
        serviceSlug: post.serviceSlug,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    created++;
  }

  console.log(`✓ ${created} yazı oluşturuldu.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
