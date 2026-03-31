const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error('Usage: node scripts/set-admin.js <email_or_username>');
    process.exit(1);
  }

  // Search for user by email or name
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { contains: username } },
        { name: { contains: username } },
      ],
    },
  });

  if (!user) {
    console.error(`❌ Utilisateur "${username}" non trouvé`);
    process.exit(1);
  }

  // Update role to ADMIN
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });

  console.log(`✅ ${updated.name} (${updated.email}) est maintenant ADMIN`);
  process.exit(0);
}

main().catch((e) => {
  console.error('Erreur:', e.message);
  process.exit(1);
});
