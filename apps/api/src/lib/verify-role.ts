import { prisma } from './prisma';
import { SchoolRole } from '@stackschool/db';
import { redisClient } from './redis';

type SchoolUserContext = {
  schoolId: string;
  userId: string;
};

type CheckRoleArgs =
  | { schoolUserId: string; context?: never; roles: SchoolRole[] }
  | { schoolUserId?: never; context: SchoolUserContext; roles: SchoolRole[] };

/**
 * Vérifie si un utilisateur possède l'un des rôles requis dans une école.
 * Utilise Redis pour mettre en cache le rôle de l'utilisateur.
 */
export const checkRole = async (
  args: CheckRoleArgs,
): Promise<{ success: boolean; message?: string; member?: any }> => {
  try {
    const { schoolUserId, context, roles } = args;

    if ((!context?.schoolId || !context?.userId) && !schoolUserId) {
      return { success: false, message: 'Contexte manquant' };
    }

    let membershipRole: SchoolRole | 'OWNER' | null = null;
    let membership: any = null;

    // 1. Essayer de récupérer depuis Redis (seulement si on a le contexte schoolId/userId)
    // Si on a schoolUserId, c'est plus dur de cacher sans faire une requête d'abord, donc on skip le cache pour ce cas rare
    if (context) {
      const cacheKey = `role:${context.schoolId}:${context.userId}`;
      const cachedRole = await redisClient.get(cacheKey);

      if (cachedRole) {
        // Si "NONE", on sait qu'il n'est pas membre
        if (cachedRole === 'NONE') {
          return {
            success: false,
            message: "Accès refusé : vous n'êtes pas membre de cette école.",
          };
        }

        // Si on a un rôle en cache, on vérifie direct
        // Note: On ne retourne pas l'objet 'member' complet depuis le cache pour l'instant,
        // ce qui peut poser problème si l'appelant en a besoin.
        // Mais pour une simple vérif de droits, c'est suffisant.
        if (
          cachedRole === 'OWNER' ||
          roles.includes(cachedRole as SchoolRole)
        ) {
          return { success: true };
        } else {
          return {
            success: false,
            message: `Accès refusé : rôle requis ${roles.join(' ou ')}.`,
          };
        }
      }
    }

    // 2. Si pas en cache, requête DB
    membership = await prisma.schoolUser.findUnique({
      where: schoolUserId
        ? { id: schoolUserId }
        : {
            schoolId_userId: {
              schoolId: context!.schoolId,
              userId: context!.userId,
            },
          },
    });

    // 3. Mise en cache
    if (context) {
      const cacheKey = `role:${context.schoolId}:${context.userId}`;
      if (!membership) {
        await redisClient.set(cacheKey, 'NONE', {
          expiration: { type: 'EX', value: 600 },
        });
      } else {
        const roleToCache = membership.isOwner ? 'OWNER' : membership.role;
        await redisClient.set(cacheKey, roleToCache, {
          expiration: { type: 'EX', value: 600 },
        }); // Cache 10 min
      }
    }

    if (!membership) {
      return {
        success: false,
        message: "Accès refusé : vous n'êtes pas membre de cette école.",
      };
    }

    if (membership.isOwner) {
      return { success: true, member: membership };
    }

    if (roles.includes(membership.role)) {
      return { success: true, member: membership };
    }

    return {
      success: false,
      message: `Accès refusé : rôle requis ${roles.join(' ou ')}.`,
    };
  } catch (err) {
    console.error('Erreur checkRole:', err);
    return {
      success: false,
      message: 'Erreur interne du serveur lors de la vérification des droits.',
    };
  }
};

// Wrapper pour la rétrocompatibilité
type IsAdminArgs =
  | { schoolUserId: string; context?: never }
  | { schoolUserId?: never; context: SchoolUserContext };

export const isAdmin = async (
  args: IsAdminArgs,
): Promise<{ success: boolean; message?: string }> => {
  const result = await checkRole({
    ...args,
    roles: ['ADMIN'],
  });

  return {
    success: result.success,
    message: result.message,
  };
};
