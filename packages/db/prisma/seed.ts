import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  try {
    await prisma.user.create({
      data: {
        email: "futizingajoseph@gmail.com",
        password: await bcrypt.hash("joseph", 10),
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
