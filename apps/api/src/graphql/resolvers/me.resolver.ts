import { Context } from '@stackschool/shared';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { Resolvers } from '../types.generated';

export const meResolver: Resolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user || !context.user.id) {
        throw createServiceError('Non authentifié', 401);
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id: context.user.id },
        });

        if (!user) {
          throw createServiceError('Utilisateur introuvable', 404);
        }

        return user;
      } catch (error) {
        throw createServiceError(
          "Erreur lors de la récupération de l'utilisateur.",
          500,
          error,
        );
      }
    },
  },
  User: {
    schoolContext: async (parent: any, args, { prisma }) => {
      const { schoolId } = args;
      const userId = parent.id;
      const membership = await prisma.schoolUser.findUnique({
        where: {
          schoolId_userId: { schoolId, userId },
        },
      });

      if (!membership) {
        throw createServiceError("Vous n'êtes pas membre de cette école.", 403);
      }

      return {
        id: membership.id,
        role: membership.role,
      };
    },
    profile: async (parent, _args, { prisma }) => {
      return prisma.profile.findUnique({
        where: {
          userId: parent.id,
        },
      });
    },

    memberships: async (parent, _args, { prisma, loaders }) => {
      return prisma.schoolUser.findMany({
        where: {
          userId: parent.id,
        },
      });
    },
  },
};
