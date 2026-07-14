import { PrismaService } from '../prisma.service';

const prisma = new PrismaService();
// ID de l'école cible
const TARGET_SCHOOL_ID = 'c08f1b51-35e5-4277-9d11-bead44ad3d88';

const START_HOUR = 8;
const END_HOUR = 17;
const DAYS: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const LESSON_DURATION = 50; // minutes
const BREAK_START = 12;
const BREAK_DURATION = 1;

async function main() {
  console.log('🌱 Début du seeding ciblé...');

  const schoolId = TARGET_SCHOOL_ID;
  const adminId = '68240f02-c006-4fc5-acb1-d2f3a7691520';
  const adminSchoolUserId = '6fdbc867-5e57-42ad-bb07-7d9eb68e43df';
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
