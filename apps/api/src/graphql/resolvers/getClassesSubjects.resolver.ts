import { Context } from '@stackschool/shared';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';

export const getClassesSubjectsResolver = {
  getClassSubjects: async (
    {
      filter,
    }: {
      filter: {
        schoolId: string;
        searchTerm: string | null;
        getOnly?: boolean;
      };
    },
    context: Context,
  ) => {
    const { schoolId, searchTerm, getOnly } = filter;

    // Validation : Si getOnly est faux (ou undefined), on exige un searchTerm valide
    if (!getOnly && (!searchTerm || searchTerm.length < 2)) {
      throw createServiceError(
        'Le terme de la recherche doit contenir au moins 2 caractères',
        400,
      );
    }

    try {
      // Construction dynamique de la clause WHERE
      const whereClause: any = {
        schoolId,
      };

      // Si on a un terme de recherche, on l'ajoute au filtre
      if (searchTerm && searchTerm.length > 0) {
        whereClause.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { level: { contains: searchTerm, mode: 'insensitive' } },
          { section: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }

      const classes = await prisma.class.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          level: true,
          section: true,
          classSubjects: {
            select: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
        take: 10,
        orderBy: { name: 'desc' },
      });

      if (!classes.length) {
        return [];
      }

      // Transformation des données pour aplatir la structure
      return classes.map((cls) => ({
        id: cls.id,
        name: cls.name,
        level: cls.level,
        section: cls.section,
        subjects: cls.classSubjects.map((cs) => cs.subject),
      }));
    } catch (e) {
      throw createServiceError(
        'Erreur lors de la recherche des classes',
        500,
        e,
      );
    }
  },
};
