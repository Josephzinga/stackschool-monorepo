import { createServiceError } from '../../../utils/api-errors';
import { Resolvers } from '../../types.generated';
import { ClassSubjects, prisma, TeacherAssignment } from '@stackschool/db';
import { checkRole } from '../../../lib/verify-role';
import { format, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  canTransition,
  checkEventConflicts,
  createLessonSchema,
  dayMapping,
  Event,
  lessonStatusConfig,
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
      const {
        startTime,
        endTime,
        day,
        subjectId,
        teacherId,
        groupId,
        classId,
        mode,
      } = data;

      // 1. Vérification des droits et récupération du membre
      const checked = await checkRole({
        context: { userId: user.id, schoolId },
        roles: ['TEACHER', 'ADMIN'],
      });

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

      const currentCS = await prisma.classSubjects.findUnique({
        where: {
          groupId_subjectId: { groupId: groupId, subjectId },
        },
        include: {
          assignments: true,
          subject: {
            select: {
              name: true,
            },
          },
          group: {
            include: {
              classes: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!currentCS)
        throw createServiceError(
          "Cette matière n'est pas enseigné dans cette Classe. ",
        );

      const assignments = await prisma.teacherAssignment.findUnique({
        where: {
          schoolId_classSubjectId_teacherId: {
            schoolId,
            classSubjectId: currentCS.id,
            teacherId,
          },
        },
      });
      if (!assignments) {
        throw createServiceError(
          `Le professeur n'enseigne pas ${currentCS.subject?.name} dans ${currentCS.group?.classes?.[0]?.name}`,
        );
      }

      const existingLessons = await prisma.lesson.findMany({
        where: {
          schoolId,
          day,
          OR: [
            {
              teacherAssignment: {
                classSubject: { groupId: currentCS.groupId },
              },
            },
            { teacherAssignmentId: teacherId },
          ],
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

      return prisma.lesson.create({
        data: {
          schoolId,
          teacherAssignmentId: assignments.id,
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
      });

      if (!lesson) throw createServiceError('Leçon introuvable', 404);

      // Sécurité : Si prof, vérification de la propriété
      if (
        member.role === 'TEACHER' &&
        lesson.teacherAssignmentId !== member.teacher?.id
      ) {
        throw createServiceError(
          "Vous n'êtes pas autorisé à modifier le statut de cette leçon",
          403,
        );
      }

      if (!canTransition(lesson.status, status)) {
        throw createServiceError(
          `Transition de statut impossible ${lesson.status} vers ${status}`,
          400,
        );
      }

      return prisma.lesson.update({
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
      try {
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
        const {
          id,
          day,
          startTime,
          endTime,
          subjectId,
          groupId,
          teacherId,
          mode,
        } = data!;

        const lesson = await prisma.lesson.findUnique({
          where: { id, schoolId },
          include: {
            teacherAssignment: {
              include: {
                classSubject: {
                  include: {
                    subject: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!lesson) throw createServiceError('Leçon introuvable', 404);

        if (lesson.status !== 'PLANNED') {
          throw createServiceError(
            `Cette leçon est déjà "${lessonStatusConfig[lesson.status].label.toLocaleUpperCase()}". Vous ne pouvez plus modifier sa ressource ou son horaire.`,
            400,
          );
        }

        if (
          member.role === 'TEACHER' &&
          lesson.teacherAssignmentId !== member.teacher?.id
        ) {
          throw createServiceError(
            "Vous n'êtes pas autorisé à modifier cette leçon",
            403,
          );
        }
        const isClassMode = mode === 'CLASS';

        const targetGroupId =
          groupId || lesson.teacherAssignment.classSubject.groupId;
        const targetTeacherId = teacherId || lesson.teacherAssignmentId;
        const targetSubjectId =
          subjectId || lesson.teacherAssignment.classSubject.subjectId;

        const shouldCheckClassSubject = Boolean(
          targetGroupId !== lesson.teacherAssignment?.classSubject?.groupId ||
          targetSubjectId !== lesson.teacherAssignment.classSubject.subjectId,
        );
        let currentCS: ClassSubjects | null = {
          ...lesson.teacherAssignment.classSubject,
        };
        if (shouldCheckClassSubject) {
          currentCS = await prisma.classSubjects.findUnique({
            where: {
              groupId_subjectId: {
                subjectId: targetSubjectId,
                groupId: targetGroupId,
              },
            },
          });
        }
        if (!currentCS) {
          throw createServiceError(
            `Cette matière n'est pas enseigné dans cette classe`,
          );
        }
        let assignment: TeacherAssignment | null = {
          ...lesson.teacherAssignment,
        };
        if (targetTeacherId !== lesson.teacherAssignmentId) {
          assignment = await prisma.teacherAssignment.findUnique({
            where: {
              schoolId_classSubjectId_teacherId: {
                schoolId,
                classSubjectId: currentCS.id,
                teacherId: targetTeacherId,
              },
            },
          });
        }
        if (!assignment) {
          throw createServiceError(
            `Cet professeur n'enseigne pas cette matière`,
          );
        }

        const activeDay = day || lesson.day;

        if (startTime || endTime || day) {
          const existingLessons = await prisma.lesson.findMany({
            where: {
              schoolId,
              day: activeDay,
              OR: [
                {
                  teacherAssignment: {
                    classSubject: {
                      groupId: targetGroupId,
                    },
                  },
                },
                { teacherAssignmentId: targetTeacherId },
              ],
            },
          });

          const hasConflict = checkEventConflicts(
            {
              startTime: startTime || format(lesson.startTime, 'HH:mm'),
              endTime: endTime || format(lesson.endTime, 'HH:mm'),
              daysOfWeek: [dayMapping[activeDay]],
            },
            existingLessons.map((l) => ({
              id: l.id,
              startTime: format(l.startTime, 'HH:mm'),
              endTime: format(l.endTime, 'HH:mm'),
              daysOfWeek: [dayMapping[l.day]],
            })),
            lesson.id,
          );
          if (hasConflict) {
            throw createServiceError(
              !isClassMode
                ? `Conflit détecté : la classe est déjà occupé sur ce créneau `
                : 'Conflit détecté : le professeur est déjà occupé sur ce créneau',
            );
          }
        }

        const start = startTime
          ? parse(
              `${day || lesson.day} ${startTime}`,
              'EEEE HH:mm',
              REFERENCE_DATE,
            )
          : lesson.startTime;
        const end = endTime
          ? parse(
              `${day || lesson.day} ${endTime}`,
              'EEEE HH:mm',
              REFERENCE_DATE,
            )
          : lesson.endTime;
        return await prisma.lesson.update({
          where: { id },
          data: {
            startTime: start,
            endTime: end,
            day: activeDay,
            teacherAssignmentId: assignment.id,
          },
        });
      } catch (err: any) {
        throw createServiceError(
          err?.message ||
            'Une erreur est survenue lors de la mise à jour du leçon',
        );
      }
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
          teacherAssignment: true,
        },
      });

      if (!exist) throw createServiceError('Leçon introuvable', 404);

      // Sécurité prof
      if (
        member.role === 'TEACHER' &&
        exist?.teacherAssignment.teacherId !== member.teacher?.id
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
