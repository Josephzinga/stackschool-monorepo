import { Prisma, prisma } from '@stackschool/db';
import { Resolvers, StudentStatus } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole, isAdmin } from '../../../lib/verify-role';

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
        whereClause.classSubjects = {
          some: {
            teacherId,
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
  Mutation: {
    createClassSubject: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      const classId = input?.classId;
      const subjectId = input?.subjectId;

      if (!classId || !subjectId) throw createServiceError('Donnée manquat');
      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked?.success) {
        throw createServiceError(
          checked?.message || 'Permission non accorder',
          403,
        );
      }

      const exist = await prisma.classSubjects.findUnique({
        where: {
          classId_subjectId: { classId, subjectId },
        },
      });

      if (exist) {
        throw createServiceError('La matière existe déjà dans cette classe.');
      }

      return await prisma.classSubjects.create({
        data: {
          classId,
          subjectId,
          teacherId: input?.teacherId,
          coefficient: input?.coefficient,
          weeklyHours: input?.weeklyHours,
        },
      });
    },
    updateClassSubject: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      const id = input?.id;
      if (!id)
        throw createServiceError("l'identifiant de la matière est requis");
      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked?.success) {
        throw createServiceError(
          checked?.message || 'Permission non accorder',
          403,
        );
      }
      const exist = await prisma.classSubjects.findUnique({
        where: {
          id,
        },
      });

      if (!exist) {
        throw createServiceError('Matière introuvable.');
      }
      return await prisma.classSubjects.update({
        where: {
          id,
        },
        data: {
          teacherId: input?.teacherId ?? undefined,
          classId: input?.classId ?? undefined,
          subjectId: input?.subjectId ?? undefined,
          coefficient: input?.coefficient,
          weeklyHours: input?.weeklyHours ?? undefined,
        },
      });
    },
    deleteClassSubjects: async (_, { ids }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked?.success) {
        throw createServiceError(
          checked?.message || 'Permission non accorder',
          403,
        );
      }

      const classSubjects = await prisma.classSubjects.deleteMany({
        where: {
          id: {
            in: [...ids],
          },
        },
      });

      return {
        ok: true,
        message: `${classSubjects?.count} supprimer avec succès.`,
      };
    },
  },
  Classe: {
    students: async (parent, _args, { user }) => {
      const students = await prisma.student.findMany({
        where: { classId: parent.id },
        include: {
          schoolUser: true,
        },
      });

      return students.map((s) => ({
        ...s,
        status: s.status as StudentStatus,
      }));
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
      const subjects = await prisma.classSubjects.count({
        where: {
          classId: parent.id,
        },
      });
      const teachers = await prisma.classSubjects.count({
        where: {
          classId: parent.id,
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
      const lessons = await prisma.lesson.findMany({
        where: {
          classSubject: {
            classId: parent.id,
          },
        },
      });

      return lessons;
    },
    classSubject: async (parent) => {
      return await prisma.classSubjects.findMany({
        where: {
          classId: parent.id,
        },
      });
    },
  },
};
