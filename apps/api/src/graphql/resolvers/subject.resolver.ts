import { Resolvers, SubjectCategory } from '../types.generated';
import { createServiceError } from '../../utils/api-errors';
import { prisma, Prisma } from '@stackschool/db';
import { isAdmin } from '../../lib/verify-role';
import { safeValidateSchema } from '../../utils/validate-schema.util';
import { createSubjectForm } from '@stackschool/shared';
import { getWeeklyHours } from '../../utils/lesson-get-hours';

export const subjectResolver: Resolvers = {
  Query: {
    getSchoolSubjects: async (
      _,
      { input: { searchTerm, page = 0, classId, teacherId, sort, limit = 10 } },
      { user, schoolId },
    ) => {
      if (!user) throw createServiceError('Non authentifier');
      if (!schoolId) throw createServiceError('Identifiant maquant');

      const skip = page * limit;
      const search = searchTerm?.trim();

      let whereClause: Prisma.SubjectWhereInput = {
        schoolId,
      };

      if (search) {
        whereClause = {
          ...whereClause,
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        };
      }

      if (teacherId) {
        whereClause = {
          ...whereClause,
          classSubjects: {
            some: {
              assignments: {
                teacherId,
              },
            },
          },
        };
      }
      let orderBy: Prisma.SubjectOrderByWithRelationInput = {
        name: 'asc',
      };

      const [total, subject] = await Promise.all([
        await prisma.subject.count({
          where: whereClause,
        }),
        await prisma.subject.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy,
        }),
      ]);

      return {
        data: subject as any,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },
  },
  Mutation: {
    createSubject: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const { success, errors, data } = safeValidateSchema(
        createSubjectForm,
        input,
      );
      if (!success) {
        throw createServiceError(
          errors ? errors[0].message : 'Erreur de validation',
          400,
        );
      }

      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked.success) {
        throw createServiceError(checked.message || 'Non autorisé');
      }

      const exist = await prisma.subject.findFirst({
        where: {
          schoolId,
          OR: [
            { name: { equals: data?.name, mode: 'insensitive' } },
            { code: { equals: data?.code, mode: 'insensitive' } },
          ],
        },
      });
      if (exist) throw createServiceError('Cette matière existe déjà.', 403);

      const subject = await prisma.$transaction(async (tx) => {
        const subject = await tx.subject.create({
          data: {
            schoolId,
            name: data?.name!,
            code: data?.code,
            mainTeacherId: data?.mainTeacherId,
            category: data?.category,
          },
        });
        const group = await prisma.group.findFirst({
          where: {
            classes: {
              some: {
                id: data.classId,
              },
            },
          },
        });
        if (data?.classSubject) {
          for (const cls of data?.classSubject) {
            await tx.classSubjects.create({
              data: {
                schoolId,
                subjectId: subject?.id,
                groupId: '',
                coefficient: cls?.coefficient,
                weeklyHours: cls?.weeklyHours,
              },
            });
          }
        }
        return subject;
      });
      return {
        ...subject,
        category: subject?.category as SubjectCategory,
      };
    },
    deleteSubjects: async (_, { subjectIds }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked.success) {
        throw createServiceError(checked.message || 'Non autorisé');
      }

      const exist = await prisma.subject.findMany({
        where: {
          schoolId,
          id: {
            in: [...subjectIds],
          },
        },
      });

      if (!exist || exist?.length === 0)
        throw createServiceError("Ces matières n'existe pas");

      const subjects = await prisma.subject.deleteMany({
        where: {
          id: {
            in: [...subjectIds],
          },
        },
      });

      return {
        ok: true,
        message: `${subjects.count} matière supprimer avec succès`,
      };
    },
  },

  Subject: {
    classSubject: async (parent) => {
      return prisma.classSubjects.findMany({
        where: {
          subjectId: parent.id,
        },
      });
    },

    totalWeeklyHours: async (parent, _args, { loaders }) => {
      const lessons = await loaders.lessonsBySubjectLoader.load(parent.id);
      return getWeeklyHours(lessons);
    },
    mainTeacher: async (parent, _args, { loaders }) => {
      if (!parent.mainTeacherId) return null;
      return (await loaders.teacherLoader.load(parent.mainTeacherId)) || null;
    },
  },
};
