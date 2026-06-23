import { createStudentSchema, RelationTypeEnum } from '@stackschool/shared';
import { createServiceError } from '../../../../utils/api-errors';
import { isAdmin } from '../../../../lib/verify-admin';
import { safeValidateSchema } from '../../../../utils/validate-schema.util';
import { checkSchoolId, checkUser } from '../../../../lib/verify-role';
import { Resolvers } from '../../../types.generated';

export const updateStudentMutationResolver: Resolvers = {
  Mutation: {
    updateStudent: async (
      _,
      { studentId, data: studentData },
      { prisma, user, schoolId },
    ) => {
      checkUser(user);
      checkSchoolId(schoolId);

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
        context: { schoolId, userId: user.id },
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
              isActive,
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
                    'OTHER') as RelationTypeEnum,
                },
                update: {}, // On ne change rien si le lien existe déjà
              });
            }
          }
          return await tx.student.update({
            where: { id: studentId },
            data: {
              matricule,
              classId,
              enrollmentYear: enrollmentYear ?? '',
              birthDate,
              birthPlace,
              nationality,
              bloodGroup,
              allergies,
              birthCertificateNumber: birthCertificateNumber,
              medicalCondition,
              previousSchool,
              previousClass,
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
  },
};
