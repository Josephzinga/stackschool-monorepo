import { createServiceError } from '../../../utils/api-errors';
import { safeValidateSchema } from '../../../utils/validate-schema.util';
import { createStudentSchema, RelationType } from '@stackschool/shared';
import { isAdmin } from '../../../lib/verify-role';
import { prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';

export const studentMutationResolver: Resolvers = {
  Mutation: {
    createListStudent: async (_, { data }, { schoolId, user }) => {
      try {
        if (!user || !user.id) {
          throw createServiceError('Non authentifier', 401);
        }
        if (!schoolId) {
          throw createServiceError('identifiant manquant');
        }
        const birthDate = data.birthDate ? new Date(data.birthDate) : null;
        const {
          data: validData,
          errors,
          success,
        } = safeValidateSchema(createStudentSchema, { ...data, birthDate });

        if (!success) {
          return createServiceError(errors![0].message, 400, errors);
        }
        const checkedRole = await isAdmin({
          context: { userId: user.id, schoolId },
        });

        if (!checkedRole.success) {
          return createServiceError(checkedRole?.message!, 403);
        }

        console.log('tout ok', checkedRole, schoolId);

        await prisma.$transaction(async (tx) => {
          const existingStudent = await tx.student.findUnique({
            where: {
              matricule_schoolId: {
                matricule: validData?.matricule!,
                schoolId,
              },
            },
          });

          if (existingStudent) {
            throw createServiceError(
              "C'est élève existe déjà dans l'établissement",
            );
          }

          const user = await tx.user.create({
            data: {
              email: `email_student_${data?.matricule}@invalid`,
              isActive: false,
              profile: {
                create: {
                  lastname: data?.lastname,
                  firstname: data?.firstname,
                  gender: data?.gender,
                },
              },
            },
            select: {
              id: true,
              profile: {
                select: {
                  id: true,
                },
              },
            },
          });

          const schoolUser = await tx.schoolUser.create({
            data: {
              userId: user?.id,
              role: 'STUDENT',
              schoolId,
            },
          });

          await tx.student.create({
            data: {
              schoolId,
              matricule: validData?.matricule!,
              enrollmentYear: validData?.enrollmentYear!,
              birthDate: new Date(validData?.birthDate!),
              birthPlace: validData?.birthPlace,
              nationality: validData?.nationality,
              schoolUserId: schoolUser.id,
              profileId: user?.profile?.id!,
              classId: validData?.classId!,
            },
          });
        });
        return {
          ok: true,
          message: 'Élève crée avec succés',
        };
      } catch (e) {
        const message = "Erreur lors de la création de l'élève.";
        createServiceError(message, 500, e);
        return {
          ok: false,
          message,
        };
      }
    },
    updateStudent: async (
      _,
      { studentId, data: studentData, schoolId },
      context,
    ) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const { success, data, errors } = safeValidateSchema(
        createStudentSchema,
        studentData,
      );

      if (!success)
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation',
          400,
          errors,
        );

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        const existingStudent = await prisma.student.findUnique({
          where: { id: studentId, schoolId },
          include: {
            schoolUser: {
              select: {
                user: true,
              },
            },
          },
        });

        if (!existingStudent || existingStudent.schoolId !== schoolId) {
          throw createServiceError('Élève introuvable dans cette école', 404);
        }

        const {
          firstname,
          lastname,
          gender,
          address,
          parentData,
          matricule,
          medicalCondition,
          phoneNumber,
          allergies,
          isActive,
          classId,
          birthCertificateNumber,
          birthPlace,
          birthDate,
          enrollmentYear,
          nationality,
          enrollmentDate,
          bloodGroup,
          previousClass,
          previousSchool,
          status,
          email,
        } = data!;

        return await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: existingStudent.schoolUser?.user?.id },
            data: {
              email,
              phoneNumber,
              profile: {
                update: {
                  firstname,
                  lastname,
                  gender,
                  address,
                },
              },
            },
          });
          if (parentData) {
            let parentIdToLink = parentData?.parentId;

            if (parentData?.mode === 'CREATE') {
              let parentUser = await tx.user.findUnique({
                where: {
                  phoneNumber: parentData?.newParent?.phoneNumber,
                },
              });
              if (!parentUser) {
                parentUser = await tx.user.create({
                  data: {
                    phoneNumber: parentData.newParent?.phoneNumber,
                    isActive: false,
                    hasMembership: true,
                    profileCompleted: true,
                    profile: {
                      create: {
                        firstname: parentData.newParent?.firstname,
                        lastname: parentData.newParent?.lastname,
                        address: parentData.newParent?.address,
                      },
                    },
                  },
                });
              }
              const newParent = await tx.parent.create({
                data: {
                  profession: parentData.newParent?.profession,
                  schoolUser: {
                    create: {
                      role: 'PARENT',
                      userId: parentUser?.id,
                      schoolId,
                    },
                  },
                },
              });
              parentIdToLink = newParent.id;
            }
            if (parentIdToLink) {
              await tx.parentStudent.upsert({
                where: {
                  parentId_studentId: { parentId: parentIdToLink, studentId },
                },
                create: {
                  studentId,
                  parentId: parentIdToLink,
                  relationType: (parentData.newParent?.relationType ||
                    'OTHER') as RelationType,
                },
                update: {}, // On ne change rien si le lien existe déjà
              });
            }
          }
          return await tx.student.update({
            where: { id: studentId },
            data: {
              matricule: matricule,
              classId: classId,
              enrollmentYear: enrollmentYear ?? '',
              birthDate: birthDate,
              birthPlace: birthPlace,
              nationality: nationality,
              bloodGroup: bloodGroup,
              allergies: allergies,
              birthCertificateNumber: birthCertificateNumber,
              previousSchool: previousSchool,
              previousClass: previousClass,
              enrollmentDate: enrollmentDate
                ? new Date(enrollmentDate)
                : undefined,
              status: status ?? undefined,
            },
          });
        });
      } catch (error) {
        console.error('Erreur update élève:', error);
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    },

    deleteStudents: async (
      _,
      { studentIds, schoolId, soft = true },
      context,
    ) => {
      try {
        if (!context.user) throw createServiceError('Non authentifié', 401);

        const adminCheck = await isAdmin({
          context: { schoolId, userId: context.user.id },
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
