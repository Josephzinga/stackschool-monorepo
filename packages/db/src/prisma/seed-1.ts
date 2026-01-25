import { prisma } from '.';
import {
  Day,
  Gender,
  PaymentStatus,
  PaymentType,
} from '../prisma/client/generated';
import {
  addDays,
  addHours,
  setHours,
  setMinutes,
  startOfWeek,
  subDays,
} from 'date-fns';

// ID de l'école cible
const TARGET_SCHOOL_ID = 'cmkfkbtoy00003pqhbh6nn8ch';

const START_HOUR = 8;
const END_HOUR = 16;
const DAYS: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

async function main() {
  console.log('🌱 Début du seeding ciblé...');

  let schoolId = TARGET_SCHOOL_ID;

  // 1. Vérification / Création de l'école
  const existingSchool = await prisma.school.findUnique({
    where: { id: schoolId },
  });
  if (!existingSchool) {
    console.log("⚠️ École cible introuvable, création d'une nouvelle école...");
    const newSchool = await prisma.school.create({
      data: {
        name: 'Lycée Moderne de Bamako (Seed)',
        address: 'Bamako, Mali',
        code: `LMB${Math.floor(Math.random() * 1000)}`,
        slug: `lycee-moderne-bamako-${Date.now()}`,
      },
    });
    schoolId = newSchool.id;
    console.log(`🏫 Nouvelle école créée : ${schoolId}`);
  } else {
    console.log(
      `🏫 Utilisation de l'école existante : ${existingSchool.name} (${schoolId})`,
    );
  }

  // 2. Nettoyage des données de CETTE école
  console.log('🧹 Nettoyage des données existantes...');
  await prisma.payment.deleteMany({ where: { schoolId } }); // Suppression des paiements
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany({ where: { schoolId } });
  await prisma.class.deleteMany({ where: { schoolId } });
  await prisma.subject.deleteMany({ where: { schoolId } });

  // 3. Création des matières
  const subjectsList = [
    { name: 'Mathématiques', code: 'MATH' },
    { name: 'Physique-Chimie', code: 'PC' },
    { name: 'SVT', code: 'SVT' },
    { name: 'Français', code: 'FR' },
    { name: 'Anglais', code: 'ANG' },
    { name: 'Histoire-Géo', code: 'HG' },
    { name: 'Philosophie', code: 'PHILO' },
    { name: 'EPS', code: 'EPS' },
  ];

  const subjects = [];
  for (const sub of subjectsList) {
    const s = await prisma.subject.create({
      data: { ...sub, schoolId },
    });
    subjects.push(s);
  }
  console.log(`📚 ${subjects.length} matières créées.`);

  // 4. Création des Professeurs
  const teachers = [];
  for (const sub of subjects) {
    const username = `prof.${sub.code.toLowerCase()}.${Date.now().toString().slice(-4)}`;
    const user = await prisma.user.create({
      data: {
        email: `${username}@stackschool.com`,
        username: username,
        password: 'password123',
        profileCompleted: true,
        hasMembership: true,
        profile: {
          create: {
            firstname: 'Professeur',
            lastname: sub.name,
            gender: Gender.MALE,
          },
        },
      },
    });

    const schoolUser = await prisma.schoolUser.create({
      data: { userId: user.id, schoolId, role: 'TEACHER' },
    });

    const teacher = await prisma.teacher.create({
      data: {
        schoolUserId: schoolUser.id,
        specialization: sub.name,
        isActive: true,
      },
    });

    teachers.push({ ...teacher, subjectId: sub.id });
  }
  console.log(`👨‍🏫 ${teachers.length} professeurs créés.`);

  // 5. Création des Classes
  const classesList = [
    { name: '8ème A', level: '10eme', section: 'Lettre' },
    { name: '11ème B', level: '11eme', section: 'Lettre' },
    { name: 'Terminale ', level: 'Tle', section: 'Science' },
  ];

  const classes = [];
  for (const clsData of classesList) {
    const supervisor = teachers[Math.floor(Math.random() * teachers.length)];

    const cls = await prisma.class.create({
      data: {
        ...clsData,
        schoolId,
        supervisorId: supervisor.id,
        classSubjects: {
          create: subjects.map((s) => ({
            subjectId: s.id,
            teacherId: teachers.find((t) => t.subjectId === s.id)?.id,
          })),
        },
        classTeacher: {
          create: teachers.map((t) => ({
            teacherId: t.id,
          })),
        },
      },
    });
    classes.push(cls);
  }
  console.log(`🎓 ${classes.length} classes créées.`);

  // 6. Création des Élèves
  const createdStudents = [];
  for (const cls of classes) {
    for (let i = 0; i < 5; i++) {
      const gender = i % 2 === 0 ? Gender.MALE : Gender.FEMALE;
      const fname = gender === 'MALE' ? `Eleve${i}` : `Eleve${i}`;
      const uniqueSuffix = Date.now().toString().slice(-6) + i;

      const user = await prisma.user.create({
        data: {
          email: `eleve.${cls.id.substring(0, 4)}.${uniqueSuffix}@stackschool.com`,
          username: `eleve.${uniqueSuffix}`,
          password: 'password123',
          profileCompleted: true,
          hasMembership: true,
          profile: {
            create: { firstname: fname, lastname: 'Test', gender },
          },
        },
        include: { profile: true },
      });

      const schoolUser = await prisma.schoolUser.create({
        data: { userId: user.id, schoolId, role: 'STUDENT' },
      });

      const student = await prisma.student.create({
        data: {
          schoolUserId: schoolUser.id,
          schoolId,
          profileId: user.profile!.id,
          matricule: `STU-${new Date().getFullYear()}-${uniqueSuffix}`,
          enrollmentYear: '2023-2024',
          birthDate: new Date('2005-01-01'),
          classId: cls.id,
        },
      });
      createdStudents.push({ student, user });
    }
  }
  console.log(`👨‍🎓 ${createdStudents.length} élèves créés.`);

  // 7. Génération de l'Emploi du Temps
  console.log("📅 Génération de l'emploi du temps...");
  const refDate = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });

  for (const cls of classes) {
    for (let dayIndex = 0; dayIndex < DAYS.length; dayIndex++) {
      const dayEnum = DAYS[dayIndex];
      let currentHour = START_HOUR;

      while (currentHour < END_HOUR) {
        if (currentHour === 12) {
          currentHour += 2;
          continue;
        }

        let duration = Math.random() > 0.5 ? 2 : 1;
        if (currentHour + duration > END_HOUR) duration = 1;
        if (currentHour < 12 && currentHour + duration > 12)
          duration = 12 - currentHour;

        const randomTeacher =
          teachers[Math.floor(Math.random() * teachers.length)];
        const subject = subjects.find((s) => s.id === randomTeacher.subjectId);

        if (!subject) continue;

        const dateBase = addDays(refDate, dayIndex);
        const startTime = setMinutes(setHours(dateBase, currentHour), 0);
        const endTime = addHours(startTime, duration);

        await prisma.lesson.create({
          data: {
            name: subject.name,
            day: dayEnum,
            startTime,
            endTime,
            classId: cls.id,
            subjectId: subject.id,
            teacherId: randomTeacher.id,
          },
        });

        currentHour += duration;
      }
    }
  }
  console.log('✅ Emploi du temps généré !');

  // 8. Génération des Paiements (Furtifs)
  console.log('💸 Génération des paiements...');

  for (const { student, user } of createdStudents) {
    // 1. Frais de scolarité (Payé)

    await prisma.payment.create({
      data: {
        amount: 50000,
        netAmount: 49500,
        serviceFee: 500,
        status: PaymentStatus.SUCCESS,
        type: PaymentType.TUITION,
        description: 'Scolarité Trimestre 1',
        providerRef: `OM-${Math.floor(Math.random() * 1000000)}`,
        payerId: user.id, // L'élève paie lui-même (ou son compte parent simulé)
        payerName: `${user.username}`,
        payerPhone: '+22300000000',
        schoolId,
        studentId: student.id,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 30)), // Payé il y a quelques jours
      },
    });

    // 2. Frais de cantine (En attente pour certains)
    if (Math.random() > 0.5) {
      await prisma.payment.create({
        data: {
          amount: 15000,
          netAmount: 14850,
          serviceFee: 150,
          status: PaymentStatus.PENDING,
          type: PaymentType.CANTEEN,
          description: 'Cantine Octobre',
          schoolId,
          studentId: student.id,
          payerName: 'Parent X',
          payerPhone: '+22311111111',
          createdAt: new Date(),
        },
      });
    }
  }
  console.log('✅ Paiements générés !');

  console.log('🚀 Seeding terminé avec succès.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
