import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MAJOR_CITIES = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
  "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri",
  "Eskişehir", "Diyarbakır", "Samsun", "Trabzon", "Malatya",
];

function slugify(text: string) {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return text
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (l) => map[l] || l)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("Seeding city pages...");

  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.log("No categories found. Run prisma/seed.ts first.");
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const city of MAJOR_CITIES) {
    for (const cat of categories) {
      const slug = `${slugify(city)}-${cat.slug}`;
      const exists = await prisma.cityServicePage.findUnique({ where: { slug } });
      if (exists) {
        skipped++;
        continue;
      }

      await prisma.cityServicePage.create({
        data: {
          city,
          service: cat.name,
          title: `${city} ${cat.name} | MontajımVar`,
          content: `${city} şehrinde ${cat.name.toLowerCase()} hizmeti mi arıyorsunuz? Profesyonel ekibimizle ${city} ve çevresinde ${cat.name.toLowerCase()} işlemlerinizi güvenle yaptırın. Hemen teklif alın!`,
          metaTitle: `${city} ${cat.name} — Profesyonel Montaj Hizmeti`,
          metaDesc: `${city} ${cat.name.toLowerCase()} için güvenilir ustalar. Hızlı teklif al, fiyat karşılaştır, kaliteli hizmete ulaş.`,
          slug,
        },
      });
      created++;
    }
  }

  console.log(`✓ ${created} sayfa oluşturuldu, ${skipped} atlandı.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
