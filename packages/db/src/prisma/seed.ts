import { prisma } from '.';
import {
  Day,
  Gender,
  PaymentStatus,
  PaymentType,
} from '../prisma/client/generated';
import {
  addMinutes,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  subDays,
} from 'date-fns';

// ID de l'école cible
const TARGET_SCHOOL_ID = 'cmpskwfd80000q6s80sh8uznl';

const START_HOUR = 8;
const END_HOUR = 17;
const DAYS: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const LESSON_DURATION = 50; // minutes
const BREAK_START = 12;
const BREAK_DURATION = 1;

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
  await prisma.attendance.deleteMany(); // Suppression des présences
  await prisma.payment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.classSubjects.deleteMany();
  await prisma.group.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.teacher.deleteMany();

  // 3. Création des matières
  const subjectsList = [
    { name: 'Mathématiques', code: 'MATH' },
    { name: 'Physique', code: 'PC' },
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
  const teachers: any[] = [];
  for (const sub of subjects) {
    const username = `prof.${sub?.code?.toLowerCase()}.${Date.now().toString().slice(-4)}`;
    const user = await prisma.user.create({
      data: {
        email: `${username}@stackschool.com`,
        username: username,
        password: 'password123',
        phoneNumber: `+243 85${Math.floor(100000 + Math.random() * 900000)}`,
        profileCompleted: true,
        hasMembership: true,
        profile: {
          create: {
            firstname: `${sub.name}prof`,
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
    { name: '10ème B', level: '10eme', section: 'Science' },
    { name: '9ème Sciences', level: '11eme', section: 'Commercial' },
    { name: 'Terminale Sciences', level: 'Tle', section: 'Science' },
    { name: '11ème A', level: '11eme', section: 'Sciences' },
    { name: 'Terminale Lettres', level: 'Tle', section: 'Lettres' },
    { name: 'Terminal Commercial', level: 'Tle', section: 'Commercial' },
  ];

  const classes = [];
  let assignments: any[] = [];
  let groupIndex = 1;
  for (const clsData of classesList) {
    const supervisor = teachers[Math.floor(Math.random() * teachers.length)];
    const group = await prisma.group.create({
      data: {
        schoolId,
        name: `Group-${groupIndex}`,
        classSubjects: {
          create: subjects.map((s) => ({
            schoolId,
            subjectId: s.id,
          })),
        },
      },
      include: {
        classSubjects: true,
      },
    });
    const cls = await prisma.class.create({
      data: {
        ...clsData,
        schoolId,
        supervisorId: supervisor.id,
        groupId: group?.id,
      },
      include: {
        group: {
          include: {
            classSubjects: true,
          },
        },
      },
    });

    groupIndex++;
    classes.push(cls);
  }

  let teacherIndex = 0;
  for (const classe of classes) {
    const randomClassSubject =
      classe.group.classSubjects[
        Math.floor(Math.random() * classe.group.classSubjects.length)
      ];
    const assignment = await prisma.teacherAssignment.create({
      data: {
        schoolId,
        teacherId: teachers[Math.floor(Math.random() * teachers.length)]?.id,
        classSubjectId: randomClassSubject.id,
      },
    });
    assignments.push(assignment);
    teacherIndex++;
  }
  console.log(`🎓 ${classes.length} classes créées.`);
  console.log(`${assignments?.length}  crée avec succés.`);
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

  // 7. Génération de l'Emploi du Temps (Passé et Futur)
  console.log("📅 Génération de l'emploi du temps...");
  let index = 0;
  // 7. Génération de l'Emploi du Temps
  console.log("📅 Génération de l'emploi du temps...");
  const lessonsCreated: any[] = [];

  for (const assignment of assignments) {
    for (const dayEnum of DAYS) {
      let currentHour = START_HOUR;
      let currentMinute = 0;

      while (currentHour < END_HOUR) {
        // Gestion pause (12h - 13h)
        if (currentHour === 12) {
          currentHour = 13;
          currentMinute = 0;
          continue;
        }

        const isDoubleLesson = Math.random() > 0.5;
        const startTime = setMinutes(
          setHours(new Date(), currentHour),
          currentMinute,
        );
        const endTime = addMinutes(startTime, isDoubleLesson ? 120 : 60);

        // 2. Choisir une matière au hasard parmis celles du GROUPE

        let lesson: any = {};
        // 3. Créer la leçon liée au ClassSubjectId

        lesson = await prisma.lesson.create({
          data: {
            title: `Cours de ...`, // Tu peux récupérer le nom de la matière via un find si besoin
            day: dayEnum,
            startTime,
            endTime,
            schoolId,
            // C'est ici que le lien se fait avec la nouvelle structure
            teacherAssignmentId: assignment?.id,
          },
        });

        currentHour = getHours(endTime);
        currentMinute = getMinutes(endTime);
        lessonsCreated.push(lesson);
      }
    }
  }
  console.log('✅ Emploi du temps généré !');

  // 8. Génération des Paiements
  console.log('💸 Génération des paiements...');
  for (const { student, user } of createdStudents) {
    await prisma.payment.create({
      data: {
        amount: 50000,
        netAmount: 49500,
        serviceFee: 500,
        status: PaymentStatus.SUCCESS,
        type: PaymentType.TUITION,
        description: 'Scolarité Trimestre 1',
        providerRef: `OM-${Math.floor(Math.random() * 1000000)}`,
        payerId: user.id,
        payerName: `${user.username}`,
        payerPhone: '+22300000000',
        schoolId,
        studentId: student.id,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 30)),
      },
    });

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

  // 9. Génération des Présences (Attendance)
  console.log('📝 Génération des présences...');

  for (const lesson of lessonsCreated) {
    // Récupérer les élèves de la classe concernée par la leçon
    const studentsInClass = createdStudents.filter(
      (s) => s.student.classId === lesson.classId,
    );

    for (const { student } of studentsInClass) {
      // Probabilités : 90% Présent, 5% Absent, 5% Retard
      const rand = Math.random();
      let status = 'PRESENT';

      if (rand > 0.95) status = 'ABSENT';
      else if (rand > 0.9) status = 'LATE';

      // On ne crée pas d'entrée pour "PRESENT" si on veut économiser de la place,
      // mais pour un seed complet, on crée tout.

      await prisma.attendance.create({
        data: {
          date: lesson.startTime, // La présence est liée à l'heure du cours
          status,
          studentId: student.id,
          schoolId,
        },
      });
    }
  }
  console.log('✅ Présences générées !');

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
