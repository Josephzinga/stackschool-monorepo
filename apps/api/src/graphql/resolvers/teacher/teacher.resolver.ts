import { prisma } from '@stackschool/db';
import { Day, Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole, isAdmin } from '../../../lib/verify-role'; // Import corrigé

export const teacherResolver: Resolvers = {
  Query: {
    getSchoolTeachers: async (_, { input }, context) => {
      try {
        if (!context.user) throw createServiceError('Non authentifié', 401);
        if (!input) {
          throw createServiceError('Données manquantes', 400);
        }
        const {
          schoolId,
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
        const whereClause: any = {
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
          whereClause.supervisedClasses = { some: {} };
        }

        if (classId) {
          // Le prof est lié à la classe soit comme superviseur, soit comme enseignant
          whereClause.OR = [
            { supervisedClasses: { some: { id: classId } } },
            { classTeacher: { some: { classId: classId } } },
          ];
          // Attention: Si on a déjà un OR pour la recherche, il faut combiner avec AND
        }

        // 3. Filtre de recherche (si présent)
        if (search) {
          const searchCondition = {
            OR: [
              { specialization: { contains: search, mode: 'insensitive' } },
              {
                schoolUser: {
                  user: {
                    profile: {
                      lastname: { contains: search, mode: 'insensitive' },
                    },
                  },
                },
              },
              {
                schoolUser: {
                  user: {
                    profile: {
                      firstname: { contains: search, mode: 'insensitive' },
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
            if (!whereClause.AND) whereClause.AND = [];
            whereClause.AND.push(searchCondition);
          }
        }

        const [total, teachers] = await Promise.all([
          prisma.teacher.count({ where: whereClause }),
          prisma.teacher.findMany({
            where: whereClause,
            take: limit,
            skip,
            select: {
              id: true,
              diploma: true,
              isActive: true,
              specialization: true,
              schoolUserId: true,
              classTeacher: {
                select: {
                  class: {
                    select: {
                      id: true,
                      name: true,
                      level: true,
                    },
                  },
                },
              },
              schoolUser: {
                select: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      phoneNumber: true,
                      profile: {
                        select: {
                          firstname: true,
                          lastname: true,
                          photo: true,
                          gender: true,
                        },
                      },
                    },
                  },
                },
              },
              supervisedClasses: true,
            },
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
          data: teachers.map((t) => ({
            ...t,
            user: t.schoolUser.user as any,
            classes: t.classTeacher.map((c) => ({
              id: c.class.id,
              name: c.class.name,
              level: c.class.level,
            })),
          })),
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        console.error('Erreur recherche profs:', error);
        throw createServiceError('Erreur lors de la recherche', 500, error);
      }
    },

    teacher: async (_, { id, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);
      const checkedRole = await checkRole({
        context: { schoolId, userId: context.user.id },
        roles: ['TEACHER', 'ADMIN'],
      });
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
              classTeacher: {
                deleteMany: {}, // On supprime tout (simple et efficace pour une liste complète)
                create:
                  data.classIds?.map((classId) => ({
                    classId: classId!,
                  })) || [],
              },
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
