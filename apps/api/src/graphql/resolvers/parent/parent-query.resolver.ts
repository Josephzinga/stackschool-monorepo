import { Resolvers } from '../../types.generated';
import { prisma, Prisma } from '@stackschool/db';
import { createServiceError } from '../../../utils/api-errors';

export const parentQueryResolver: Resolvers = {
  Query: {
    getSchoolParents: async (
      _,
      { filter: { limit = 10, page = 0, searchTerm, studentId } },
      { schoolId, user },
    ) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError(
          "Identifiant de l'établissement est manquant",
          400,
        );
      const search = searchTerm?.trim();

      let whereClause: Prisma.ParentWhereInput = {
        schoolUser: {
          schoolId,
        },
      };

      if (searchTerm) {
        whereClause.schoolUser = {
          schoolId,
          user: {
            profile: {
              OR: [
                { firstname: { contains: search, mode: 'insensitive' } },
                { lastname: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        };
      }
      const [total, parent] = await Promise.all([
        await prisma.parent.count({ where: whereClause }),
        await prisma.parent.findMany({
          where: whereClause,
          take: limit,
          skip: limit * page,
        }),
      ]);

      return {
        data: parent,
        meta: {
          page: page,
          total,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      };
    },
  },
};
