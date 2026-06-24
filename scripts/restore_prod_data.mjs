import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const dumpPath = process.env.DUMP_PATH;
if (!dumpPath) { console.error('DUMP_PATH env var required'); process.exit(1); }

const p = new PrismaClient();

try {
  // Read and clean the dump
  let sql = readFileSync(dumpPath, 'utf-8');
  sql = sql.split('\n').filter(line => !line.startsWith('\\')).join('\n');
  
  const inserts = sql.split('\n').filter(line => line.startsWith('INSERT INTO'));
  console.log(`Total INSERT statements: ${inserts.length}`);

  const byTable = {};
  for (const line of inserts) {
    const m = line.match(/INSERT INTO public\.\"(\w+)\"/);
    if (m) byTable[m[1]] = (byTable[m[1]] || []).concat(line);
  }
  console.log('Tables:', Object.keys(byTable).join(', '));
  for (const [t, rows] of Object.entries(byTable)) {
    console.log(`  ${t}: ${rows.length} rows`);
  }

  // Clear existing data
  console.log('\nClearing existing data...');
  const delOrder = ['ProfileCategory','Review','Notification','Favorite','Message',
    'ProfileImage','SubscriptionPayment','PasswordResetToken','Profile','User',
    'Category','SubscriptionPlan','RolePermission'];
  for (const table of delOrder) {
    try { 
      await p.$executeRawUnsafe(`DELETE FROM "${table}" CASCADE`);
      console.log(`  Cleared ${table}`);
    } catch(e) { /* ok */ }
  }

  // Reset sequences
  console.log('\nResetting sequences...');
  for (const table of Object.keys(byTable)) {
    try {
      await p.$executeRawUnsafe(`ALTER SEQUENCE public."${table}_id_seq" RESTART WITH 1`);
      console.log(`  Reset ${table}_id_seq`);
    } catch(e) { /* no sequence */ }
  }

  // Insert in dependency order
  const insertOrder = ['Category','SubscriptionPlan','RolePermission','User',
    'Profile','ProfileCategory','Review','Notification','Favorite','Message',
    'ProfileImage','SubscriptionPayment','PasswordResetToken'];
  
  let total = 0, failed = 0;
  for (const table of insertOrder) {
    const stmts = byTable[table];
    if (!stmts) continue;
    console.log(`\nInserting ${stmts.length} rows into ${table}...`);
    for (const stmt of stmts) {
      try {
        await p.$executeRawUnsafe(stmt);
        total++;
      } catch(e) {
        console.error(`  FAILED: ${e.message}`);
        console.error(`  SQL: ${stmt.substring(0, 120)}`);
        failed++;
      }
    }
  }

  // Fix sequences to max id
  console.log('\nFixing sequences...');
  for (const table of Object.keys(byTable)) {
    try {
      await p.$executeRawUnsafe(`SELECT setval('"${table}_id_seq"', COALESCE((SELECT MAX(id) FROM "${table}"), 1))`);
    } catch(e) { /* ok */ }
  }

  console.log(`\n✅ Done: ${total} rows inserted, ${failed} failed`);
} finally {
  await p.$disconnect();
}
