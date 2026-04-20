import { prisma } from './index';

async function main() {
  const students = await prisma.student.findMany();
  for (let i = 0; i < students.length; i++) {
    await prisma.student.update({
      where: {
        id: students[i].id,
      },
      data: {
        studentNumber: i + 1,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
