import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { isAdmin } from '../../../lib/verify-role';
import { prisma } from '@stackschool/db';
import { createClassSubjectSchema } from '@stackschool/shared';
import { safeValidateSchema } from '../../../utils/validate-schema.util';

export const classSubjectMutationResolver: Resolvers = {
  Mutation: {
    createClassSubject: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);
      const { success, errors, data } = safeValidateSchema(
        createClassSubjectSchema,
        input,
      );

      if (!success) {
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation',
          400,
          errors,
        );
      }

      const { subjectId, teacherId, coefficient, weeklyHours } = data!;
      const classId = input?.classId;

      if (!classId || !subjectId) throw createServiceError('Donnée manquat');
      try {
        const checked = await isAdmin({
          context: { userId: user.id, schoolId },
        });
        if (!checked?.success) {
          throw createServiceError(
            checked?.message || 'Permission non accorder',
            403,
          );
        }

        const exist = await prisma.classSubjects.findFirst({
          where: {
            subjectId,
            group: {
              classes: {
                some: {
                  id: classId,
                },
              },
            },
          },
        });

        if (exist) {
          throw createServiceError('La matière existe déjà dans cette classe.');
        }

        return await prisma.$transaction(async (tx) => {
          const group = await tx.group.findFirst({
            where: {
              classes: {
                some: {
                  id: classId,
                },
              },
            },
          });
          const classSubject = await tx.classSubjects.create({
            data: {
              schoolId,
              group: {
                connect: {
                  id: group?.id!,
                },
              },
              subject: {
                connect: { id: subjectId },
              },
              coefficient: coefficient,
              weeklyHours: weeklyHours,
            },
          });

          if (input?.teacherId) {
            await tx.teacherAssignment.create({
              data: {
                schoolId,
                classSubjectId: classSubject.id,
                teacherId: teacherId,
              },
            });
          }

          return classSubject;
        });
      } catch (err: any) {
        throw createServiceError(
          err?.message ||
            'Erreur lors de la creation de la matière dans la classe',
        );
      }
    },

    updateClassSubject: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const { success, errors, data } = safeValidateSchema(
        createClassSubjectSchema,
        input,
      );

      if (!success) {
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation',
          400,
          errors,
        );
      }

      const { id, subjectId, teacherId, coefficient, weeklyHours } = data!;
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
          assignments: {
            update: {
              ...(teacherId && {
                teacherId,
              }),
            },
          },

          subject: {
            ...(subjectId && {
              connect: {
                id: subjectId ?? undefined,
              },
            }),
          },
          coefficient: coefficient,
          weeklyHours: weeklyHours ?? undefined,
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

      const classSubjects = await prisma.$transaction(async (tx) => {
        return await tx.classSubjects.deleteMany({
          where: {
            id: {
              in: [...ids],
            },
          },
        });
      });

      return {
        ok: true,
        message: `${classSubjects?.count} supprimer avec succès.`,
      };
    },
  },
};
