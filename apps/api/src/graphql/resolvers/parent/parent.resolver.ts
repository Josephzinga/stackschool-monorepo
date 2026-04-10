import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';

export const parentResolver: Resolvers = {
  Parent: {
    students: async (parent) => {
      const students = await prisma.student.findMany({
        where: {
          parentStudent: {
            some: {
              parentId: parent.id,
            },
          },
        },
      });
      return students;
    },
    user: async (parent) => {
      if (!parent?.schoolUserId) return null;
      const schoolUser = await prisma.schoolUser.findUnique({
        where: {
          id: parent.schoolUserId,
        },
        include: {
          user: true,
        },
      });

      return schoolUser?.user;
    },
  },
};
