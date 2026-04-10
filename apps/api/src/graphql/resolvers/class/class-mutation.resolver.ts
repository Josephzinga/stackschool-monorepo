import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { prisma } from '@stackschool/db';
import { isAdmin } from '../../../lib/verify-role';

export const classMutationResolver: Resolvers = {
  Mutation: {
    createClass: async (_, { data }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      try {
        const adminCheck = await isAdmin({
          context: { schoolId, userId: user.id },
        });

        if (!adminCheck?.success) {
          throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
        }

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

        const classe = await prisma.class.create({
          data: {
            name: data.name,
            level: data.level,
            section: data.section,
            schoolId,
            supervisorId: data.supervisorId || undefined,
          },
        });
        console.log('Classe', classe);
        return classe;
      } catch (error) {
        console.error('Erreur création classe:', error);
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

    createClassSubject: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      const classId = input?.classId;
      const subjectId = input?.subjectId;

      if (!classId || !subjectId) throw createServiceError('Donnée manquat');
      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked?.success) {
        throw createServiceError(
          checked?.message || 'Permission non accorder',
          403,
        );
      }

      const exist = await prisma.classSubjects.findUnique({
        where: {
          classId_subjectId: { classId, subjectId },
        },
      });

      if (exist) {
        throw createServiceError('La matière existe déjà dans cette classe.');
      }

      return await prisma.classSubjects.create({
        data: {
          classId,
          subjectId,
          teacherId: input?.teacherId,
          coefficient: input?.coefficient,
          weeklyHours: input?.weeklyHours,
        },
      });
    },
    updateClassSubject: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      const id = input?.id;
      if (!id)
        throw createServiceError("l'identifiant de la matière est requis");
      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked?.success) {
        throw createServiceError(
          checked?.message || 'Permission non accorder',
          403,
        );
      }
      const exist = await prisma.classSubjects.findUnique({
        where: {
          id,
        },
      });

      if (!exist) {
        throw createServiceError('Matière introuvable.');
      }
      return await prisma.classSubjects.update({
        where: {
          id,
        },
        data: {
          teacherId: input?.teacherId ?? undefined,
          classId: input?.classId ?? undefined,
          subjectId: input?.subjectId ?? undefined,
          coefficient: input?.coefficient,
          weeklyHours: input?.weeklyHours ?? undefined,
        },
      });
    },
    deleteClassSubjects: async (_, { ids }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked?.success) {
        throw createServiceError(
          checked?.message || 'Permission non accorder',
          403,
        );
      }

      const classSubjects = await prisma.classSubjects.deleteMany({
        where: {
          id: {
            in: [...ids],
          },
        },
      });

      return {
        ok: true,
        message: `${classSubjects?.count} supprimer avec succès.`,
      };
    },
  },
};
