import { createServiceError } from '../../../../utils/api-errors';
import { safeValidateSchema } from '../../../../utils/validate-schema.util';
import { createStudentSchema } from '@stackschool/shared';
import { checkSchoolId, checkUser, isAdmin } from '../../../../lib/verify-role';
import { Resolvers } from '../../../types.generated';

export const createStudentMutationResolver: Resolvers = {
  Mutation: {
    createListStudent: async (_, { data }, { schoolId, user, prisma }) => {
      try {
        checkUser(user);
        checkSchoolId(schoolId);
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
  },
};
