import { prisma } from './index';

async function main() {
  /*await prisma.permission.createMany({
    data: [
      {
        code: 'MARK_STUDENT_ATTENDANCE',
        name: 'Appel des élèves',
        module: 'ATTENDANCE',
      },
      {
        code: 'MARK_TEACHER_ATTENDANCE',
        name: 'Appel des professeurs',
        module: 'ATTENDANCE',
      },
      {
        code: 'MARK_STAFF_ATTENDANCE',
        name: 'Appel du personnel',
        module: 'ATTENDANCE',
      },
    ],
    skipDuplicates: true,
  }); */
  const admin = 'msmdmsmoeoemfdmfdds';
  const teachers = await prisma.teacher.findMany({
    where: {
      schoolUser: {
        schoolId: 'cmpskwfd80000q6s80sh8uznl',
      },
      include: {
        schoolUser: {
          select: {
            user: {
              select: {
                profile: true,
              },
            },
          },
        },
      },
    },
  });

  console.log('Teachers', teachers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
