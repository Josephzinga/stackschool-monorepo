import { createServiceError } from '../../../utils/api-errors';
import { Resolvers } from '../../types.generated';
import { prisma } from '@stackschool/db';
import { checkRole } from '../../../lib/verify-role';
import { format, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  canTransition,
  checkEventConflicts,
  createLessonSchema,
  dayMapping,
  Event,
  REFERENCE_DATE,
  updateLessonSchema,
} from '@stackschool/shared';
import { safeValidateSchema } from '../../../utils/validate-schema.util';

export const lessonMutationResolver: Resolvers = {
  Mutation: {
    createLesson: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError(
          "Identifiant de l'établissement est manquant",
          400,
        );

      const { success, errors, data } = safeValidateSchema(
        createLessonSchema,
        input,
      );
      if (!success)
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation',
          400,
          errors,
        );

      if (!data) return null;
      const { startTime, endTime, day, subjectId, teacherId, groupId, mode } =
        data;

      // 1. Vérification des droits et récupération du membre
      const checked = await checkRole({
        context: { userId: user.id, schoolId },
        roles: ['TEACHER', 'ADMIN'],
      });

      console.log('CheckedRole', checked);

      if (!checked.success || !checked.member)
        throw createServiceError(
          checked?.message || 'Permission non accordée',
          403,
        );

      const member = checked.member;

      // Sécurité : Si c'est un prof, il ne peut créer que pour lui-même
      if (member.role === 'TEACHER' && teacherId !== member.teacher?.id) {
        throw createServiceError(
          'Vous ne pouvez pas créer une leçon pour un autre professeur',
          403,
        );
      }

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

      if (!currentCS)
        throw createServiceError(
          'Assignation (matière/classe/prof) introuvable',
        );

      // 3. VÉRIFICATION DES CONFLITS
      const existingLessons = await prisma.lesson.findMany({
        where: {
          schoolId,
          day,
          OR: [
            { classSubject: { groupId: currentCS.groupId } },
            { classSubject: { teacherId: currentCS.teacherId } },
          ],
        },
        include: {
          classSubject: {
            select: {
              subjectId: true,
              groupId: true,
              teacherId: true,
            },
          },
        },
      });

      const newEvent: Event = {
        startTime,
        endTime,
        daysOfWeek: [dayMapping[day]],
      };
      const existingEvents: Event[] = existingLessons.map((l) => ({
        startTime: format(l.startTime, 'HH:mm'),
        endTime: format(l.endTime, 'HH:mm'),
        daysOfWeek: [dayMapping[l.day]],
      }));

      // vérification de conflict horaires
      const hasConflict = checkEventConflicts(newEvent, existingEvents);

      if (hasConflict) {
        throw createServiceError(
          `Conflit d'horaire : ${
            mode === 'CLASS'
              ? `Le professeur est déjà occupé sur cette plage`
              : `La classe a déjà un cours sur cette plage`
          }`,
        );
      }

      // 4. Création
      return prisma.lesson.create({
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

      if (!checked?.success || !checked.member) {
        throw createServiceError(
          checked?.message || 'Permission non accordée',
          403,
        );
      }

      const member = checked.member;

      const lesson = await prisma.lesson.findUnique({
        where: { id, schoolId },
        include: {
          classSubject: {
            select: { teacherId: true },
          },
        },
      });

      if (!lesson) throw createServiceError('Leçon introuvable', 404);

      // Sécurité : Si prof, vérification de la propriété
      if (
        member.role === 'TEACHER' &&
        lesson.classSubject.teacherId !== member.teacher?.id
      ) {
        throw createServiceError(
          "Vous n'êtes pas autorisé à modifier le statut de cette leçon",
          403,
        );
      }

      if (!canTransition(lesson.status, status)) {
        throw createServiceError(
          `Transition de statut impossible de ${lesson.status} vers ${status}`,
          400,
        );
      }

      return await prisma.lesson.update({
        where: { id },
        data: { status },
      });
    },

    updateLesson: async (_, { input }, { schoolId, user }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
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

      const checked = await checkRole({
        context: { schoolId, userId: user.id },
        roles: ['TEACHER', 'ADMIN'],
      });

      if (!checked.success || !checked.member)
        throw createServiceError(
          checked.message || 'Permission non accordée.',
          403,
        );

      const member = checked.member;
      const { id, day, startTime, endTime } = data!;

      const lesson = await prisma.lesson.findUnique({
        where: { id, schoolId },
        include: {
          classSubject: {
            select: { teacherId: true, groupId: true },
          },
        },
      });

      if (!lesson) throw createServiceError('Leçon introuvable', 404);

      // Sécurité : Propriété pour les profs
      if (
        member.role === 'TEACHER' &&
        lesson.classSubject.teacherId !== member.teacher?.id
      ) {
        throw createServiceError(
          "Vous n'êtes pas autorisé à modifier cette leçon",
          403,
        );
      }

      const start = startTime
        ? parse(
            `${day || lesson.day} ${startTime}`,
            'EEEE HH:mm',
            REFERENCE_DATE,
            { locale: enUS },
          )
        : lesson.startTime;
      const end = endTime
        ? parse(
            `${day || lesson.day} ${endTime}`,
            'EEEE HH:mm',
            REFERENCE_DATE,
            { locale: enUS },
          )
        : lesson.endTime;

      // Vérification des conflits si l'heure ou le jour change
      if (startTime || endTime || day) {
        const conflict = await prisma.lesson.findFirst({
          where: {
            schoolId,
            id: { not: id },
            day: day || lesson.day,
            OR: [
              { classSubject: { groupId: lesson.classSubject.groupId } },
              { classSubject: { teacherId: lesson.classSubject.teacherId } },
            ],
            startTime: { lt: end },
            endTime: { gt: start },
          },
        });
        if (conflict) {
          throw createServiceError(
            'Conflit détecté : la classe ou le professeur est déjà occupé sur ce créneau',
          );
        }
      }

      return await prisma.lesson.update({
        where: { id },
        data: {
          startTime: start,
          endTime: end,
          day: (day as any) || lesson.day,
        },
      });
    },

    deleteLesson: async (_, { id }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      const checked = await checkRole({
        context: { userId: user.id, schoolId },
        roles: ['ADMIN', 'TEACHER'],
      });

      if (!checked.success || !checked.member)
        throw createServiceError(
          checked.message || 'Permission non accordée',
          403,
        );

      const member = checked.member;

      const exist = await prisma.lesson.findUnique({
        where: { id, schoolId },
        include: {
          classSubject: { select: { teacherId: true } },
        },
      });

      if (!exist) throw createServiceError('Leçon introuvable', 404);

      // Sécurité prof
      if (
        member.role === 'TEACHER' &&
        exist.classSubject.teacherId !== member.teacher?.id
      ) {
        throw createServiceError(
          "Vous n'êtes pas autorisé à supprimer cette leçon",
          403,
        );
      }

      await prisma.lesson.delete({ where: { id } });

      return {
        ok: true,
        message: 'Leçon supprimée avec succès.',
      };
    },
  },
};
