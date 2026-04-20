import { prisma, Prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole, checkSchoolId, checkUser } from '../../../lib/verify-role';

export const teacherQueryResolver: Resolvers = {
  Query: {
    getSchoolTeachers: async (_, { input }, { user, schoolId }) => {
      try {
        checkUser(user);
        checkSchoolId(schoolId);

        if (!input) {
          throw createServiceError('Données manquantes', 400);
        }

        const {
          page = 0,
          limit = 10,
          searchTerm,
          classId,
          subjectId,
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

        if (subjectId) {
          whereClause.assignments = {
            some: {
              classSubject: {
                subjectId,
              },
            },
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
              assignments: {
                some: {
                  classSubject: {
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
      if (!schoolId)
        throw createServiceError(
          "Identifiant de l'établissement est manquant",
          400,
        );

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
};
