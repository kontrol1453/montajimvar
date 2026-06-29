const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const posts = await prisma.blogPost.findMany({ 
    select: { id: true, title: true, slug: true, isPublished: true, publishedAt: true } 
  });
  console.log(JSON.stringify(posts, null, 2));
  const total = await prisma.blogPost.count();
  const published = await prisma.blogPost.count({ where: { isPublished: true } });
  console.log('Total:', total, 'Published:', published);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
