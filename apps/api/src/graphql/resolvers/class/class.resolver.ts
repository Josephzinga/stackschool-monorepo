import { prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';

export const classResolver: Resolvers = {
  Class: {
    students: async (parent, _args) => {
      return await prisma.student.findMany({
        where: { classId: parent.id },
        include: {
          schoolUser: true,
        },
      });
    },

    _count: async (parent) => {
      const student = await prisma.profile.groupBy({
        by: ['gender'],
        where: {
          student: {
            classId: parent.id,
          },
        },
        _count: {
          id: true,
        },
      });
      const subjects = await prisma.subject.count({
        where: {
          classSubjects: {
            some: {
              group: {
                classes: {
                  some: {
                    id: parent.id,
                  },
                },
              },
            },
          },
        },
      });
      const teachers = await prisma.teacher.count({
        where: {
          classSubjects: {
            some: {
              group: {
                classes: {
                  some: {
                    id: parent.id,
                  },
                },
              },
            },
          },
        },
      });
      return {
        students: {
          male: student.find((s) => s.gender === 'MALE')?._count.id || 0,
          female: student.find((s) => s.gender === 'FEMALE')?._count.id || 0,
        },
        subjects,
        teachers,
      };
    },
    supervisor: async (parent) => {
      const supervisor = await prisma.teacher.findFirst({
        where: {
          supervisedClasses: {
            some: {
              id: parent.id,
            },
          },
        },
      });
      return {
        ...supervisor,
        id: supervisor?.id!,
      };
    },
    lessons: async (parent) => {
      return await prisma.lesson.findMany({
        where: {
          classSubject: {
            group: {
              classes: {
                some: {
                  id: parent.id,
                },
              },
            },
          },
        },
      });
    },
    group: async (parent) => {
      const group = await prisma.group.findUnique({
        where: {
          id: parent.groupId,
        },
      });

      return group;
    },
  },
};
