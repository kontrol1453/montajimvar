const { PrismaClient } = require('@prisma/client');
const iconv = require('iconv-lite');
const prisma = new PrismaClient();

function fixMojibake(str) {
  if (!str || typeof str !== 'string') return str;
  let hasMojibake = false;
  const bytes = [];
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp < 128) {
      bytes.push(cp);
    } else {
      const encoded = iconv.encode(ch, 'CP857');
      if (encoded.length === 1) {
        bytes.push(encoded[0]);
        hasMojibake = true;
      } else {
        const utf8Buf = iconv.encode(ch, 'UTF-8');
        for (const b of utf8Buf) bytes.push(b);
      }
    }
  }
  if (!hasMojibake) return str;
  return iconv.decode(Buffer.from(bytes), 'UTF-8');
}

async function main() {
  console.log('=== Fixing category slugs ===');
  const cats = await prisma.category.findMany({ orderBy: { id: 'asc' } });
  let fixed = 0;
  for (const c of cats) {
    const newSlug = fixMojibake(c.slug);
    const newIcon = c.icon ? fixMojibake(c.icon) : null;
    if (newSlug !== c.slug || newIcon !== c.icon) {
      await prisma.category.update({ where: { id: c.id }, data: { slug: newSlug, icon: newIcon } });
      console.log(`  #${c.id}: slug "${c.slug}" -> "${newSlug}"`);
      fixed++;
    }
  }
  console.log(`Fixed ${fixed} categories`);

  // Also check for any other table with slug-like fields
  console.log('\n=== Checking all tables for remaining mojibake ===');
  const models = ['profile', 'user', 'review', 'message', 'notification', 'subscriptionPlan', 'profileImage'];
  for (const model of models) {
    const records = await prisma[model].findMany();
    let modelFixed = 0;
    for (const rec of records) {
      const updateData = {};
      for (const [key, val] of Object.entries(rec)) {
        if (typeof val === 'string' && val.length > 0 && val !== '[]' && !key.includes('password') && !key.includes('token')) {
          const fixed = fixMojibake(val);
          if (fixed !== val) {
            updateData[key] = fixed;
          }
        }
      }
      if (Object.keys(updateData).length > 0) {
        await prisma[model].update({ where: { id: rec.id }, data: updateData });
        console.log(`  ${model} #${rec.id}: ${Object.keys(updateData).join(', ')}`);
        modelFixed++;
      }
    }
    if (modelFixed > 0) console.log(`  Fixed ${modelFixed} ${model} records`);
  }

  console.log('\nDone!');
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
