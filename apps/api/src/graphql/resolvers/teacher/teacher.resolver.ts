import { prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';

export const teacherResolver: Resolvers = {
  Teacher: {
    weeklyHours: async (parent) => {
      const lessons = await prisma.lesson.findMany({
        where: {
          classSubject: {
            teacherId: parent.id,
          },
        },
      });

      let totalMinutes = 0;
      lessons.forEach((l) => {
        const diffMs = l.endTime.getTime() - l.startTime.getTime();
        totalMinutes += diffMs / (1000 * 60);
      });

      return parseFloat((totalMinutes / 60).toFixed(1));
    },

    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return await loaders.userLoader.load(parent.schoolUserId);
    },
    classSubjects: async (parent, _, { loaders }) => {
      return await prisma.classSubjects.findMany({
        where: {
          teacherId: parent.id,
        },
      });
    },
    lessons: async (parent) => {
      return await prisma.lesson.findMany({
        where: {
          classSubject: {
            teacherId: parent.id,
          },
        },
      });
    },
  },
};
