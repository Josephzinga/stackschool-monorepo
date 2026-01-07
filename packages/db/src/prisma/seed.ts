import { prisma } from '.';

async function main() {
  console.log('Start seeding...');

  const session = await prisma.session.deleteMany();
  console.log(session);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
