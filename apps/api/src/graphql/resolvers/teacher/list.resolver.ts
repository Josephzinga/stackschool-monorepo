import { createServiceError } from '../../../utils/api-errors';
import { prisma } from '@stackschool/db';
import { Resolvers } from '../../types.generated';

export const teacherListResolver: Resolvers = {
  Query: {
    getSchoolTeachers: async (
      _,
      {
        schoolId,
        page = 0,
        limit = 10,
        searchTerm,
        classId,
        specialization,
        isActive,
        isSupervisor,
      },
      context,
    ) => {
      try {
        if (!context.user) throw createServiceError('Non authentifié', 401);

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
  },
};
