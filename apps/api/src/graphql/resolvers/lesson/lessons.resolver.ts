import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';

export const lessonsResolver: Resolvers = {
  ClassTeacher: {
    teacher: async (parent) => {
      if (!parent.schoolId) return null;
      const teachers = await prisma.teacher.findMany({
        where: {
          schoolUser: {
            schoolId: parent.schoolId,
          },
        },
      });
      return teachers;
    },
    class: async (parent) => {
      if (!parent.schoolId) return null;
      return await prisma.class.findMany({
        where: {
          schoolId: parent.schoolId,
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
