import { prisma } from '.';

async function main() {
  const student = await prisma.student.update({
    where: {
      id: 'cmjypb8i30003ohnw56o6ccoo',
    },
    data: {
      profile: {
        update: {
          photo: 'cmjxjksut000041nwgsrc610n-1767563053416-53186339.jpeg',
        },
      },
    },
  });
  console.log(student);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
