import { prisma, Prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole, isAdmin } from '../../../lib/verify-role';

export const teacherResolver: Resolvers = {
  Query: {
    getSchoolTeachers: async (_, { input }, { user, schoolId }) => {
      try {
        if (!user) throw createServiceError('Non authentifié', 401);
        if (!input) {
          throw createServiceError('Données manquantes', 400);
        }
        const {
          page = 0,
          limit = 10,
          searchTerm,
          classId,
          specialization,
          isActive,
          isSupervisor,
        } = input;

        const skip = page * limit;
        const search = searchTerm?.trim();

        // 1. Filtre de base : L'école
        const whereClause: Prisma.TeacherWhereInput = {
          schoolUser: { schoolId },
        };

        // 2. Filtres spécifiques
        if (isActive !== undefined && isActive !== null) {
          whereClause.isActive = isActive;
        }

        if (specialization) {
          whereClause.specialization = {
            contains: specialization,
            mode: 'insensitive',
          };
        }

        if (isSupervisor) {
          // On cherche ceux qui supervisent au moins une classe
          whereClause.supervisedClasses = {
            some: {
              id: { not: undefined },
            },
          };
        }

        if (classId) {
          whereClause.OR = [
            { supervisedClasses: { some: { id: classId } } },
            {
              classSubjects: {
                some: {
                  group: {
                    classes: {
                      some: {
                        id: classId,
                      },
                    },
                  },
                },
              },
            },
          ];
        }

        // 3. Filtre de recherche (si présent)
        if (search) {
          const searchCondition = {
            OR: [
              {
                specialization: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
              {
                schoolUser: {
                  user: {
                    profile: {
                      lastname: {
                        contains: search,
                        mode: 'insensitive' as Prisma.QueryMode,
                      },
                    },
                  },
                },
              },
              {
                schoolUser: {
                  user: {
                    profile: {
                      OR: [
                        {
                          firstname: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode,
                          },
                        },
                        {
                          lastname: {
                            contains: search,
                            mode: 'insensitive' as Prisma.QueryMode,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          };

          // Si on a déjà un OR (à cause de classId), on doit utiliser AND pour combiner
          if (whereClause.OR) {
            whereClause.AND = [
              { OR: whereClause.OR }, // La condition classId
              searchCondition, // La condition search
            ];
            delete whereClause.OR; // On nettoie l'ancien OR
          } else {
            // Sinon on ajoute simplement le AND avec la recherche
            const existingAnd = Array.isArray(whereClause.AND)
              ? whereClause.AND
              : whereClause.AND
                ? [whereClause.AND]
                : [];
            whereClause.AND = [...existingAnd, searchCondition];
          }
        }

        const [total, teachers] = await Promise.all([
          prisma.teacher.count(),
          prisma.teacher.findMany({
            where: whereClause,
            take: limit,
            skip,
            orderBy: {
              schoolUser: {
                user: {
                  profile: {
                    lastname: 'asc',
                  },
                },
              },
            },
          }),
        ]);
        return {
          data: teachers,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        throw createServiceError(
          'Erreur lors de la recupération des professeurs',
          500,
          error,
        );
      }
    },

    teacher: async (_, { id }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      const checkedRole = await checkRole({
        context: { schoolId, userId: user.id },
        roles: ['TEACHER', 'ADMIN'],
      });
      if (!checkedRole.success) {
        throw createServiceError(
          checkedRole.message || 'Accès refusé à cette école',
          403,
        );
      }
      const teacher = await prisma.teacher.findUnique({
        where: { id },
      });

      if (!teacher) throw createServiceError('Enseignant introuvable', 404);

      return teacher;
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
            schoolId,
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
          include: { schoolUser: true },
        });

        if (!teacher || teacher.schoolUser.schoolId !== schoolId) {
          throw createServiceError(
            'Enseignant introuvable dans cette école',
            404,
          );
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
                },
              },
            },
          });

          // 2. Mise à jour Teacher
          await tx.teacher.update({
            where: { id: teacherId },
            data: {
              diploma: data.diploma,
              specialization: data.specialization,
              // Mise à jour des classes (Sync)
            },
          });
        });

        return { ok: true, message: 'Enseignant mis à jour avec succès' };
      } catch (error) {
        console.error('Erreur update prof:', error);
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    },
  },

  Teacher: {
    weeklyHours: async (parent) => {
      const lessons = await prisma.lesson.findMany({
        where: {
          classSubject: {
            teacherId: parent.id,
          },
        },
      });

      let totalMinutes = 0;
      lessons.forEach((l) => {
        const diffMs = l.endTime.getTime() - l.startTime.getTime();
        totalMinutes += diffMs / (1000 * 60);
      });

      return parseFloat((totalMinutes / 60).toFixed(1));
    },

    user: async (parent, _, { loaders }) => {
      if (!parent.schoolUserId) return null;
      return await loaders.userLoader.load(parent.schoolUserId);
    },
    classSubjects: async (parent, _, { loaders }) => {
      return await prisma.classSubjects.findMany({
        where: {
          teacherId: parent.id,
        },
      });
    },
    lessons: async (parent) => {
      return await prisma.lesson.findMany({
        where: {
          classSubject: {
            teacherId: parent.id,
          },
        },
      });
    },
  },
};
