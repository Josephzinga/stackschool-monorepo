import { PrismaService } from '../prisma.service';

const prisma = new PrismaService();
// ID de l'école cible
const TARGET_SCHOOL_ID = '3769a14d-9367-4148-b1b5-a1d093bf4939';

async function main() {
  // 1. Vérification / Création de l'école
  const schoolId = TARGET_SCHOOL_ID;

  const subjectIds = [];
  const userIds = [''];

  // 4. Création des Professeurs
  const teachers: any[] = [];
  for (const userId of userIds) {
    const schoolUser = await prisma.schoolUser.create({
      data: { userId, schoolId, role: 'TEACHER' },
    });

    const teacher = await prisma.teacher.create({
      data: {
        schoolUserId: schoolUser.id,
        isActive: true,
      },
    });

    teachers.push({
      ...teacher,
      subjectId: subjectIds[Math.floor(Math.random() * subjectIds.length)],
    });
  }
  console.log(`👨‍🏫 ${teachers.length} professeurs créés.`);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
