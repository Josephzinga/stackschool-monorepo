import { prisma } from '@stackschool/db';
import { Resolvers } from '../types.generated';
import { createServiceError } from '../../utils/api-errors';
import { isAdmin } from '../../lib/verify-admin';

export const teacherResolver: Resolvers = {
  Mutation: {
    deleteTeachers: async (_, { teacherIds, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      // 1. Vérification Admin
      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });
      
      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        // 2. Suppression
        // On supprime les SchoolUser liés à ces profs dans cette école.
        // Cela supprimera le Teacher en cascade (si onDelete: Cascade est configuré dans Prisma)
        // Sinon, on doit supprimer le Teacher d'abord.
        
        // Récupérons les schoolUserIds
        const teachers = await prisma.teacher.findMany({
          where: {
            id: { in: teacherIds as string[] },
            schoolUser: { schoolId } // Sécurité : on ne supprime que ceux de cette école
          },
          select: { schoolUserId: true }
        });

        const schoolUserIds = teachers.map(t => t.schoolUserId);

        if (schoolUserIds.length === 0) {
          return { ok: false, message: "Aucun enseignant trouvé à supprimer." };
        }

        // Suppression des SchoolUser (ce qui supprime le Teacher et les liens classes)
        await prisma.schoolUser.deleteMany({
          where: {
            id: { in: schoolUserIds }
          }
        });

        return {
          ok: true,
          message: `${schoolUserIds.length} enseignant(s) supprimé(s) avec succès.`
        };

      } catch (error) {
        console.error('Erreur suppression profs:', error);
        throw createServiceError('Erreur lors de la suppression', 500, error);
      }
    }
  },

  School: {
    // Resolver pour la liste des enseignants d'une école
    teachers: async (parent, args) => {
      // ... (Code existant inchangé, je le remets pour ne pas l'écraser)
      const schoolId = parent.id;
      const { take = 10, skip = 0, searchTerm } = args;

      const whereClause: any = {
        schoolUser: {
          schoolId,
        }
      };

      if (searchTerm) {
        whereClause.OR = [
          { specialization: { contains: searchTerm, mode: 'insensitive' } },
          {
            schoolUser: {
              user: {
                profile: {
                  OR: [
                    { firstname: { contains: searchTerm, mode: 'insensitive' } },
                    { lastname: { contains: searchTerm, mode: 'insensitive' } }
                  ]
                }
              }
            }
          }
        ];
      }

      const teachers = await prisma.teacher.findMany({
        where: whereClause,
        take: take || 10,
        skip: skip || 0,
        include: {
          schoolUser: {
            include: {
              user: {
                include: { profile: true }
              }
            }
          },
          supervisedClasses: true,
        },
        orderBy: { createdAt: 'desc' }
      });

      return teachers.map(t => ({
        ...t,
        user: t.schoolUser.user as any
      }));
    },
  },
  
  Teacher: {
    weeklyHours: async (parent) => {
      // Calcul du volume horaire
      const lessons = await prisma.lesson.findMany({
        where: { teacherId: parent.id }
      });
      
      let totalMinutes = 0;
      lessons.forEach(l => {
        const diffMs = l.endTime.getTime() - l.startTime.getTime();
        totalMinutes += diffMs / (1000 * 60);
      });

      return parseFloat((totalMinutes / 60).toFixed(1));
    }
  }
};
