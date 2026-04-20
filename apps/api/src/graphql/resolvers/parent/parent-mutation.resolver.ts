import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { isAdmin } from '../../../lib/verify-role';
import { prisma } from '@stackschool/db';
import { generateUsername } from '../../../utils/generate-username';

export const parentMutationResolver: Resolvers = {
  Mutation: {
    createParent: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError(
          "Identifiant de l'établissement est manquant",
          400,
        );
      const {
        firstname,
        profession,
        lastname,
        phoneNumber,
        address,
        students,
        email,
        isDelegate,
      } = input;

      try {
        const checked = await isAdmin({
          context: { userId: user?.id, schoolId },
        });

        if (!checked.success) {
          throw createServiceError(
            checked?.message || 'Permission non accordée',
          );
        }

        return await prisma.$transaction(async (tx) => {
          const existingParent = await tx.parent.findFirst({
            where: {
              schoolUser: {
                schoolId,
                user: {
                  OR: [{ email, phoneNumber }],
                },
              },
            },
          });

          if (existingParent)
            throw createServiceError(
              "C'est parent existe déjà dans la l'établissement.",
            );
          const existingUser = await tx.user.findFirst({
            where: {
              OR: [{ email, phoneNumber }],
            },
          });

          if (existingUser)
            throw createServiceError(
              "L'utilisateur avec c'est numéro ou email existe déjà.",
            );
          const newUser = await tx.user.create({
            data: {
              username: generateUsername(firstname, lastname),
              phoneNumber,
              email,
              profileCompleted: true,
              hasMembership: true,
              isActive: false,
              profile: {
                create: {
                  firstname,
                  lastname,
                  address,
                },
              },
            },
          });
          const newParent = await tx.parent.create({
            data: {
              profession,
              isDelegate: isDelegate ?? undefined,
              schoolUser: {
                create: {
                  schoolId,
                  role: 'PARENT',
                  userId: newUser.id,
                },
              },
            },
          });

          if (students && students?.length > 0) {
            for (const student of students) {
              await tx.parentStudent.create({
                data: {
                  parentId: newParent.id,
                  studentId: student.studentId,
                  relationType: student.relationType,
                },
              });
            }
          }
          return newParent;
        });
      } catch (err: any) {
        throw createServiceError(
          err?.message || 'Erreur lors de la création de parent',
        );
      }
    },
  },
};
