import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { Resolvers } from '../types.generated';
import { checkRole } from '../../lib/verify-role';

export const getClassesSubjectsResolver: Resolvers = {
  Query: {
    getClassAndSubjects: async (_: any, { filter }, { user, schoolId }) => {
      const searchTerm = filter?.searchTerm;

      if (searchTerm && searchTerm.length < 2) {
        throw createServiceError(
          'Le terme de la recherche doit contenir au moins 2 caractères',
          400,
        );
      }

      try {
        const whereClause: any = {
          schoolId,
        };

        if (searchTerm && searchTerm.length > 0) {
          whereClause.OR = [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { level: { contains: searchTerm, mode: 'insensitive' } },
            { section: { contains: searchTerm, mode: 'insensitive' } },
          ];
        }

        const classes = await prisma.class.findMany({
          where: whereClause,
          take: 10,
          orderBy: { name: 'desc' },
        });

        if (!classes.length) {
          return [];
        }

        return classes;
      } catch (e) {
        throw createServiceError(
          'Erreur lors de la recherche des classes',
          500,
          e,
        );
      }
    },
    getClassSubjects: async (
      _,
      { classId, teacherId, groupId },
      { user, schoolId },
    ) => {
      const ids = [classId, teacherId, groupId];

      if (
        ids.filter((id) => id !== undefined && (id !== null || '')).length > 1
      )
        throw createServiceError('Viellez specifier un seule identifiant');
      const checked = await checkRole({
        context: { userId: user?.id, schoolId },
        roles: ['TEACHER', 'ADMIN', 'PARENT'],
      });

      if (!checked.success) {
        throw createServiceError(
          checked?.message || 'permission non accordé',
          403,
        );
      }
      return await prisma.classSubjects.findMany({
        where: {
          group: {
            id: groupId ?? undefined,
            classes: {
              some: {
                id: classId ?? undefined,
              },
            },
          },
          teacherId,
        },
      });
    },
  },
  ClassSubject: {
    teacher: async (parent, _, { loaders }) => {
      if (!parent.teacherId) return null;
      return await loaders.teacherLoader.load(parent.teacherId);
    },
    weeklyHours: async (parent) => {
      const lessons = await prisma.lesson.findMany({
        where: {
          classSubjectId: parent.id,
        },
      });

      let totalMinutes = 0;
      lessons.forEach((l) => {
        const diffMs = l.endTime.getTime() - l.startTime.getTime();
        totalMinutes += diffMs / (1000 * 60);
      });

      return parseFloat((totalMinutes / 60).toFixed(1));
    },
    subject: async (parent, _, { loaders }) => {
      if (!parent.subjectId) return null;
      return await loaders.subjectLoader.load(parent.subjectId);
    },
    group: async (parent) => {
      return await prisma.group.findUnique({
        where: {
          id: parent.groupId,
        },
      });
    },
    lessons: async (parent, _, { loaders }) => {
      return await loaders.lessonsByClassSubjectLoader.load(parent.id);
    },
  },
};
