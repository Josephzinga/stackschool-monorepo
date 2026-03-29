import { Prisma, prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole } from '../../../lib/verify-role';

export const classResolver: Resolvers = {
  Query: {
    getSchoolClasses: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

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
              teacherId,
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
          select: {
            id: true,
            name: true,
            level: true,
            section: true,
          },
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
      try {
        if (!user || !user.id) throw createServiceError('Non authentifié', 401);

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
        console.log('ClassData', classData);
        return classData!;
      } catch (e) {
        throw createServiceError('Erreur lors la recupération des classes.');
      }
    },
  },
  Class: {
    students: async (parent, _args) => {
      return await prisma.student.findMany({
        where: { classId: parent.id },
        include: {
          schoolUser: true,
        },
      });
    },

    _count: async (parent) => {
      const student = await prisma.profile.groupBy({
        by: ['gender'],
        where: {
          student: {
            classId: parent.id,
          },
        },
        _count: {
          id: true,
        },
      });
      const subjects = await prisma.subject.count({
        where: {
          classSubjects: {
            some: {
              group: {
                classes: {
                  some: {
                    id: parent.id,
                  },
                },
              },
            },
          },
        },
      });
      const teachers = await prisma.teacher.count({
        where: {
          classSubjects: {
            some: {
              group: {
                classes: {
                  some: {
                    id: parent.id,
                  },
                },
              },
            },
          },
        },
      });
      return {
        students: {
          male: student.find((s) => s.gender === 'MALE')?._count.id || 0,
          female: student.find((s) => s.gender === 'FEMALE')?._count.id || 0,
        },
        subjects,
        teachers,
      };
    },
    supervisor: async (parent) => {
      const supervisor = await prisma.teacher.findFirst({
        where: {
          supervisedClasses: {
            some: {
              id: parent.id,
            },
          },
        },
      });
      return {
        ...supervisor,
        id: supervisor?.id!,
      };
    },
    lessons: async (parent) => {
      return await prisma.lesson.findMany({
        where: {
          classSubject: {
            group: {
              classes: {
                some: {
                  id: parent.id,
                },
              },
            },
          },
        },
      });
    },
  },
};
