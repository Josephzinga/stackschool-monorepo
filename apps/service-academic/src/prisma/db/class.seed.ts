import { PrismaService } from '../prisma.service';
import { Class, ClassSubjects, Group, Subject } from './generated/client';

const prisma = new PrismaService();
const schoolId = '3769a14d-9367-4148-b1b5-a1d093bf4939';
// 5. Création des Classes
const classesList = [
  { name: '10ème B', level: '10eme', section: 'Science' },
  { name: '9ème Sciences', level: '11eme', section: 'Commercial' },
  { name: 'Terminale Sciences', level: 'Tle', section: 'Science' },
  { name: '11ème A', level: '11eme', section: 'Sciences' },
  { name: 'Terminale Lettres', level: 'Tle', section: 'Lettres' },
  { name: 'Terminal Commercial', level: 'Tle', section: 'Commercial' },
];

async function main() {
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

  const subjects: Subject[] = [];
  for (const sub of subjectsList) {
    const s = await prisma.subject.create({
      data: { ...sub, schoolId },
    });
    subjects.push(s);
  }
  console.log(`📚 ${subjects.length} matières créées.`);

  const classes: Array<
    Class & { group: Group & { classSubjects: ClassSubjects[] } }
  > = [];

  const teacherIds = [];

  let assignments: any[] = [];
  let groupIndex = 1;
  for (const clsData of classesList) {
    const supervisorId =
      teacherIds[Math.floor(Math.random() * teacherIds.length)];
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
        supervisorId: supervisorId,
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
        teacherId: teacherIds[Math.floor(Math.random() * teacherIds.length)],
        classSubjectId: randomClassSubject.id,
      },
    });
    assignments.push(assignment);
    teacherIndex++;
  }
  console.log(`🎓 ${classes.length} classes créées.`);
  console.log(`${assignments?.length}  crée avec succés.`);
}

main();
