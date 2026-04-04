import { createServiceError } from '../../../utils/api-errors';
import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';
import { checkRole, isAdmin } from '../../../lib/verify-role';
import { parse } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  canTransition,
  REFERENCE_DATE,
  updateLessonSchema,
} from '@stackschool/shared';
import { safeValidateSchema } from '../../../utils/validate-schema.util';

export const lessonMutationResolver: Resolvers = {
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

      const start = parse(`${day} ${startTime}`, 'EEEE HH:mm', REFERENCE_DATE, {
        locale: enUS,
      });
      const end = parse(`${day} ${endTime}`, 'EEEE HH:mm', REFERENCE_DATE, {
        locale: enUS,
      });

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
    updateLesson: async (_, { input }, { schoolId, user }) => {
      if (!user.id) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const { data, errors, success } = safeValidateSchema(
        updateLessonSchema,
        input,
      );
      if (!success) {
        throw createServiceError(
          errors?.[0].message || 'Erreur de validation',
          400,
          errors,
        );
      }

      const checkedRole = await checkRole({
        context: { schoolId, userId: user.id },
        roles: ['TEACHER', 'ADMIN'],
      });

      const { id, day, startTime, endTime, groupId, subjectId } = data!;

      if (!checkedRole.success)
        throw createServiceError(
          checkedRole.message || 'Permission non accordée.',
        );
      const lesson = await prisma.lesson.findUnique({
        where: {
          id,
          schoolId,
        },
      });
      if (!lesson) throw createServiceError('Aucune matière trouvé');

      const start = parse(`${day} ${startTime}`, 'EEEE HH:mm', REFERENCE_DATE, {
        locale: enUS,
      });
      const end = parse(`${day} ${endTime}`, 'EEEE HH:mm', REFERENCE_DATE, {
        locale: enUS,
      });

      if (startTime || endTime) {
        const conflict = await prisma.lesson.findFirst({
          where: {
            schoolId,
            id: { not: id },

            startTime: {
              lt: end,
            },

            endTime: {
              gt: start,
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
          startTime: startTime ? start : lesson.startTime,
          endTime: endTime ? end : lesson.endTime,
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
};