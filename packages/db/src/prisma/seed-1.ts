import { prisma } from './index';

async function main() {
  await prisma.lesson.deleteMany();
  const subject = await prisma.subject.deleteMany();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
