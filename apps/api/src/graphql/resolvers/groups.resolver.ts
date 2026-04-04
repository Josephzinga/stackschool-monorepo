import { Resolvers } from '../types.generated';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { isAdmin } from '../../lib/verify-role';

export const groupResolver: Resolvers = {
  Mutation: {
    createGroup: async (
      _,
      { input: { name, classIds } },
      { user, schoolId },
    ) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant');

      const adminCheck = await isAdmin({
        context: { schoolId, userId: user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }
      const group = await prisma.group.create({
        data: {
          name,
          schoolId,
          classes: {
            connect: classIds.map((cls) => ({
              id: cls,
            })),
          },
        },
      });
      return group;
    },
  },
  Group: {
    classSubjects: async (parent) => {
      console.log('Group.classSubjects', parent.id);
      const classSubjects = await prisma.classSubjects.findMany({
        where: {
          group: {
            id: parent.id,
          },
        },
      });
      return classSubjects;
    },
    classes: async (parent) => {
      console.log('Group.classes', parent);
      const classes = await prisma.class.findMany({
        where: {
          groupId: parent.id,
        },
      });
      console.log('Group.classes Classes \n', classes);
      return classes;
    },
  },
};
