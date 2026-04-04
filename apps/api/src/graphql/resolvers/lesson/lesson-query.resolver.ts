import { Resolvers } from '../../types.generated';
import { prisma, Prisma } from '@stackschool/db';
import { createServiceError } from '../../../utils/api-errors';

export const lessonQueryResolver: Resolvers = {
  Query: {
    getLessons: async (parent, { filter }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const {
        mode,
        teacherId,
        groupId,
        hasLessonOnly,
        page = 0,
        limit = 6,
      } = filter;
      const skip = page * limit;

      let resources: any[] = [];
      let totalCount = 0;

      if (mode === 'TEACHER') {
        // 1. Construire les conditions pour les matières (relation)
        const classSubjectConditions: Prisma.ClassSubjectsWhereInput[] = [];
        if (hasLessonOnly)
          classSubjectConditions.push({ lessons: { some: {} } });
        if (groupId) classSubjectConditions.push({ groupId });

        // 2. Construire le WHERE principal
        const where: Prisma.TeacherWhereInput = {
          schoolUser: { schoolId },
          ...(teacherId && { id: teacherId }),
          ...(classSubjectConditions.length > 0 && {
            classSubjects: {
              every: {
                AND: classSubjectConditions,
              },
            },
          }),
        };

        // 3. Exécuter avec le même WHERE pour le count
        const [t, count] = await Promise.all([
          prisma.teacher.findMany({
            where,
            distinct: ['id'],
            take: limit,
            skip,
          }),
          prisma.teacher.count({ where }),
        ]);
        resources = t;
        totalCount = count;
      } else if (mode === 'CLASS') {
        const classSubjectConditions: Prisma.ClassSubjectsWhereInput[] = [];
        if (hasLessonOnly)
          classSubjectConditions.push({ groupId: {}, lessons: { some: {} } });
        classSubjectConditions.push({ id: { not: undefined } });
        if (teacherId) classSubjectConditions.push({ teacherId });

        const where: Prisma.GroupWhereInput = {
          schoolId,
          ...(groupId && { id: groupId }),
          ...(classSubjectConditions.length > 0 && {
            classSubjects: {
              some: {
                AND: classSubjectConditions,
              },
            },
          }),
        };

        const [g, count] = await Promise.all([
          prisma.group.findMany({
            where,
            take: limit,
            distinct: ['id'],
            skip,
          }),
          prisma.group.count({ where }),
        ]);
        resources = g;
        totalCount = count;
      }

      return {
        data: {
          teachers: mode === 'TEACHER' ? resources : null,
          groups: mode === 'CLASS' ? resources : null,
        },
        meta: {
          total: totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
          limit,
        },
      };
    },
    getClassTeacher: async (_, __, { schoolId, user }) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      return {
        schoolId,
      };
    },
  },
};
