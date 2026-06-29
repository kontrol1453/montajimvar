import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  // First, clear all categories (delete profiles that reference them first)
  await p.profileImage.deleteMany({});
  await p.review.deleteMany({});
  await p.favorite.deleteMany({});
  await p.profileCategory.deleteMany({});
  await p.profile.deleteMany({});
  await p.category.deleteMany({});
  
  // Reset sequence
  await p.$executeRawUnsafe('ALTER SEQUENCE "Category_id_seq" RESTART WITH 1');
  console.log("Categories and related data cleared, sequence reset.");
} catch(e) { console.error(e); } finally { await p.$disconnect(); }
