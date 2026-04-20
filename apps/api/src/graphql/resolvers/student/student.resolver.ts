import { prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';

export const studentResolver: Resolvers = {
  Student: {
    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return await loaders.userLoader.load(parent.schoolUserId);
    },
    profile: async (parent) => {
      if (!parent?.profileId) return null;
      return await prisma.profile.findUnique({
        where: {
          id: parent.profileId,
        },
      });
    },
    schoolClass: async (parent) => {
      if (!parent?.classId) return null;
      return await prisma.class.findUnique({
        where: {
          id: parent.classId,
        },
      });
    },
  },

  Parent: {
    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return await loaders.userLoader.load(parent.schoolUserId);
    },
  },
};
