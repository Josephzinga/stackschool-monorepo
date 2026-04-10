import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../../utils/api-errors';

export const parentQueryResolver: Resolvers = {
  Query: {
    getSchoolParents: async (_, { filter }, { schoolId, user }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError(
          "Identifiant de l'établissement est manquant",
          400,
        );
      const parent = await prisma.parent.findMany({
        where: {
          schoolUser: {
            schoolId,
          },
        },
      });
      console.log('parent', parent);
      return parent;
    },
  },
};
