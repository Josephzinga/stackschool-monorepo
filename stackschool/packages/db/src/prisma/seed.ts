import { PrismaClient } from "generated/client";

const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.account.create({
      data: {
        providerAccountId: "mdmdmdmdm",
        provider: "joseph",
        userId: "cmguqndya0000qmlr7kzbovv3",
      },
    });
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
