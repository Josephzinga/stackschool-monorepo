import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';

export const lessonsResolver: Resolvers = {
  ClassTeacher: {
    teacher: async (parent, _, { schoolId }) => {
      const teachers = await prisma.teacher.findMany({
        where: {
          schoolUser: {
            schoolId,
          },
        },
      });
      return teachers;
    },
    classes: async (parent, _, { schoolId }) => {
      return await prisma.class.findMany({
        where: {
          schoolId,
        },
      });
    },
    groups: async (parent, _, { schoolId }) => {
      return await prisma.group.findMany({
        where: {
          schoolId,
        },
      });
    },
  },
  Lesson: {
    classSubject: async (parent) => {
      const classSubject = await prisma.classSubjects.findFirst({
        where: {
          lessons: {
            some: {
              id: parent.id,
            },
          },
        },
      });
      return classSubject;
    },
  },
};
