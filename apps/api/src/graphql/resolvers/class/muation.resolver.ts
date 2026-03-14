import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { prisma } from '@stackschool/db';
import { isAdmin } from '../../../lib/verify-role';

export const classResolver: Resolvers = {
  Mutation: {
    createClass: async (_, { data, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        // Vérifier unicité
        const existing = await prisma.class.findFirst({
          where: {
            name: { equals: data.name, mode: 'insensitive' },
            schoolId,
          },
        });

        if (existing) {
          throw createServiceError('Une classe avec ce nom existe déjà', 400);
        }

        await prisma.class.create({
          data: {
            name: data.name,
            level: data.level,
            section: data.section,
            schoolId,
            supervisorId: data.supervisorId || undefined,
          },
        });

        return { ok: true, message: 'Classe créée avec succès' };
      } catch (error) {
        console.error('Erreur création classe:', error);
        if ((error as any).statusCode) throw error;
        throw createServiceError('Erreur lors de la création', 500, error);
      }
    },

    updateClass: async (_, { classId, data, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        // Vérifier unicité (sauf si c'est la même classe)
        const existing = await prisma.class.findFirst({
          where: {
            name: { equals: data.name, mode: 'insensitive' },
            schoolId,
            id: { not: classId },
          },
        });

        if (existing) {
          throw createServiceError('Une classe avec ce nom existe déjà', 400);
        }

        await prisma.class.update({
          where: { id: classId },
          data: {
            name: data.name,
            level: data.level,
            section: data.section,
            supervisorId: data.supervisorId || null, // null pour retirer le superviseur
          },
        });

        return { ok: true, message: 'Classe mise à jour avec succès' };
      } catch (error) {
        console.error('Erreur update classe:', error);
        if ((error as any).statusCode) throw error;
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    },

    deleteClasses: async (_, { classIds, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        // Vérifier que les classes appartiennent à l'école
        const count = await prisma.class.count({
          where: {
            id: { in: classIds as string[] },
            schoolId,
          },
        });

        if (count !== classIds.length) {
          throw createServiceError(
            'Certaines classes sont introuvables ou ne vous appartiennent pas',
            404,
          );
        }

        await prisma.class.deleteMany({
          where: {
            id: { in: classIds as string[] },
          },
        });

        return { ok: true, message: `${count} classe(s) supprimée(s)` };
      } catch (error) {
        console.error('Erreur suppression classes:', error);
        throw createServiceError('Erreur lors de la suppression', 500, error);
      }
    },
  },
};
