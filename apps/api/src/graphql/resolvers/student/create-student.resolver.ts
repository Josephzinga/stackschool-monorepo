import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { safeValidateSchema } from '../../../utils/validate-schema.util';
import { createStudentSchema } from '@stackschool/shared';
import { isAdmin } from '../../../lib/verify-role';
import { prisma } from '@stackschool/db';

export const createStudentResolver: Resolvers = {
  Mutation: {
    createListStudent: async (_, { data, schoolId }, context) => {
      try {
        if (!context.user || !context.user.id) {
          throw createServiceError('Non authentifier', 401);
        }
        if (!schoolId) {
          throw createServiceError('identifiant manquant');
        }

        const result = safeValidateSchema(createStudentSchema, data);

        if (!result.success) {
          return result.errors;
        }
        const checkedRole = await isAdmin({
          context: { userId: context.user.id, schoolId },
        });

        if (!checkedRole.success) {
          throw createServiceError(checkedRole?.message!, 403);
        }

        const { matricule } = result.data!;

        const existingStudent = await prisma.student.findUnique({
          where: {
            matricule_schoolId: { matricule, schoolId },
          },
        });

        if (existingStudent) {
        }
      } catch (e) {}
    },
  },
};
