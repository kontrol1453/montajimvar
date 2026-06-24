const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const emails = ['fatihbozkurt1907@hotmail.com', 'kontrol1453@gmail.com', 'admin@montajimvar.com'];
  const users = await p.user.findMany({ where: { email: { in: emails } }, select: { id: true, email: true, name: true } });
  console.log('User check:');
  for (const u of users) {
    const prof = await p.profile.findFirst({ where: { userId: u.id }, select: { id: true, companyName: true, premiumUntil: true } });
    if (prof) {
      console.log(u.email, `→ PROFILE #${prof.id} "${prof.companyName}" premiumUntil:`, prof.premiumUntil?.toISOString() ?? 'NULL');
    } else {
      console.log(u.email, `→ NO PROFILE (user ${u.id})`);
    }
  }
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
