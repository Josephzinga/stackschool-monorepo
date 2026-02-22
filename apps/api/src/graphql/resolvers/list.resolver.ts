import { prisma } from '@stackschool/db';
import { Resolvers } from '../types.generated';
import { createServiceError } from '../../utils/api-errors';

export const listResolver: Resolvers = {
  Query: {
    getSchoolStudents: async (
      _,
      { schoolId, page = 1, limit = 10, searchTerm, classId },
      context,
    ) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const skip = (page - 1) * limit;
      const search = searchTerm?.trim();

      const whereClause: any = {
        schoolId,
        ...(classId && { classId }),
      };

      if (search) {
        whereClause.OR = [
          { matricule: { contains: search, mode: 'insensitive' } },
          {
            profile: {
              OR: [
                { firstname: { contains: search, mode: 'insensitive' } },
                { lastname: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        ];
      }

      const [total, students] = await Promise.all([
        prisma.student.count({ where: whereClause }),
        prisma.student.findMany({
          where: whereClause,
          take: limit,
          skip,
          include: {
            profile: true,
            schoolClass: true,
          },
          orderBy: { matricule: 'asc' },
        }),
      ]);

      return {
        data: students.map((s) => ({
          ...s,
          firstname: s.profile.firstname || '',
          lastname: s.profile.lastname || '',
          photo: s.profile.photo,
          className: s.schoolClass?.name,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },

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
