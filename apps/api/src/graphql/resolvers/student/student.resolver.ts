import { prisma, Prisma } from '@stackschool/db';
import { Resolvers, StudentStatus, TransportMode } from '../../types.generated';
import { createServiceError } from '../../../utils/api-errors';
import { checkRole, isAdmin } from '../../../lib/verify-role';
import { createStudentSchema, RelationType } from '@stackschool/shared';
import { safeValidateSchema } from '../../../utils/validate-schema.util';

export const studentResolver: Resolvers = {
  Query: {
    getSchoolStudents: async (_, { input }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!input) {
        throw createServiceError('Données manquantes', 400);
      }
      const {
        page = 0,
        limit = 10,
        searchTerm,
        classId,
        level,
        sort,
        section,
        teacherId,
      } = input;
      const roleChecked = await checkRole({
        context: { schoolId, userId: user.id },
        roles: ['ADMIN', 'TEACHER'],
      });
      if (!roleChecked.success) {
        throw createServiceError(roleChecked.message!, 403);
      }
      const skip = page * limit;
      const search = searchTerm?.trim();

      let whereClause: Prisma.StudentWhereInput = {
        schoolId,
        deletedAt: null,
      };

      if (teacherId) {
        whereClause.schoolClass = {
          group: {
            some: {
              classSubjects: {
                some: { teacherId },
              },
            },
          },
        };
      }

      if (level || section) {
        whereClause.schoolClass = {
          ...(level && { level }),
          ...(section !== undefined && { section }),
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

      let orderBy: Prisma.StudentOrderByWithRelationInput = {
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
            enrollmentYear: sort.order?.toLocaleLowerCase() as Prisma.SortOrder,
          };
        }
      }

      const [total, students] = await Promise.all([
        prisma.student.count({ where: whereClause }),
        prisma.student.findMany({
          where: whereClause,
          take: limit,
          skip,
          orderBy,
        }),
      ]);
      return {
        data: students?.map((s) => ({
          ...s,
          status: s.status as StudentStatus,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },

    student: async (_, { id }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);

      const checkedRole = await checkRole({
        context: { schoolId, userId: user.id },
        roles: ['TEACHER', 'ADMIN', 'PARENT'],
      });

      if (!checkedRole.success) {
        throw createServiceError(checkedRole.message || 'Accès refusé', 403);
      }
      const student = await prisma.student.findUnique({
        where: { id, schoolId },
      });
      if (!student) throw createServiceError('Élève introuvable', 404);

      return {
        ...student,
        status: student.status as StudentStatus,
        transportMode: student.transportMode as TransportMode,
      };
    },
  },

  Mutation: {
    updateStudent: async (
      _,
      { studentId, data: studentData, schoolId },
      context,
    ) => {
      if (!context.user) throw createServiceError('Non authentifié', 401);

      const { success, data, errors } = safeValidateSchema(
        createStudentSchema,
        studentData,
      );

      if (!success)
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation',
          400,
          errors,
        );

      const adminCheck = await isAdmin({
        context: { schoolId, userId: context.user.id },
      });

      if (!adminCheck?.success) {
        throw createServiceError(adminCheck?.message || 'Accès refusé', 403);
      }

      try {
        const existingStudent = await prisma.student.findUnique({
          where: { id: studentId, schoolId },
          include: {
            schoolUser: {
              select: {
                user: true,
              },
            },
          },
        });

        if (!existingStudent || existingStudent.schoolId !== schoolId) {
          throw createServiceError('Élève introuvable dans cette école', 404);
        }

        const {
          firstname,
          lastname,
          gender,
          address,
          parentData,
          matricule,
          medicalCondition,
          phoneNumber,
          allergies,
          isActive,
          classId,
          birthCertificateNumber,
          birthPlace,
          birthDate,
          enrollmentYear,
          nationality,
          enrollmentDate,
          bloodGroup,
          previousClass,
          previousSchool,
          status,
          email,
        } = data!;

        return await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: existingStudent.schoolUser?.user?.id },
            data: {
              email,
              phoneNumber,
              profile: {
                update: {
                  firstname,
                  lastname,
                  gender,
                  address,
                },
              },
            },
          });
          if (parentData) {
            let parentIdToLink = parentData?.parentId;

            if (parentData?.mode === 'CREATE') {
              let parentUser = await tx.user.findUnique({
                where: {
                  phoneNumber: parentData?.newParent?.phoneNumber,
                },
              });
              if (!parentUser) {
                parentUser = await tx.user.create({
                  data: {
                    phoneNumber: parentData.newParent?.phoneNumber,
                    isActive: false,
                    hasMembership: true,
                    profileCompleted: true,
                    profile: {
                      create: {
                        firstname: parentData.newParent?.firstname,
                        lastname: parentData.newParent?.lastname,
                        address: parentData.newParent?.address,
                      },
                    },
                  },
                });
              }
              const newParent = await tx.parent.create({
                data: {
                  profession: parentData.newParent?.profession,
                  schoolUser: {
                    create: {
                      role: 'PARENT',
                      userId: parentUser?.id,
                      schoolId,
                    },
                  },
                },
              });
              parentIdToLink = newParent.id;
            }
            if (parentIdToLink) {
              await tx.parentStudent.upsert({
                where: {
                  parentId_studentId: { parentId: parentIdToLink, studentId },
                },
                create: {
                  studentId,
                  parentId: parentIdToLink,
                  relationType: (parentData.newParent?.relationType ||
                    'OTHER') as RelationType,
                },
                update: {}, // On ne change rien si le lien existe déjà
              });
            }
          }
          return await tx.student.update({
            where: { id: studentId },
            data: {
              matricule: matricule,
              classId: classId,
              enrollmentYear: enrollmentYear ?? '',
              birthDate: birthDate,
              birthPlace: birthPlace,
              nationality: nationality,
              bloodGroup: bloodGroup,
              allergies: allergies,
              birthCertificateNumber: birthCertificateNumber,
              previousSchool: previousSchool,
              previousClass: previousClass,
              enrollmentDate: enrollmentDate
                ? new Date(enrollmentDate)
                : undefined,
              status: status ?? undefined,
            },
          });
        });
      } catch (error) {
        console.error('Erreur update élève:', error);
        throw createServiceError('Erreur lors de la mise à jour', 500, error);
      }
    },

    deleteStudents: async (
      _,
      { studentIds, schoolId, soft = true },
      context,
    ) => {
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
            schoolUserId: true,
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
              deletedAt: new Date(),
            },
          });

          // On désactive aussi le User associé pour empêcher la connexion
          const schoolUserIds = exist.map((s) => s.schoolUserId);
          await prisma.user.updateMany({
            where: { memberships: { some: { id: { in: schoolUserIds } } } },
            data: { isActive: false },
          });

          return {
            ok: true,
            message: `${studentIds.length} élève(s) archivé(s)`,
          };
        } else {
          // Hard Delete
          const schoolUserIds = exist.map((s) => s.schoolUserId);

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
  Student: {
    user: async (parent, _, { loaders }) => {
      return await loaders.userLoader.load(parent.schoolUserId);
    },
    profile: async (parent) => {
      if (!parent?.profileId) return null;
      return await prisma.profile.findUnique({
        where: {
          id: parent.profileId,
        },
      });
    },
    schoolClass: async (parent) => {
      if (!parent?.classId) return null;
      return await prisma.class.findUnique({
        where: {
          id: parent.classId,
        },
      });
    },
    parents: async (parent, _, { schoolId }) => {
      const parentStudent = await prisma.parentStudent.findMany({
        where: {
          studentId: parent.id,
        },
        include: {
          parent: true,
        },
      });

      return parentStudent.map((ps) => ({
        ...ps,
        ...ps.parent,
      }));
    },
  },

  Parent: {
    user: async (parent, _, { loaders }) => {
      return await loaders.userLoader.load(parent.schoolUserId);
    },
  },
};
