import { prisma } from '@stackschool/db';
import { safeValidateSchema } from '../../utils/validate-schema.util';
import { SearchStudentParams, searchStudentSchema } from '@stackschool/shared';

export const studentResolver = {
  searchStudent: async (
    { filter }: { filter: SearchStudentParams },
    _: any,
  ) => {
    const { searchTerm, schoolId } = filter;

    const errors = safeValidateSchema<SearchStudentParams>(
      searchStudentSchema,
      {
        searchTerm,
        schoolId,
      },
    );
    console.log('data graphql', searchTerm, schoolId);
    if (errors) {
      throw new Error(errors[0].message);
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
      firstname: s.profile.firstname,
      lastname: s.profile.lastname,
      photo: s.profile.photo,
      className: s.schoolClass?.name,
    }));
  },
};
