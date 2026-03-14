import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { safeValidateSchema } from '../../../utils/validate-schema.util';
import { createTeacherSchema } from '@stackschool/shared';
import { isAdmin } from '../../../lib/verify-role'; // Mise à jour de l'import
import { prisma } from '@stackschool/db';

export const createTeacherResolver: Resolvers = {
  Mutation: {
    createListTeachers: async (_, { data, schoolId }, context) => {
      try {
        if (!context.user) throw createServiceError('Non authentifié', 401);

        if (!schoolId) {
          return createServiceError('identifiant manquant', 400);
        }

        const result = safeValidateSchema(createTeacherSchema, data);

        if (!result.success && result.errors) {
          throw createServiceError(
            result?.errors[0]?.message,
            400,
            result.errors,
          );
        }
        const admin = await isAdmin({
          context: { schoolId, userId: context.user.id },
        });

        if (!admin?.success) {
          throw createServiceError(admin?.message!, 403);
        }

        await prisma.$transaction(async (tx) => {
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
          await tx.schoolUser.create({
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
          });
        });

        return {
          ok: true,
          message: 'Professeur créé avec succès',
        };
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
  },
};
