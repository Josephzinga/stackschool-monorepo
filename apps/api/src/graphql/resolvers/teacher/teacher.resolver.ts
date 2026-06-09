import { Resolvers } from '../../types.generated';
import { getWeeklyHours } from '../../../utils/lesson-get-hours';

export const teacherResolver: Resolvers = {
  Teacher: {
    weeklyHours: async (parent, _args, { loaders }) => {
      const lessons = await loaders.lessonsByTeacherLoader.load(parent.id);

      return getWeeklyHours(lessons);
    },

    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return (await loaders.userLoader.load(parent.schoolUserId)) || null;
    },
    assignments: async (parent, _, { loaders }) => {
      return (await loaders.assignmentsByTeacherLoader.load(parent.id)) || [];
    },

    classesCount: async (parent, _args, { prisma }) => {
      const assignment = await prisma.class.findMany({
        where: {
          group: {
            classSubjects: {
              some: {
                assignments: {
                  teacherId: parent.id,
                },
              },
            },
          },
        },
      });
      console.log('Assignment', assignment);
      return 8;
    },
  },
};
