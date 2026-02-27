import { Context } from '@stackschool/shared';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { Resolvers } from '../types.generated';

export const getClassesSubjectsResolver: Resolvers = {
  Query: {
    getClassSubjects: async (_: any, { filter }, context: Context) => {
      const { schoolId, searchTerm, getSubject } = filter;

      if (searchTerm && searchTerm.length < 2) {
        throw createServiceError(
          'Le terme de la recherche doit contenir au moins 2 caractères',
          400,
        );
      }

      try {
        const whereClause: any = {
          schoolId,
        };

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
            classSubjects: getSubject
              ? {
                  select: {
                    subject: {
                      select: {
                        id: true,
                        name: true,
                        code: true,
                      },
                    },
                  },
                }
              : false,
          },
          take: 10,
          orderBy: { name: 'desc' },
        });

        if (!classes.length) {
          return [];
        }

        return classes.map((cls) => ({
          id: cls.id,
          name: cls.name,
          level: cls.level,
          section: cls.section,
          subjects: getSubject
            ? cls?.classSubjects?.map((cs: any) => cs?.subject)
            : null,
        })) as any;
      } catch (e) {
        throw createServiceError(
          'Erreur lors de la recherche des classes',
          500,
          e,
        );
      }
    },
  },
};
