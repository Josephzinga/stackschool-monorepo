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
    parents: async (parent, _, { schoolId }) => {
      const parentStudent = await prisma.parentStudent.findMany({
        where: {
          studentId: parent.id,
        },
        include: {
          parent: true,
        },
      });

      return parentStudent.map((ps) => ({
        ...ps,
        ...ps.parent,
      }));
    },
  },

  Parent: {
    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return await loaders.userLoader.load(parent.schoolUserId);
    },
  },
};
