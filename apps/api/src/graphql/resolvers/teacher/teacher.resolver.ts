import { prisma } from '@stackschool/db';
import { Day, Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { isAdmin } from '../../../lib/verify-role';

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
        ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i),
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

    updateTeacher: async (_, { teacherId, data, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        const teacher = await prisma.teacher.findUnique({
          where: { id: teacherId },
          include: { schoolUser: true }
        });

        if (!teacher || teacher.schoolUser.schoolId !== schoolId) {
          throw createServiceError('Enseignant introuvable dans cette école', 404);
        }

        await prisma.$transaction(async (tx) => {
          // 1. Mise à jour User/Profile
          await tx.user.update({
            where: { id: teacher.schoolUser.userId },
            data: {
              email: data.email || undefined,
              phoneNumber: data.phoneNumber || undefined,
              profile: {
                update: {
                  firstname: data.firstname,
                  lastname: data.lastname,
                  gender: data.gender,
                }
              }
            }
          });

          // 2. Mise à jour Teacher
          await tx.teacher.update({
            where: { id: teacherId },
            data: {
              diploma: data.diploma,
              specialization: data.specialization,
              // Mise à jour des classes (Sync)
              classTeacher: {
                deleteMany: {}, // On supprime tout (simple et efficace pour une liste complète)
                create: data.classIds?.map(classId => ({
                  classId: classId!
                })) || []
              }
            }
          });
        });

        return { ok: true, message: 'Enseignant mis à jour avec succès' };

      } catch (error) {
        console.error('Erreur update prof:', error);
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    }
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
