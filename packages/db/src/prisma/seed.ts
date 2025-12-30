import { prisma } from '.';

async function main() {
  try {
    const school = await prisma.schoolUser.create({
      data: {
        userId: 'cmjriopmo000b60mv5rnr5ozf',
        schoolId: 'cmjrl907d0000y2mv43herxek',
        isOwner: true,
        role: 'ADMIN',
      },
    });
    console.log('Utilisateurs existants:', school);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Erreur lors de l'exécution du seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });