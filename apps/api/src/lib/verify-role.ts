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
 * Utilise Redis pour mettre en cache l'objet SchoolUser complet.
 */
export const checkRole = async (
  args: CheckRoleArgs,
): Promise<{ success: boolean; message?: string; member?: any }> => {
  try {
    const { schoolUserId, context, roles } = args;

    if ((!context?.schoolId || !context?.userId) && !schoolUserId) {
      return { success: false, message: 'Contexte manquant' };
    }

    const cacheKey = context ? `membership:${context.schoolId}:${context.userId}` : null;
    let membership: any = null;

    // 1. Essayer de récupérer depuis Redis
    if (cacheKey) {
      const cachedMembership = await redisClient.get(cacheKey);
      if (cachedMembership) {
        membership = JSON.parse(cachedMembership);
      }
    }

    // 2. Si pas en cache, requête DB
    if (!membership) {
      membership = await prisma.schoolUser.findUnique({
        where: schoolUserId
          ? { id: schoolUserId }
          : {
              schoolId_userId: {
                schoolId: context!.schoolId,
                userId: context!.userId,
              },
            },
        include: {
          teacher: {
            select: { id: true } // Inclure l'ID du prof si c'est un enseignant
          }
        }
      });

      // 3. Mise en cache
      if (cacheKey && membership) {
        await redisClient.set(cacheKey, JSON.stringify(membership), {
          expiration: { type: 'EX', value: 600 },
        }); // Cache 10 min
      } else if (cacheKey && !membership) {
        await redisClient.set(cacheKey, JSON.stringify(null), {
          expiration: { type: 'EX', value: 60 }, // Cache négatif 1 min
        });
      }
    } else if (membership === null) { // Si le cache dit explicitement null
        return {
            success: false,
            message: "Accès refusé : vous n'êtes pas membre de cette école.",
        };
    }


    if (!membership) {
      return {
        success: false,
        message: "Accès refusé : vous n'êtes pas membre de cette école.",
      };
    }

    // Le propriétaire a tous les droits
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
    message: result.message
  };
};
