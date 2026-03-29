import { Resolvers } from '../types.generated';
import { createServiceError } from '../../utils/api-errors';
import { prisma, Prisma } from '@stackschool/db';
import { checkRole, isAdmin } from '../../lib/verify-role';
import { parse } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { canTransition } from '@stackschool/shared';

export const lessonsResolver: Resolvers = {
  Query: {
    getLessons: async (
      parent,
      { filter: { teacherId, classId, searchTerm, page = 0, limit = 6 } },
      { user, schoolId },
    ) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      let whereClause: Prisma.LessonWhereInput = {
        schoolId,
      };
      if (classId) {
        whereClause.classSubject = {
          group: {
            classes: {
              some: { id: classId },
            },
          },
        };
      }
      if (teacherId) {
        whereClause.classSubject = { teacherId };
      }
      const skip = page * limit;

      const [total, totalSelection, lessons] = await Promise.all([
        await prisma.lesson.count(),
        await prisma.lesson.count({ where: whereClause }),
        //  j'avais fait ça, mais la pagination ne marche pas selon les entités
        await prisma.lesson.findMany({
          where: whereClause,
        }),
      ]);
      return {
        data: lessons,
        meta: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    },
    getClassTeacher: async (_, __, { schoolId, user }) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      return {
        schoolId,
      };
    },
  },
  Mutation: {
    createLesson: async (
      _,
      {
        input: { startTime, endTime, day, subjectId, teacherId, groupId, mode },
      },
      { user, schoolId },
    ) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const checked = await isAdmin({ context: { userId: user.id, schoolId } });
      if (!checked.success) throw createServiceError('Permission non accordée');

      // 1. On utilise une date de référence FIXE (ex: Janvier 2024)
      // Pour que "MONDAY 08:00" soit toujours le même point dans le temps
      const referenceDate = new Date(2024, 0, 1);
      const start = parse(`${day} ${startTime}`, 'EEEE HH:mm', referenceDate, {
        locale: enUS,
      });
      const end = parse(`${day} ${endTime}`, 'EEEE HH:mm', referenceDate, {
        locale: enUS,
      });
      console.log('Start', start, 'End', end);

      // 2. Récupérer les infos de l'assignation (pour avoir classId et teacherId)
      const currentCS = await prisma.classSubjects.findFirst({
        where: {
          subjectId,
          groupId: groupId ?? undefined,
          teacherId,
        },
        select: { id: true, teacherId: true, groupId: true },
      });

      if (!currentCS) throw createServiceError('Assignation introuvable');

      // 3. VÉRIFICATION DES CONFLITS
      // On cherche s'il existe déjà une leçon ce jour-là pour ce prof OU cette classe
      const existingLessons = await prisma.lesson.findMany({
        where: {
          schoolId,
          day,
          OR: [
            { classSubject: { groupId: currentCS.groupId } },
            { classSubject: { teacherId: currentCS.teacherId } },
          ],
        },
      });

      const hasConflict = existingLessons.some((l) => {
        // Algorithme : (StartA < EndB) && (EndA > StartB)
        return start < l.endTime && end > l.startTime;
      });

      if (hasConflict) {
        throw createServiceError(
          `Conflit d'horaire : ${
            mode === 'TEACHER'
              ? `Le professeur est déjà occupé.`
              : 'La classe est' + ' déjà occupé.'
          }`,
        );
      }

      // 4. Création si aucun conflit
      return await prisma.lesson.create({
        data: {
          schoolId,
          classSubjectId: currentCS.id,
          startTime: start,
          endTime: end,
          day,
        },
      });
    },

    updateLessonStatus: async (_, { status, id }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const checked = await checkRole({
        context: { userId: user?.id, schoolId },
        roles: ['TEACHER', 'ADMIN'],
      });
      if (!checked?.success) {
        throw createServiceError(
          checked?.message || 'Permission non accordée',
          403,
        );
      }

      const exist = await prisma.lesson.findUnique({
        where: {
          id,
        },
        select: {
          status: true,
        },
      });
      if (!exist) throw createServiceError('Leçon introuvable');

      if (!canTransition(exist?.status, status)) throw createServiceError('');

      return await prisma.lesson.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
    },
    updateLesson: async (
      _,
      { input: { id, day, startTime, endTime, classId } },
      { schoolId, user },
    ) => {
      if (!user.id) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const lesson = await prisma.lesson.findUnique({
        where: {
          id,
          schoolId,
        },
      });
      if (!lesson) throw createServiceError('Aucune matière trouvé');

      if (startTime || endTime) {
        const conflict = await prisma.lesson.findFirst({
          where: {
            schoolId,
            id: { not: id },

            startTime: {
              lt: endTime,
            },

            endTime: {
              gt: startTime,
            },
          },
        });
        if (conflict) {
          throw createServiceError(
            'La classe a déjà un cours dans cette période',
          );
        }
      }

      return await prisma.lesson.update({
        where: {
          id,
          schoolId,
        },
        data: {
          startTime: startTime ? startTime : lesson.startTime,
          endTime: endTime ? endTime : lesson.endTime,
          day: day ? day : lesson.day,
        },
      });
    },
    deleteLesson: async (_, { id }, { user, schoolId }) => {
      if (!user.id) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const checked = await isAdmin({
        context: { userId: user?.id, schoolId },
      });

      if (!checked.success)
        throw createServiceError(
          checked.message || 'Permission non accordée',
          403,
        );

      const exist = await prisma.lesson.findUnique({
        where: {
          id,
        },
      });
      if (!exist) throw createServiceError('Leçon introuvable');

      const lesson = await prisma.lesson.delete({
        where: {
          id,
        },
      });
      return {
        ok: true,
        message: 'Leçon supprimer avec succès.',
      };
    },
  },
  ClassTeacher: {
    teacher: async (parent) => {
      if (!parent.schoolId) return null;
      const teachers = await prisma.teacher.findMany({
        where: {
          schoolUser: {
            schoolId: parent.schoolId,
          },
        },
      });
      return teachers;
    },
    class: async (parent) => {
      if (!parent.schoolId) return null;
      return await prisma.class.findMany({
        where: {
          schoolId: parent.schoolId,
        },
      });
    },
  },
  Lesson: {
    classSubject: async (parent) => {
      const classSubject = await prisma.classSubjects.findFirst({
        where: {
          lessons: {
            some: {
              id: parent.id,
            },
          },
        },
      });
      return classSubject;
    },
  },
};
