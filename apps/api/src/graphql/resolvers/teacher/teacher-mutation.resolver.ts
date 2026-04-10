import { prisma } from '@stackschool/db';
import { createServiceError } from '../../../utils/api-errors';
import { Resolvers } from '../../types.generated';
import { isAdmin } from '../../../lib/verify-role';
import { safeValidateSchema } from '../../../utils/validate-schema.util';
import { createTeacherSchema } from '@stackschool/shared';

export const teacherMutationResolver: Resolvers = {
  Mutation: {
    createTeacher: async (_, { input }, { user, schoolId }) => {
      try {
        if (!user) throw createServiceError('Non authentifié', 401);

        if (!schoolId) {
          return createServiceError('identifiant manquant', 400);
        }

        const { success, errors, data } = safeValidateSchema(
          createTeacherSchema,
          input,
        );

        if (!success) {
          throw createServiceError(
            errors?.[0]?.message || 'Erreur de validation',
            400,
            errors,
          );
        }
        const admin = await isAdmin({
          context: { schoolId, userId: user.id },
        });

        if (!admin?.success) {
          throw createServiceError(admin?.message!, 403);
        }

        return await prisma.$transaction(async (tx) => {
          let userId: string;

          // 1. Gestion de l'utilisateur (Existant ou Nouveau)
          const existingUser = await tx.user.findFirst({
            where: {
              OR: [
                { email: data?.email },
                { phoneNumber: data?.phoneNumber },
              ].filter(Boolean) as any,
            },
          });

          if (existingUser) {
            userId = existingUser.id;
          } else {
            const newUser = await tx.user.create({
              data: {
                email: data?.email || null,
                phoneNumber: data?.phoneNumber || null,
                username: `${data?.lastname}${data?.lastname}`
                  .trim()
                  .toLowerCase(),
                profile: {
                  create: {
                    firstname: data?.firstname,
                    lastname: data?.lastname,
                    gender: data?.gender,
                  },
                },
              },
              select: { id: true },
            });
            userId = newUser.id;
          }

          // 2. Vérifier si déjà membre de cette école
          const existingMember = await tx.schoolUser.findUnique({
            where: { schoolId_userId: { schoolId, userId } },
            select: {
              school: {
                select: {
                  id: true,
                },
              },
            },
          });

          if (existingMember) {
            throw createServiceError(
              "Cet utilisateur est déjà membre de l'école",
              400,
            );
          }

          // 3. Création SchoolUser + Teacher + Liens Classes
          const schoolUser = await tx.schoolUser.create({
            data: {
              role: 'TEACHER',
              schoolId: schoolId!,
              userId: userId,
              teacher: {
                create: {
                  diploma: data?.diploma,
                  specialization: data?.specialization,
                  isActive: true,
                },
              },
            },
            include: {
              teacher: true,
            },
          });

          return schoolUser.teacher;
        });
      } catch (error) {
        console.error('Erreur création prof:', error);
        if ((error as any).statusCode) throw error;
        throw createServiceError(
          'Erreur lors de la création du professeur',
          500,
          error,
        );
      }
    },

    deleteTeachers: async (_, { teacherIds }, { schoolId, user }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError("Identifiant de l'établissement manquant");

      const adminCheck = await isAdmin({
        context: { schoolId, userId: user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        const teachers = await prisma.teacher.findMany({
          where: {
            id: { in: teacherIds as string[] },
            schoolUser: { schoolId },
          },
          select: { schoolUserId: true },
        });

        const schoolUserIds = teachers.map((t) => t.schoolUserId);

        if (schoolUserIds.length === 0) {
          return { ok: false, message: 'Aucun enseignant trouvé à supprimer.' };
        }

        await prisma.schoolUser.deleteMany({
          where: {
            id: { in: schoolUserIds },
            schoolId,
          },
        });

        return {
          ok: true,
          message: `${schoolUserIds.length} enseignant(s) supprimé(s) avec succès.`,
        };
      } catch (error) {
        console.error('Erreur suppression profs:', error);
        throw createServiceError('Erreur lors de la suppression', 500, error);
      }
    },

    updateTeacher: async (_, { teacherId, data }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError("Identifiant de l'établissement manquant");

      const adminCheck = await isAdmin({
        context: { schoolId, userId: user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        const teacher = await prisma.teacher.findUnique({
          where: { id: teacherId },
          include: { schoolUser: true },
        });

        if (!teacher || teacher.schoolUser.schoolId !== schoolId) {
          throw createServiceError(
            'Enseignant introuvable dans cette école',
            404,
          );
        }

        return await prisma.$transaction(async (tx) => {
          // 1. Mise à jour User/Profile
          await tx.user.update({
            where: { id: teacher.schoolUser.userId },
            data: {
              email: data.email || undefined,
              phoneNumber: data.phoneNumber || undefined,
              profile: {
                update: {
                  firstname: data.firstname,
                  lastname: data.lastname,
                  gender: data.gender,
                },
              },
            },
          });

          // 2. Mise à jour Teacher
          return await tx.teacher.update({
            where: { id: teacherId },
            data: {
              diploma: data.diploma,
              specialization: data.specialization,
              // Mise à jour des classes (Sync)
            },
          });
        });
      } catch (error) {
        console.error('Erreur update prof:', error);
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    },
  },
};
