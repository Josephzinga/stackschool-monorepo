import { createServiceError } from '../../../../utils/api-errors';
import { isAdmin } from '../../../../lib/verify-role';
import { Resolvers } from '../../../types.generated';

export const deleteStudentMutationResolver: Resolvers = {
  Mutation: {
    deleteStudents: async (
      _,
      { studentIds, schoolId, soft = true },
      { prisma, user },
    ) => {
      try {
        if (!user) throw createServiceError('Non authentifié', 401);

        const adminCheck = await isAdmin({
          context: { schoolId, userId: user.id },
        });

        if (!adminCheck?.success) {
          throw createServiceError(adminCheck.message!, 403);
        }

        const exist = await prisma.student.findMany({
          where: {
            id: { in: studentIds as string[] },
            schoolId,
          },
          select: {
            id: true,
            schoolUserId: true,
          },
        });

        if (!exist || exist.length === 0) {
          throw createServiceError('Aucun élève trouvé', 404);
        }

        if (soft) {
          // Soft Delete : On met à jour le statut et deletedAt
          await prisma.student.updateMany({
            where: {
              id: { in: studentIds as string[] },
              schoolId,
            },
            data: {
              status: 'INACTIVE',
              deletedAt: new Date(),
            },
          });

          // On désactive aussi le User associé pour empêcher la connexion
          const schoolUserIds = exist.map((s) => s.schoolUserId);
          await prisma.user.updateMany({
            where: { memberships: { some: { id: { in: schoolUserIds } } } },
            data: { isActive: false },
          });

          return {
            ok: true,
            message: `${studentIds.length} élève(s) archivé(s)`,
          };
        } else {
          // Hard Delete
          const schoolUserIds = exist.map((s) => s.schoolUserId);

          await prisma.schoolUser.deleteMany({
            where: {
              id: { in: schoolUserIds },
            },
          });

          return {
            ok: true,
            message: `${studentIds.length} élève(s) supprimé(s) définitivement`,
          };
        }
      } catch (e) {
        const message = 'Erreur lors de la suppression.';
        throw createServiceError(message, 500, e);
      }
    },
  },
};
