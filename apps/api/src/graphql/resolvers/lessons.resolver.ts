import { Resolvers } from '../types.generated';
import { createServiceError } from '../../utils/api-errors';
import { prisma, Prisma } from '@stackschool/db';

export const lessonsResolver: Resolvers = {
  Query: {
    getLessons: async (parent, { classId, teacherId }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      let whereClause: Prisma.LessonWhereInput = {
        schoolId,
      };
      if (classId) {
        whereClause.classId = classId;
      }
      if (teacherId) {
        whereClause.teacherId = teacherId;
      }
      const lessons = await prisma.lesson.findMany({
        where: whereClause,
      });
      return lessons;
    },
    getClassTeacher: async (_, __, { schoolId, user }) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      return {
        schoolId,
      };
    },
  },
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
    teacher: async (parent, _, { loaders }) => {
      if (!parent.teacherId) return null;
      return await loaders.teacherLoader.load(parent.teacherId);
    },
    subject: async (parent, _, { loaders }) => {
      if (!parent.subjectId) return null;
      return await loaders.subjectLoader.load(parent.subjectId);
    },
    class: async (parent) => {
      const classes = await prisma.class.findFirst({
        where: {
          lessons: {
            some: {
              id: parent.id,
            },
          },
        },
      });
      return classes;
    },
  },
};
