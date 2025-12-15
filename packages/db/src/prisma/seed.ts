import { prisma } from ".";

async function main() {
  try {
    const user = await prisma.user.findMany();
    console.log("Utilisateurs existants:", user);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
