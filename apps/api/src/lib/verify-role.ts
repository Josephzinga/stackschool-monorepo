import { prisma } from './prisma';
import { createServiceError } from '../utils/api-errors';
import { SchoolRole } from '@stackschool/db';

type SchoolUserContext = {
  schoolId: string;
  userId: string;
};

type CheckRoleArgs =
  | { schoolUserId: string; context?: never; roles: SchoolRole[] }
  | { schoolUserId?: never; context: SchoolUserContext; roles: SchoolRole[] };

/**
 * Vérifie si un utilisateur possède l'un des rôles requis dans une école.
 * Renvoie le membre trouvé si succès, ou une erreur.
 */
export const checkRole = async (
  args: CheckRoleArgs,
): Promise<{ success: boolean; message?: string; member?: any }> => {
  try {
    const { schoolUserId, context, roles } = args;

    if ((!context?.schoolId || !context?.userId) && !schoolUserId) {
      return { success: false, message: 'Contexte manquant' };
    }

    const membership = await prisma.schoolUser.findUnique({
      where: schoolUserId
        ? { id: schoolUserId }
        : {
            schoolId_userId: {
              schoolId: context!.schoolId,
              userId: context!.userId,
            },
          },
    });

    if (!membership) {
      return {
        success: false,
        message: "Accès refusé : vous n'êtes pas membre de cette école.",
      };
    }

    // Le propriétaire a tous les droits (souvent considéré comme SUPER ADMIN local)
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
