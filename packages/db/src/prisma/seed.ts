import { prisma } from '.';

async function main() {
  const schoolId = 'cmjrl907d0000y2mv43herxek';
  const classId = 'cmjxihigu0000m0nwrns9mx45';
  const subjectId = 'cmkaas7u50000dinwyxnhdquf';
  const classSubjects = await prisma.classSubjects.createMany({
    data: [
      {
        classId,
        subjectId: 'cmkacecj30000k2nwfxffc1e7',
      },
      {
        classId,
        subjectId: 'cmjw9l3j700006xnw3sj935xa',
      },
    ],
  });
  console.log('subjects', classSubjects);
}

/*

update({
    where: {
      classId: 'cmjwzm3tv0000wenw7j4qau6g',
    },
    data: {
      subject: {
        create: {
          name: 'Mathématique',
          teacherId: 'cmjyma1zs00055vnwa1tjzuq0',
          schoolId: 'cmjrl907d0000y2mv43herxek',
        },
      },
    },
  });
prisma.classSubjects.create({
    data: {
      subject: {
        create: {
          schoolId: 'cmjrl907d0000y2mv43herxek',
          name: 'Physique',
        },
      },
    },
  });
} */
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
