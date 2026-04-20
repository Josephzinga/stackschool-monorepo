import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../../utils/api-errors';

export const lessonsResolver: Resolvers = {
  ClassTeacher: {
    teacher: async (parent, _, { schoolId }) => {
      if (!schoolId)
        throw createServiceError("Identifiant de l'établissement manquant");
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
      if (!schoolId)
        throw createServiceError("Identifiant de l'établissement manquant");
      return prisma.class.findMany({
        where: {
          schoolId,
        },
      });
    },
    groups: async (parent, _, { schoolId }) => {
      if (!schoolId)
        throw createServiceError("Identifiant de l'établissement manquant");
      return prisma.group.findMany({
        where: {
          schoolId,
        },
      });
    },
  },
  Lesson: {
    teacherAssignment: async (parent, _, { schoolId }) => {
      if (!schoolId)
        throw createServiceError("Identifiant de l'établissement manquant");
      return prisma.teacherAssignment.findFirst({
        where: {
          schoolId,
          lessons: {
            some: {
              id: parent.id,
            },
          },
        },
      });
    },
  },
};
