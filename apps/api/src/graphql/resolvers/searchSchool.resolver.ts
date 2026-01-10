import { Context } from '@stackschool/shared';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';

export const searchSchoolResolver = {
  searchSchool: async (
    { filter }: { filter: { searchTerm: string } },
    context: Context,
  ) => {
    const { searchTerm } = filter;
    if (!searchTerm || searchTerm.length < 2) {
      throw createServiceError(
        'Le terme de la recherche dois contenir au moins 2' + ' caractère',
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
      if (school) {
        return school;
      }

      return [];
    } catch (error) {
      //throw createServiceError('Erreur de recherche des écoles', 500, error);
      throw new Error('Erreur de recherche des écoles');
    }
  },
};
