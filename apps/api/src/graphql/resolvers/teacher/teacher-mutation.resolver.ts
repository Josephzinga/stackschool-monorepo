import { createServiceError } from '../../../utils/api-errors';
import { Resolvers } from '../../types.generated';
import { checkSchoolId, checkUser, isAdmin } from '../../../lib/verify-role';
import { safeValidateSchema } from '../../../utils/validate-schema.util';
import {
  createTeacherSchema,
  teacherAssignmentSchema,
} from '@stackschool/shared';

export const teacherMutationResolver: Resolvers = {
  Mutation: {
    createTeacher: async (_, { input }, { user, schoolId, prisma }) => {
      try {
        checkUser(user);
        checkSchoolId(schoolId);
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

    deleteTeachers: async (_, { teacherIds }, { schoolId, user, prisma }) => {
      checkSchoolId(schoolId);
      checkUser(user);
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

    updateTeacher: async (
      _,
      { teacherId, data },
      { user, schoolId, prisma },
    ) => {
      checkSchoolId(schoolId);
      checkUser(user);
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

          return await tx.teacher.update({
            where: { id: teacherId },
            data: {
              diploma: data.diploma,
              specialization: data.specialization,
            },
          });
        });
      } catch (error) {
        console.error('Erreur update prof:', error);
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    },

    createTeacherAssignment: async (
      _,
      { input },
      { user, schoolId, prisma },
    ) => {
      checkUser(user);
      checkSchoolId(schoolId);

      const {
        success: ok,
        errors,
        data,
      } = safeValidateSchema(teacherAssignmentSchema, input);
      if (!ok) {
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation',
          400,
          errors,
        );
      }
      const { success, message } = await isAdmin({
        context: { schoolId, userId: user.id },
      });

      if (!success) {
        throw createServiceError(message || 'Permission non accordée.');
      }
      const { subjectIds, teacherId, classId } = data!;

      try {
        const existingClassSubjects = await prisma.classSubjects.findMany({
          where: {
            schoolId,
            group: { classes: { some: { id: classId } } },
            subjectId: { in: subjectIds },
          },
          include: { subject: true },
        });

        if (existingClassSubjects.length !== subjectIds.length) {
          throw createServiceError(
            'Certaines matières sont introuvables pour cette classe.',
          );
        }

        const conflicts = await prisma.teacherAssignment.findMany({
          where: {
            schoolId,
            classSubjectId: { in: existingClassSubjects.map((cs) => cs.id) },
          },
          select: {
            classSubject: { select: { subject: true } },
          },
        });

        if (conflicts.length > 0) {
          const conflictNames = conflicts
            .map((c) => c.classSubject.subject.name)
            .join(', ');
          throw createServiceError(
            `Les matières suivantes ont déjà un enseignant : ${conflictNames}`,
          );
        }

        const dataToCreate = existingClassSubjects.map((cs) => ({
          schoolId,
          teacherId,
          classSubjectId: cs.id,
        }));

        const result = await prisma.teacherAssignment.createMany({
          data: dataToCreate,
        });

        return {
          ok: true,
          message: `${result.count} assignation(s) créée(s) avec succès`,
        };
      } catch (err: any) {
        throw createServiceError(
          err?.message || "Erreur lors de la création de l'assignation",
          err?.statusCode || 500,
        );
      }
    },

    deleteTeacherAssignment: async (_, { id }, { user, prisma, schoolId }) => {
      checkUser(user);
      checkSchoolId(schoolId);

      try {
        const lessonsCount = await prisma.lesson.count({
          where: { teacherAssignmentId: id },
        });

        if (lessonsCount > 0) {
          throw createServiceError(
            `Impossible de supprimer : ${lessonsCount} leçon(s) sont liées à ce professeur. Supprimez les leçons d'abord.`,
          );
        }

        await prisma.teacherAssignment.delete({
          where: { id, schoolId },
        });

        return { ok: true, message: 'Assignation supprimée avec succès' };
      } catch (err: any) {
        throw createServiceError(
          err.message || 'Erreur lors de la suppression',
        );
      }
    },
    syncTeacherAssignment: async (_, { input }, { user, prisma, schoolId }) => {
      checkUser(user);
      checkSchoolId(schoolId);
      try {
        // À l'intérieur de ton resolver syncTeacherAssignments
        const { teacherId, classId, subjectIds } = input;

        return await prisma.$transaction(async (tx) => {
          // 1. Récupérer les IDs de jonction (ClassSubjects) pour cette classe
          const classSubjects = await tx.classSubjects.findMany({
            where: {
              subjectId: { in: subjectIds },
              group: { classes: { some: { id: classId } } },
            },
          });
          const targetCSIds = classSubjects.map((cs) => cs.id);

          // 2. Récupérer les assignations actuelles
          const currentAssignments = await tx.teacherAssignment.findMany({
            where: {
              teacherId,
              classSubject: { group: { classes: { some: { id: classId } } } },
            },
          });
          const currentCSIds = currentAssignments.map((a) => a.classSubjectId);

          // 3. Calculer les deltas
          const toAdd = targetCSIds.filter((id) => !currentCSIds.includes(id));
          const toDelete = currentAssignments.filter(
            (a) => !targetCSIds.includes(a.classSubjectId),
          );

          // 4. Appliquer les changements
          if (toDelete.length > 0) {
            await tx.teacherAssignment.deleteMany({
              where: { id: { in: toDelete.map((a) => a.id) } },
            });
          }

          if (toAdd.length > 0) {
            await tx.teacherAssignment.createMany({
              data: toAdd.map((csId) => ({
                teacherId,
                classSubjectId: csId,
                schoolId, // Important pour ton multi-tenant
              })),
            });
          }

          return { ok: true };
        });
      } catch (err: any) {
        throw createServiceError(
          err?.message || 'Erreur lors de la misse à jour des assignation',
        );
      }
    },
  },
};
