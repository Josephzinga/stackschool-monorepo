import { prisma } from '.';

async function main() {
  const schoolId = 'cmkfkbtoy00003pqhbh6nn8ch';

  const genderCounts = await prisma.profile.groupBy({
    by: ['gender'],
    where: {
      student: {
        some: { schoolId },
      },
    },
    _count: {
      id: true,
    },
  });
  console.log('genderCounts', genderCounts);

  const school = await prisma.schoolUser.findUnique({
    where: {
      schoolId_userId: { schoolId, userId: 'cmklzpdjj0001guqqd9qswetm' },
    },
  });
  await prisma.school.update({
    where: {
      id: schoolId,
    },
    data: {
      logo: 'cmjps92ra0000bwo2d7qckou3-1768167022297-11590600.jpeg',
    },
  });

  console.log('school', school);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
