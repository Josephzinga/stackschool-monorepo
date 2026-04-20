import { Prisma } from '@stackschool/db';
import { createServiceError } from '../../../utils/api-errors';
import { Resolvers } from '../../types.generated';
import { checkRole, checkSchoolId, checkUser } from '../../../lib/verify-role';
import { getWeeklyHours } from '../../../utils/lesson-get-hours';

export const classSubjectResolver: Resolvers = {
  Query: {
    getAssignments: async (
      _,
      { filter: { classId, groupId, teacherId, limit } },
      { schoolId, user, prisma },
    ) => {
      checkUser(user);
      checkSchoolId(schoolId);

      try {
        const checkedRole = await checkRole({
          context: { userId: user.id, schoolId },
          roles: ['TEACHER', 'ADMIN'],
        });

        if (!checkedRole.success) {
          throw createServiceError(
            checkedRole.message || 'Permission non accordée',
          );
        }

        let whereClause: Prisma.TeacherAssignmentWhereInput = {
          schoolId,
        };

        if (teacherId) {
          whereClause = {
            ...whereClause,
            teacherId,
          };
        }
        if (groupId) {
          whereClause = {
            ...whereClause,
            classSubject: {
              group: {
                id: groupId,
              },
            },
          };
        }

        if (classId) {
          whereClause = {
            ...whereClause,
            classSubject: {
              group: {
                classes: {
                  some: {
                    id: classId,
                  },
                },
              },
            },
          };
        }

        return await prisma.teacherAssignment.findMany({
          where: whereClause,
        });
      } catch (err: any) {
        throw createServiceError(err?.message || 'Erreur interne du serveur');
      }
    },
    getClassSubjects: async (
      _,
      { classId, teacherId, groupId },
      { user, schoolId, prisma },
    ) => {
      checkUser(user);
      checkSchoolId(schoolId);
      const ids = [classId, teacherId, groupId];

      if (
        ids.filter((id) => id !== undefined && (id !== null || '')).length > 1
      ) {
        throw createServiceError('Viellez specifier un seule identifiant');
      }

      const checked = await checkRole({
        context: { userId: user?.id, schoolId },
        roles: ['TEACHER', 'ADMIN', 'PARENT'],
      });

      if (!checked.success) {
        throw createServiceError(
          checked?.message || 'permission non accordé',
          403,
        );
      }
      return prisma.classSubjects.findMany({
        where: {
          group: {
            id: groupId ?? undefined,
            ...(classId && {
              classes: {
                some: {
                  id: classId ?? undefined,
                },
              },
            }),
          },
          ...(teacherId && {
            assignments: {
              teacherId,
            },
          }),
        },
      });
    },
  },

  ClassSubject: {
    assignment: async (parent, _, { loaders }) => {
      return await loaders.assignmentsByClassSubjectLoader.load(parent.id);
    },
    weeklyHours: async (parent, _args, { loaders }) => {
      const lessons = await loaders.lessonsByClassSubjectLoader.load(parent.id);

      return getWeeklyHours(lessons);
    },
    subject: async (parent, _, { loaders }) => {
      if (!parent.subjectId) {
        throw createServiceError('Identifiant du sujet manquant', 400);
      }

      const subject = await loaders.subjectLoader.load(parent.subjectId);

      if (!subject) {
        throw createServiceError('Sujet introuvable', 404);
      }

      return subject;
    },
    group: async (parent, _args, { loaders }) => {
      if (!parent.groupId) {
        throw createServiceError('Identifiant du groupe manquant', 400);
      }

      const group = await loaders.groupLoader.load(parent.groupId);

      return group;
    },
  },
  TeacherAssignments: {
    teacher: async (parent, _, { loaders }) => {
      return (await loaders.teacherLoader.load(parent.teacherId)) || null;
    },

    classSubjects: async (parent, _, { loaders }) => {
      const classSubject = await loaders.classSubjectLoader.load(
        parent.classSubjectId,
      );

      return classSubject || null;
    },
  },
};
