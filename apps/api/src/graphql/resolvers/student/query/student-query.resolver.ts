import { Prisma } from '@stackschool/db';
import { Resolvers } from '../../../types.generated';
import { createServiceError } from '../../../../utils/api-errors';
import {
  checkRole,
  checkSchoolId,
  checkUser,
} from '../../../../lib/verify-role';

export const studentQueryResolver: Resolvers = {
  Query: {
    getSchoolStudents: async (_, { input }, { user, schoolId, prisma }) => {
      checkUser(user);
      checkSchoolId(schoolId);
      const {
        page = 0,
        limit = 10,
        searchTerm,
        classId,
        level,
        sort,
        section,
        teacherId,
      } = input;
      const roleChecked = await checkRole({
        context: { schoolId, userId: user.id },
        roles: ['ADMIN', 'TEACHER'],
      });
      if (!roleChecked.success) {
        throw createServiceError(roleChecked.message!, 403);
      }
      const skip = page * limit;
      const search = searchTerm?.trim();

      let whereClause: Prisma.StudentWhereInput = {
        schoolId,
        deletedAt: null,
      };

      if (teacherId) {
        whereClause.schoolClass = {
          group: {
            classSubjects: {
              some: {
                assignments: {
                  teacherId,
                },
              },
            },
          },
        };
      }

      if (level || section) {
        whereClause.schoolClass = {
          ...(level && { level }),
          ...(section !== undefined && { section }),
        };
      }
      if (classId) {
        whereClause = {
          ...whereClause,
          ...(classId && { classId }),
        };
      }

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

      let orderBy: Prisma.StudentOrderByWithRelationInput = {
        profile: {
          firstname: 'asc',
        },
      };
      if (sort) {
        if (sort?.field === 'lastname' || sort?.field === 'firstname') {
          orderBy.profile = {
            [sort.field as string]: sort.order?.toLowerCase(),
          };
        }
        if (sort?.field === 'enrolementYear') {
          orderBy = {
            ...orderBy,
            enrollmentYear: sort.order?.toLocaleLowerCase() as Prisma.SortOrder,
          };
        }
      }

      const [total, students] = await Promise.all([
        prisma.student.count({ where: whereClause }),
        prisma.student.findMany({
          where: whereClause,
          take: limit,
          skip,
          orderBy,
        }),
      ]);
      return {
        data: students?.map((s) => ({
          ...s,
          status: s.status,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },
    searchStudent: async (_: any, { filter }, { user, prisma }) => {
      const schoolId = filter.schoolId;
      const searchTerm = filter.searchTerm?.trim() || '';
      const limit = filter.limit ?? undefined;
      checkSchoolId(schoolId);

      const students = await prisma.student.findMany({
        where: {
          schoolId,
          OR: [
            {
              profile: {
                firstname: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            {
              profile: {
                lastname: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            { matricule: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
      });
      return students;
    },
    student: async (_, { id }, { user, schoolId, prisma }) => {
      checkUser(user);
      checkSchoolId(schoolId);

      try {
        const checkedRole = await checkRole({
          context: { schoolId, userId: user.id },
          roles: ['TEACHER', 'ADMIN', 'PARENT'],
        });

        if (!checkedRole.success) {
          throw createServiceError(checkedRole.message || 'Accès refusé', 403);
        }
        return await prisma.student.findUnique({
          where: { id, schoolId },
        });
      } catch (err: any) {
        throw createServiceError(
          err?.message || 'Erreur lors de la récupération des données',
          500,
        );
      }
    },
  },
};
