import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';

export const parentResolver: Resolvers = {
  Parent: {
    parentStudent: async (parent) =>
      prisma.parentStudent.findMany({
        where: {
          parentId: parent.id,
        },
      }),

    user: async (parent, _, { schoolId }) => {
      if (!parent.schoolUserId) return null;
      const user = await prisma.user.findFirst({
        where: {
          memberships: {
            some: {
              schoolId: schoolId ?? undefined,
              id: parent.schoolUserId,
            },
          },
        },
      });
      return user;
    },
  },

  ParentStudent: {
    student: async (parent) => {
      if (!parent.studentId) return null;
      return prisma.student.findUnique({
        where: {
          id: parent.studentId,
        },
      });
    },
    parent: async (parent) => {
      if (!parent.parentId) return null;

      return prisma.parent.findUnique({
        where: {
          id: parent.parentId,
        },
      });
    },
  },
};
