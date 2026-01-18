import { Context } from '@stackschool/shared';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { UserResolvers } from '../types.generated';

export const meResolver = {
  me: async (_: any, context: Context): Promise<UserResolvers> => {
    // 1. Vérification de sécurité
    // Le middleware d'auth a déjà peuplé context.user, mais on vérifie quand même
    if (!context.user || !context.user.id) {
      throw createServiceError('Non authentifié', 401);
    }

    try {
      // 2. Récupération des données complètes

      const user = await prisma.user.findUnique({
        where: { id: context.user.id },
        include: {
          // Profil global (Nom, Photo...)
          profile: true,

          // Liste des adhésions aux écoles (Contextes)
          memberships: {
            include: {
              school: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  slug: true,
                },
              },
              // On récupère aussi les rôles spécifiques pour savoir "qui il est" dans cette école
              // Cela permet au frontend de savoir s'il est Prof, Parent, etc. dans l'école X
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

      return user;
    } catch (error) {
      console.error('Erreur getMe:', error);
      throw createServiceError(
        'Erreur lors de la récupération du profil',
        500,
        error,
      );
    }
  },
};
