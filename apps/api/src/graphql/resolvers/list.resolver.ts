import { prisma } from '@stackschool/db';
import { Resolvers } from '../types.generated';
import { createServiceError } from '../../utils/api-errors';

export const listResolver: Resolvers = {
  Query: {
    getSchoolClasses: async (
      _,
      { schoolId, page = 1, limit = 10, search },
      context,
    ) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const skip = (page - 1) * limit;
      const searchTerm = search?.trim();

      const whereClause: any = { schoolId };

      if (searchTerm) {
        whereClause.name = { contains: searchTerm, mode: 'insensitive' };
      }

      const [total, classes] = await Promise.all([
        prisma.class.count({ where: whereClause }),
        prisma.class.findMany({
          where: whereClause,
          take: limit,
          skip,
          include: {
            _count: { select: { students: true } },
          },
          orderBy: { name: 'asc' },
        }),
      ]);

      return {
        data: classes.map((c) => ({
          ...c,
          _count: { students: c._count.students },
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },
  },

  Teacher: {},
};
