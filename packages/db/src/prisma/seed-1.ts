import { prisma } from './index.ts';
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
  const userId = 'cmr3wpp440000xuj70vtlo1mm';
  const schoolId = 'cmr6ptszc000096j7m7xz9zbd';
  const schools = await prisma.session.deleteMany();
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
