import { prisma } from './prisma';

export async function generatSuggestedMatricule(schoolId: string) {
  try {
    // compter les étudiants restant pour cette école
    const currentYear = new Date().getFullYear();
    const countStudent = await prisma.student.count({
      where: {
        schoolId,
        enrollmentYear: currentYear.toString(),
      },
    });

    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      select: { code: true },
    });

    const sequence = (currentYear + 1).toString().padStart(3, '0');
    return `${currentYear}-${school?.code || 'SCH'}-${sequence}`;
  } catch (e) {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${Date.now().toString().slice(-4)}`;
  }
}

export function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  // Au Mali, l'année académique va souvent de Octobre à Juin
  // On considère l'année en cours comme année académique
  return `${year}-${year + 1}`;
}
