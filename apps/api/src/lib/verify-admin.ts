import { prisma } from './prisma';
import { createServiceError } from '../utils/api-errors';

type SchoolUserContext = {
  schoolId: string;
  userId: string;
};
type IsAdminArgs =
  | { schoolUserId: string; context?: never }
  | { schoolUserId?: never; context: SchoolUserContext };
export const isAdmin = async (
  args: IsAdminArgs,
): Promise<{ success: boolean; message?: string } | undefined> => {
  try {
    const { schoolUserId, context } = args;

    if (
      (!args.context?.schoolId || !args.context?.userId) &&
      !args.schoolUserId
    )
      return;

    const membership = await prisma.schoolUser.findUnique({
      where: schoolUserId
        ? { id: schoolUserId }
        : {
            schoolId_userId: {
              schoolId: context?.schoolId!,
              userId: context?.userId!,
            },
          },
    });

    if (membership && (membership.role === 'ADMIN' || membership.isOwner)) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      message: "Accès refusé : vous n'êtes pas administrateur de cette école.",
    };
  } catch (err) {
    createServiceError('Erreur de vérification admin', 500, err);
    return {
      success: false,
      message: 'Erreur interne du serveur.',
    };
  }
};
