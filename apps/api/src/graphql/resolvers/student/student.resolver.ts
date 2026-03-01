import { prisma } from '@stackschool/db';
import { Resolvers, StudentStatus } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole, isAdmin } from '../../../lib/verify-role';

export const studentResolver: Resolvers = {
  Query: {
    getSchoolStudents: async (_, { input }, context) => {
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
        level,
        sort,
        section,
      } = input;
      const roleChecked = await checkRole({
        context: { schoolId, userId: context.user.id },
        roles: ['ADMIN', 'TEACHER'],
      });
      if (!roleChecked.success) {
        throw createServiceError(roleChecked.message!, 403);
      }
      const skip = page * limit;
      const search = searchTerm?.trim();

      let whereClause: any = {
        schoolId,
        deletedAt: null, // Par défaut, on ne montre pas les supprimés
      };

      if (level) {
        whereClause.schoolClass = {
          level,
        };
      }
      if (section) {
        whereClause.schoolClass = {
          ...whereClause.schoolClass,
          section,
        };
      }
      if (classId) {
        whereClause = {
          ...whereClause,
          ...(classId && { classId }),
        };
      }

      if (search) {
        whereClause.OR = [
          { matricule: { contains: search, mode: 'insensitive' } },
          {
            profile: {
              OR: [
                { firstname: { contains: search, mode: 'insensitive' } },
                { lastname: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        ];
      }
      
      let orderBy: any = {
        profile: {
          firstname: 'asc',
        },
      };
      if (sort) {
        if (sort?.field === 'lastname' || sort?.field === 'firstname') {
          orderBy.profile = {
            [sort.field as string]: sort.order?.toLowerCase(),
          };
        }
        if (sort?.field === 'enrolementYear') {
          orderBy = {
            ...orderBy,
            enrollmentYear: sort.order?.toLowerCase(),
          };
        }
      }

      const [total, students] = await Promise.all([
        prisma.student.count({ where: whereClause }),
        prisma.student.findMany({
          where: whereClause,
          take: limit,
          skip,
          include: {
            schoolClass: {
              select: {
                id: true,
                level: true,
                name: true,
                section: true,
              },
            },
            schoolUser: {
              select: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    username: true,
                    phoneNumber: true,
                    profile: {
                      select: {
                        id: true,
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
            parentStudent: true,
          },
          orderBy,
        }),
      ]);
      return {
        data: students?.map((s) => ({
          ...s,
          status: s.status as StudentStatus,
          user: {
            profile: {
              id: s.schoolUser.user.profile?.id!,
              firstname: s.schoolUser.user.profile?.firstname ?? '',
              lastname: s.schoolUser.user.profile?.lastname ?? '',
              photo: s.schoolUser.user.profile?.photo ?? '',
              gender: s.schoolUser.user.profile?.gender!,
            },
            id: s.schoolUser.user.id,
            username: s.schoolUser.user.username ?? '',
            email: s.schoolUser.user.email ?? '',
            phoneNumber: s.schoolUser.user.phoneNumber ?? '',
          },
          parents: s.parentStudent,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },

    student: async (_, { id, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const checkedRole = await checkRole({
        context: { schoolId, userId: context.user.id },
        roles: ['TEACHER', 'ADMIN', 'PARENT'],
      });

      if (!checkedRole.success) {
        throw createServiceError(checkedRole.message || 'Accès refusé', 403);
      }
      const student = await prisma.student.findUnique({
        where: { id, schoolId: context.user.schoolId },
        select: {
          id: true,
          matricule: true,
          enrollmentYear: true,
          fatherName: true,
          motherName: true,
          birthDate: true,
          birthPlace: true,
          nationality: true,
          status: true,
          profile: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              gender: true,
              photo: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  phoneNumber: true,
                  username: true,
                },
              },
            },
          },
          schoolClass: true,
          parentStudent: {
            select: {
              id: true,
              relationType: true,
              parent: {
                select: {
                  id: true,
                  profession: true,
                  schoolUser: {
                    select: {
                      user: {
                        select: {
                          id: true,
                          phoneNumber: true,
                          email: true,
                          profile: {
                            select: {
                              id: true,
                              photo: true,
                              firstname: true,
                              lastname: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!student) throw createServiceError('Élève introuvable', 404);

      return {
        ...student,
        status: student.status as StudentStatus,
        profile: {
          id: student.profile.id,
          firstname: student.profile.firstname ?? '',
          lastname: student.profile.lastname ?? '',
          photo: student.profile.photo ?? null,
        },
        user: {
          id: student.profile.user.id,
          email: student.profile.user.email ?? '',
          phoneNumber: student.profile.user.phoneNumber,
          username: student.profile.user.username ?? '',
        },
      };
    },
  },

  Mutation: {
    updateStudent: async (_, { studentId, data, schoolId }, context) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });
      
      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          include: { profile: true },
        });

        if (!student || student.schoolId !== schoolId) {
          throw createServiceError('Élève introuvable dans cette école', 404);
        }

        await prisma.$transaction(async (tx) => {
          // 1. Mise à jour Profile
          await tx.profile.update({
            where: { id: student.profileId },
            data: {
              firstname: data.firstname,
              lastname: data.lastname,
              gender: data.gender,
            },
          });

          // 2. Mise à jour Student
          await tx.student.update({
            where: { id: studentId },
            data: {
              matricule: data.matricule,
              classId: data.classId,
              enrollmentYear: data.enrollmentYear ?? '',
              birthDate: data.birthDate,
              birthPlace: data.birthPlace,
              nationality: data.nationality,
              fatherName: data.fatherName,
              motherName: data.motherName,
            },
          });
        });

        return { ok: true, message: 'Élève mis à jour avec succès' };
      } catch (error) {
        console.error('Erreur update élève:', error);
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    },
    
    deleteStudents: async (_, { studentIds, schoolId, soft = true }, context) => {
      try {
        if (!context.user) throw createServiceError('Non authentifié', 401);

        const adminCheck = await isAdmin({
          context: { schoolId, userId: context.user.id },
        });

        if (!adminCheck?.success) {
          throw createServiceError(adminCheck.message!, 403);
        }

        const exist = await prisma.student.findMany({
          where: {
            id: { in: studentIds as string[] },
            schoolId,
          },
          select: {
            id: true,
            schoolUserId: true
          },
        });

        if (!exist || exist.length === 0) {
          throw createServiceError('Aucun élève trouvé', 404);
        }

        if (soft) {
          // Soft Delete : On met à jour le statut et deletedAt
          await prisma.student.updateMany({
            where: {
              id: { in: studentIds as string[] },
              schoolId,
            },
            data: {
              status: 'INACTIVE',
              deletedAt: new Date()
            }
          });
          
          // On désactive aussi le User associé pour empêcher la connexion
          const schoolUserIds = exist.map(s => s.schoolUserId);
          await prisma.user.updateMany({
             where: { memberships: { some: { id: { in: schoolUserIds } } } },
             data: { isActive: false }
          });
          
          return {
            ok: true,
            message: `${studentIds.length} élève(s) archivé(s)`,
          };
        } else {
          // Hard Delete
          const schoolUserIds = exist.map(s => s.schoolUserId);
          
          await prisma.schoolUser.deleteMany({
            where: {
              id: { in: schoolUserIds },
            },
          });
          
          return {
            ok: true,
            message: `${studentIds.length} élève(s) supprimé(s) définitivement`,
          };
        }
      } catch (e) {
        const message = 'Erreur lors de la suppression.';
        throw createServiceError(message, 500, e);
      }
    },
  },
};
