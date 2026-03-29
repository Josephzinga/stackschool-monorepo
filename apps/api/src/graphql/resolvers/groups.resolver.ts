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
    classes: async (parent, _, { loaders, schoolId }) => {
      return await prisma.class.findMany({
        where: {
          groupId: parent.id,
          schoolId,
        },
      });
    },
  },
};
