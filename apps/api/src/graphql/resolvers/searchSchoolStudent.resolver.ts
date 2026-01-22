import { prisma } from '@stackschool/db';
import { safeValidateSchema } from '../../utils/validate-schema.util';
import { SearchStudentParams, searchStudentSchema } from '@stackschool/shared';
import { createServiceError } from '../../utils/api-errors';
import { Resolvers } from '../types.generated';

export const studentResolver: Resolvers = {
  Query: {
    searchStudent: async (_: any, { filter }, __: any) => {
      const { schoolId } = filter;
      const searchTerm = filter.searchTerm?.trim() || '';

      const { errors, success } = safeValidateSchema<SearchStudentParams>(
        searchStudentSchema,
        {
          searchTerm,
          schoolId,
        },
      );
      if (!success) {
        throw createServiceError(
          errors!.map((e) => e.message).join(', '),
          400,
          errors,
        );
      }

      const students = await prisma.student.findMany({
        where: {
          schoolId,
          OR: [
            {
              profile: {
                firstname: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            {
              profile: {
                lastname: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            { matricule: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          matricule: true,
          id: true,
          schoolClass: { select: { name: true } },
          profile: {
            select: {
              lastname: true,
              firstname: true,
              photo: true,
            },
          },
        },
      });
      return students.map((s) => ({
        id: s.id,
        matricule: s.matricule,
        firstname: s.profile.firstname as string,
        lastname: s.profile.lastname as string,
        photo: s.profile.photo,
        className: s.schoolClass?.name,
      }));
    },
  },
};
