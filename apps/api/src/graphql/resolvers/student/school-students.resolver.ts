import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { prisma } from '@stackschool/db';
import { checkRole } from '../../../lib/verify-role';

export const schoolStudentsResolver: Resolvers = {
  Query: {
    getSchoolStudents: async (_, { input }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);
      if (!input) {
        throw createServiceError('Données manquantes', 400);
      }
      const {
        schoolId,
        page = 0,
        limit = 10,
        searchTerm,
        classId,
        level,
        sort,
        section,
      } = input;
      const roleChecked = await checkRole({
        context: { schoolId, userId: context.user.id },
        roles: ['ADMIN', 'TEACHER'],
      });
      if (!roleChecked.success) {
        throw createServiceError(roleChecked.message!, 403);
      }
      const skip = page * limit;
      const search = searchTerm?.trim();

      let whereClause: any = {
        schoolId,
      };

      if (level) {
        whereClause.schoolClass = {
          level,
        };
      }
      if (section) {
        whereClause.schoolClass = {
          ...whereClause.schoolClass,
          section,
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

      let orderBy: any = {
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
            enrollmentYear: sort.order?.toLowerCase(),
          };
        }
      }
      console.log('sort', sort);

      const [total, students] = await Promise.all([
        prisma.student.count({ where: whereClause }),
        prisma.student.findMany({
          where: whereClause,
          take: limit,
          skip,
          include: {
            schoolClass: {
              select: {
                id: true,
                level: true,
                name: true,
                section: true,
              },
            },
            schoolUser: {
              select: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    username: true,
                    phoneNumber: true,
                    profile: {
                      select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        photo: true,
                        gender: true,
                      },
                    },
                  },
                },
              },
            },
            parentStudent: true,
          },
          orderBy,
        }),
      ]);

      return {
        data: students?.map((s) => ({
          ...s,
          user: {
            profile: {
              id: s.schoolUser.user.profile?.id!,
              firstname: s.schoolUser.user.profile?.firstname ?? '',
              lastname: s.schoolUser.user.profile?.lastname ?? '',
              photo: s.schoolUser.user.profile?.photo ?? '',
              gender: s.schoolUser.user.profile?.gender!,
            },
            id: s.schoolUser.user.id,
            username: s.schoolUser.user.username ?? '',
            email: s.schoolUser.user.email ?? '',
            phoneNumber: s.schoolUser.user.phoneNumber ?? '',
          },
          parents: s.parentStudent,
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
};
