import { prisma } from '@stackschool/db';
import {
  checkRole,
  checkSchoolId,
  checkUser,
} from '../../../../lib/verify-role';
import { createServiceError } from '../../../../utils/api-errors';
import { Resolvers } from '../../../types.generated';

export const markStudentAttendanceResolver: Resolvers = {
  Mutation: {
    markStudentAttendance: async (_, { input }, { user, schoolId }) => {
      checkUser(user);
      checkSchoolId(schoolId);
      if (!input || input?.length === 0)
        throw createServiceError('donnée manquant');

      const { success, message, member } = await checkRole({
        context: { userId: user.id, schoolId },
        roles: ['ADMIN', 'TEACHER'],
      });

      if (!success)
        throw createServiceError(message || 'Permisson non accorder', 401);

      if (member?.role !== 'ADMIN') {
        for (const item of input) {
          const students = await prisma.student.findFirst({
            where: {
              id: item.id,
              ...(item.classId && {
                classId: item.classId,
              }),
            },
          });
        }
      }
    },
  },
};
