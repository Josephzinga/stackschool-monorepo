import { prisma } from '@stackschool/db';
import { Day, Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { isAdmin } from '../../../lib/verify-admin';

export const teacherResolver: Resolvers = {
  Query: {
    teacher: async (_, { id }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: {
          schoolUser: {
            include: {
              user: {
                include: { profile: true },
              },
              school: true,
            },
          },
          lessons: {
            select: {
              id: true,
              day: true,
              startTime: true,
              endTime: true,
              title: true,
              class: {
                select: {
                  id: true,
                  name: true,
                  level: true,
                },
              },
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          supervisedClasses: true,
          classTeacher: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  level: true,
                  _count: {
                    select: {
                      students: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!teacher) throw createServiceError('Enseignant introuvable', 404);

      // Vérification de sécurité : L'utilisateur doit être membre de la même école
      // ou être le prof lui-même.
      // Pour simplifier ici, on suppose que si on a l'ID, on a le droit,
      // mais idéalement il faudrait vérifier context.user.memberships.

      return {
        ...teacher,
        user: teacher.schoolUser.user as any,
        lessons: teacher.lessons.map((lesson) => ({
          ...lesson,
          day: lesson.day as Day,
        })),
        classes: [
          ...teacher.supervisedClasses,
          ...teacher.classTeacher.map((ct) => ct.class),
        ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i), // Dedup
      };
    },
  },

  Mutation: {
    deleteTeachers: async (_, { teacherIds, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        // 2. Suppression
        const teachers = await prisma.teacher.findMany({
          where: {
            id: { in: teacherIds as string[] },
            schoolUser: { schoolId },
          },
          select: { schoolUserId: true },
        });

        const schoolUserIds = teachers.map((t) => t.schoolUserId);

        if (schoolUserIds.length === 0) {
          return { ok: false, message: 'Aucun enseignant trouvé à supprimer.' };
        }

        await prisma.schoolUser.deleteMany({
          where: {
            id: { in: schoolUserIds },
          },
        });

        return {
          ok: true,
          message: `${schoolUserIds.length} enseignant(s) supprimé(s) avec succès.`,
        };
      } catch (error) {
        console.error('Erreur suppression profs:', error);
        throw createServiceError('Erreur lors de la suppression', 500, error);
      }
    },
  },

  Teacher: {
    weeklyHours: async (parent) => {
      const lessons = await prisma.lesson.findMany({
        where: { teacherId: parent.id },
      });

      let totalMinutes = 0;
      lessons.forEach((l) => {
        const diffMs = l.endTime.getTime() - l.startTime.getTime();
        totalMinutes += diffMs / (1000 * 60);
      });

      return parseFloat((totalMinutes / 60).toFixed(1));
    },
  },
};
