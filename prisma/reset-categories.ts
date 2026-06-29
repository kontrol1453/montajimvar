import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️ Deleting all categories...');
  await prisma.category.deleteMany({});
  
  // Reset the auto-increment sequence
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Category_id_seq" RESTART WITH 1`
  );
  
  console.log('✅ Categories cleaned, sequence reset.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
