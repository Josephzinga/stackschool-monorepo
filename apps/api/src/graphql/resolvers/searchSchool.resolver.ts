import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { Resolvers } from '../types.generated';

export const searchSchoolResolver: Resolvers = {
  Query: {
    searchSchool: async (_: any, { filter }, context) => {
      const { searchTerm } = filter;
      if (!searchTerm || searchTerm.length < 2) {
        throw createServiceError(
          'Le terme de la recherche doit contenir au moins 2 caractères',
          400,
        );
      }

      try {
        const school = await prisma.school.findMany({
          where: {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { address: { contains: searchTerm, mode: 'insensitive' } },
              { code: { contains: searchTerm, mode: 'insensitive' } },
            ],
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            address: true,
            slug: true,
            logo: true,
            code: true,
          },
          take: 10,
          orderBy: { name: 'desc' },
        });

        return school as any;
      } catch (error) {
        throw createServiceError('Erreur de recherche des écoles', 500, error);
      }
    },
  },
};
