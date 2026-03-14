import { LessonStatus, Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { prisma } from '@stackschool/db';
import { allowedTransitions } from '@stackschool/shared';

export const updateLessonStatusResolver: Resolvers = {
  Mutation: {
    updateClassLesson: async (
      _,
      { input: { targetStatus, lessonId, day, startTime, endTime, classId } },
      { schoolId, user },
    ) => {
      if (!user.id) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
          schoolId,
        },
      });
      if (!lesson) throw createServiceError('Aucune matière trouvé');

      const current = lesson.status;

      if (
        targetStatus &&
        !allowedTransitions[current]?.includes(targetStatus as never)
      ) {
        throw createServiceError(
          `Transition impossible: ${current} -> ${targetStatus}`,
        );
      }

      if (startTime || endTime) {
        const conflict = await prisma.lesson.findFirst({
          where: {
            classId,
            id: { not: lessonId },

            startTime: {
              lt: endTime,
            },

            endTime: {
              gt: startTime,
            },
          },
        });
        if (conflict) {
          throw createServiceError(
            'La classe a déjà un cours dans cette période',
          );
        }
      }

      const newLesson = await prisma.lesson.update({
        where: {
          id: lessonId,
          schoolId,
        },
        data: {
          status: targetStatus ? targetStatus : current,
          startTime: startTime ? startTime : lesson.startTime,
          endTime: endTime ? endTime : lesson.endTime,
          day: day ? day : lesson.day,
        },
      });
      return {
        ...newLesson,
        status: newLesson?.status as LessonStatus,
      };
    },
  },
};
