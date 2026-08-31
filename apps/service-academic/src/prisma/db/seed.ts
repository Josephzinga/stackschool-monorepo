import { PrismaService } from '../prisma.service';
import { Class, ClassSubjects, Group, Subject } from './generated/client';

const prisma = new PrismaService();
const schoolId = 'd4ce7ab1-6d85-49b7-a763-a86504e72f66';

async function main() {
  // 3. Création des matières
  await prisma.subject.deleteMany({ where: { schoolId } });
  await prisma.class.deleteMany({ where: { schoolId } });
  await prisma.group.deleteMany({ where: { schoolId } });
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

  // 5. Création des Classes
  const classesList = [
    { name: '10ème B', level: '10eme', section: 'Science' },
    { name: '9ème Sciences', level: '11eme', section: 'Commercial' },
    { name: 'Terminale Sciences', level: 'Tle', section: 'Science' },
    { name: '11ème A', level: '11eme', section: 'Sciences' },
    { name: 'Terminale Lettres', level: 'Tle', section: 'Lettres' },
    { name: 'Terminal Commercial', level: 'Tle', section: 'Commercial' },
  ];
  let classes: Array<
    Class & { group: Group & { classSubjects: ClassSubjects[] } }
  > = [];

  for (const classe of classesList) {
    const clas = await prisma.class.create({
      data: {
        name: classe.name,
        level: classe.level,
        section: classe.section,
        schoolId,
        group: {
          create: {
            name: classe.name,
            type: 'SOLO',
            schoolId,
          },
        },
      },
      include: {
        group: {
          include: {
            classSubjects: true,
          },
        },
      },
    });
    classes.push(clas);
  }
  let classSubjects = [] as ClassSubjects[];
  for (const classe of classes) {
    for (const subject of subjects) {
      const classSubject = await prisma.classSubjects.create({
        data: {
          groupId: classe.groupId,
          subjectId: subject.id,
          schoolId,
        },
      });
      classSubjects.push(classSubject);
    }
  }

  console.log(`🎓 ${classes} classes créées.`);
  console.log(`${classSubjects}`);

  console.log(
    subjects.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
    })),
  );
}

main();
