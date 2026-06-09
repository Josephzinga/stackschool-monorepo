import { Resolvers } from '../../types.generated';

export const studentResolver: Resolvers = {
  Student: {
    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return await loaders.userLoader.load(parent.schoolUserId);
    },
    profile: async (parent, _, { prisma }) => {
      if (!parent?.profileId) return null;

      return prisma.profile.findUnique({
        where: {
          id: parent.profileId,
        },
      });
    },
    schoolClass: async (parent, _, { loaders }) => {
      if (!parent?.classId) return null;
      return (await loaders.classLoader.load(parent.classId)) || null;
    },
    attendances: async (parent, { date }, { prisma }) => {
      if (!parent.schoolUserId) return null;
      const attendance = await prisma.attendance.findMany({
        where: {
          schoolUserId: parent.schoolUserId,
          date,
        },
      });
      return attendance;
    },
  },

  Parent: {
    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return await loaders.userLoader.load(parent.schoolUserId);
    },
  },
};
