const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  // Check current state
  const u = await p.user.findUnique({
    where: { id: 58 },
    select: { id: true, name: true, email: true, roles: true }
  });
  console.log('BEFORE:', JSON.stringify(u));
  
  // Make the API call with a mock - actually just simulate what the API does
  const newRoles = ['ADMIN', 'ASSEMBLER'];
  await p.user.update({
    where: { id: 58 },
    data: { roles: newRoles }
  });
  
  // Check after update
  const u2 = await p.user.findUnique({
    where: { id: 58 },
    select: { id: true, name: true, email: true, roles: true }
  });
  console.log('AFTER:', JSON.stringify(u2));
  
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
