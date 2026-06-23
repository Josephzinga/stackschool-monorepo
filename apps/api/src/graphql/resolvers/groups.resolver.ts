import { Resolvers } from '../types.generated';
import { prisma } from '@stackschool/db';
import { createServiceError } from '../../utils/api-errors';
import { checkSchoolId, checkUser, isAdmin } from '../../lib/verify-role';

export const groupResolver: Resolvers = {
  Mutation: {
    createGroup: async (
      _,
      { input: { name, classIds } },
      { user, schoolId },
    ) => {
      checkUser(user);
      checkSchoolId(schoolId);
      const adminCheck = await isAdmin({
        context: { schoolId, userId: user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }
      const group = await prisma.group.create({
        data: {
          name,
          schoolId,
          classes: {
            connect: classIds.map((cls) => ({
              id: cls,
            })),
          },
        },
      });
      return group;
    },
  },
  Group: {
    classSubjects: async (parent, _args, { loaders }) => {
      return (await loaders.classSubjectByGroupLoader.load(parent.id)) || [];
    },
    classes: async (parent, _args, { loaders }) => {
      return (await loaders.classByGroupLoader.load(parent.id)) || [];
    },
  },
};
