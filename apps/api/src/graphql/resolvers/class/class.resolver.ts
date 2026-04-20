import { prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';
import { getWeeklyHours } from '../../../utils/lesson-get-hours';

export const classResolver: Resolvers = {
  Class: {
    students: async (parent, _args, { loaders }) => {
      return loaders.studentsByClassLoader.load(parent.id);
    },
    _count: async (parent, _args, { loaders }) => {
      const counts = await loaders.classCountLoader.load(parent.id);
      return {
        students: counts.students,
        subjects: counts.subjects,
        teachers: counts.teachers,
      };
    },
    supervisor: async (parent, _args, { loaders }) => {
      return (await loaders.supervisorByClassLoader.load(parent.id)) || null;
    },

    group: async (parent, _args, { loaders }) => {
      return (await loaders.groupLoader.load(parent.groupId)) || null;
    },

    teachingTeamMembers: async (parent) => {
      const assignments = await prisma.teacherAssignment.findMany({
        where: {
          classSubject: {
            groupId: parent.groupId,
          },
        },
        include: {
          teacher: {
            select: {
              id: true,
              schoolUserId: true,
            },
          },
          classSubject: {
            include: { subject: true },
          },
        },
      });

      const teamMap = new Map<string, any>();

      assignments.forEach((asm) => {
        const teacherId = asm.teacherId;

        if (!teamMap.has(teacherId)) {
          teamMap.set(teacherId, {
            teacher: asm.teacher,
            assignments: [],
          });
        }
        teamMap.get(teacherId).assignments.push({
          subject: asm.classSubject.subject,
          id: asm.id,
        });
      });

      return Array.from(teamMap.values());
    },

    totalCoefficient: async (parent, _args, { prisma }) => {
      const total = await prisma.classSubjects.aggregate({
        where: {
          groupId: parent.groupId,
        },
        _sum: {
          coefficient: true,
        },
      });

      return total._sum.coefficient || 0;
    },

    totalWeeklyHours: async (parent, _args, { loaders }) => {
      const lessons = await loaders.lessonsByGroupLoader.load(parent.groupId);
      return getWeeklyHours(lessons);
    },
  },
};
