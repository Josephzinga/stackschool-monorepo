import { prisma } from '.';

async function main() {
  const subject = await prisma.subject.create({
    data: {
      name: 'Français',
      teacherId: '',
      schoolId: '',
    },
  });

  console.log(subject);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
