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
      return await loaders.userLoader.load(parent.schoolUserId);
    },
    assignments: async (parent, _, { loaders }) => {
      return (await loaders.assignmentsByTeacherLoader.load(parent.id)) || [];
    },
  },
};
