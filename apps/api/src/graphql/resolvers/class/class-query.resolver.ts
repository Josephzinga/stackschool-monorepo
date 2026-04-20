import { prisma, Prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole, checkSchoolId, checkUser } from '../../../lib/verify-role';

export const classQueryResolver: Resolvers = {
  Query: {
    getSchoolClasses: async (_, { input }, { user, schoolId }) => {
      checkUser(user);
      checkSchoolId(schoolId);
      const {
        searchTerm,
        section,
        page = 0,
        limit = 10,
        teacherId,
        level,
      } = input;

      const skip = page * limit;
      const search = searchTerm?.trim();

      let whereClause: Prisma.ClassWhereInput = { schoolId };

      if (teacherId) {
        whereClause.group = {
          classSubjects: {
            some: {
              assignments: {
                teacherId,
              },
            },
          },
        };
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { section: { contains: search, mode: 'insensitive' } },
          { level: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (level) {
        whereClause.level = {
          equals: level,
          mode: 'insensitive',
        };
      }

      if (section) {
        whereClause.section = {
          equals: section,
          mode: 'insensitive',
        };
      }

      const [total, classes] = await Promise.all([
        prisma.class.count({ where: whereClause }),
        prisma.class.findMany({
          where: whereClause,
          take: limit,
          skip,
          orderBy: { name: 'asc' },
        }),
      ]);

      return {
        data: classes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },

    class: async (_, { id }, { user, schoolId }) => {
      checkUser(user);
      checkSchoolId(schoolId);
      try {
        const checked = await checkRole({
          context: { userId: user.id, schoolId },
          roles: ['ADMIN', 'TEACHER'],
        });

        if (!checked.success) {
          throw createServiceError(
            checked.message || 'Permission non accordé.',
            403,
          );
        }

        const classData = await prisma.class.findUnique({
          where: { id, schoolId },
        });

        if (!classData || classData.schoolId !== schoolId) {
          throw createServiceError('Accès refusé ou classe introuvable', 400);
        }
        return classData!;
      } catch (e: any) {
        throw createServiceError(
          e?.message || 'Erreur lors la recupération des classes.',
        );
      }
    },
  },
};
