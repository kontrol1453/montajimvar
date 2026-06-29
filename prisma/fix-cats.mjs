import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  await p.profile.updateMany({ data: { categoryId: null } });
  console.log("Profiles detached");
  await p.category.deleteMany({});
  console.log("Categories deleted");
  await p.$executeRawUnsafe('ALTER SEQUENCE "Category_id_seq" RESTART WITH 1');
  console.log("Sequence reset");
} catch(e) { console.error(e); } finally { await p.$disconnect(); }
