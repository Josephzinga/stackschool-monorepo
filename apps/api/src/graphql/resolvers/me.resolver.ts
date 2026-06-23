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
          include: {
            profile: true,
            memberships: {
              include: {
                school: {
                  select: {
                    id: true,
                    name: true,
                    logo: true,
                    slug: true,
                    address: true,
                  },
                },
                student: { select: { id: true } },
                teacher: { select: { id: true } },
                Parent: { select: { id: true } },
                Staff: { select: { id: true } },
              },
            },
          },
        });

        if (!user) {
          throw createServiceError('Utilisateur introuvable', 404);
        }

        return user as any;
      } catch (error) {
        console.error('Erreur getMe:', error);
        throw createServiceError(
          'Erreur lors de la récupération du profil',
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
    profile: async (parent, _args, { loaders }) => {
      return (await loaders.profileLoader.load(parent.id)) || null;
    },
  },
};
