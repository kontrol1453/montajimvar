const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const users = await p.user.findMany({
    where: { email: { in: ['fatihbozkurt1907@hotmail.com', 'kontrol1453@gmail.com', 'admin@montajimvar.com'] } },
    select: { id: true, name: true, email: true, premiumUntil: true, roles: true }
  });
  console.log('=== USERS ===');
  for (const u of users) {
    console.log(JSON.stringify({ ...u, premiumUntil: u.premiumUntil?.toISOString() ?? null }));
  }
  console.log('\n=== PROFILES ===');
  for (const u of users) {
    const prof = await p.profile.findFirst({ where: { userId: u.id }, select: { premiumUntil: true } });
    console.log(u.email, 'Profile premiumUntil:', prof?.premiumUntil?.toISOString() ?? null);
  }
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); process.exit(1); });
