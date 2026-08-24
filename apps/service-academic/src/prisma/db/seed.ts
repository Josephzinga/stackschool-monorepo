import { PrismaService } from '../prisma.service';
import { Class, Group, Subject, ClassSubjects } from './generated/client';

const prisma = new PrismaService();
const schoolId = '3769a14d-9367-4148-b1b5-a1d093bf4939';

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

  // 5. Création des Classes
  const classesList = [
    { name: '10ème B', level: '10eme', section: 'Science' },
    { name: '9ème Sciences', level: '11eme', section: 'Commercial' },
    { name: 'Terminale Sciences', level: 'Tle', section: 'Science' },
    { name: '11ème A', level: '11eme', section: 'Sciences' },
    { name: 'Terminale Lettres', level: 'Tle', section: 'Lettres' },
    { name: 'Terminal Commercial', level: 'Tle', section: 'Commercial' },
  ];
  const classes: Array<
    Class & { group: Group & { classSubjects: ClassSubjects[] } }
  > = [];

  const teacherIds = [];

  console.log(`🎓 ${classes.length} classes créées.`);

  console.log(
    subjects.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
    })),
  );
}

main();
