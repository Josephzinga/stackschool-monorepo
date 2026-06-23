import { Attendance, Prisma, prisma } from '@stackschool/db';
import {
  checkRole,
  checkSchoolId,
  checkUser,
} from '../../../../lib/verify-role';
import { createServiceError } from '../../../../utils/api-errors';
import { Resolvers } from '../../../types.generated';
import { safeValidateSchema } from '../../../../utils/validate-schema.util';
import {
  markAttendanceSchema,
  AttendanceStatusEnum,
} from '@stackschool/shared';

export const markStudentAttendanceResolver: Resolvers = {
  Mutation: {
    markAttendance: async (_, { input }, { user, schoolId }) => {
      checkUser(user);
      checkSchoolId(schoolId);
      const {
        data,
        success: isValid,
        errors,
      } = safeValidateSchema(markAttendanceSchema, { attendances: input });

      if (!isValid)
        throw createServiceError(
          errors?.[0]?.message || 'Erreur de validation de donnée',
        );

      const { success, message, member } = await checkRole({
        context: { userId: user.id, schoolId },
        roles: ['ADMIN', 'TEACHER'],
      });

      if (!success)
        throw createServiceError(message || 'Permisson non accorder', 401);

      const now = new Date();
      let markedAttendance: Attendance | null | undefined = null;
      try {
        markedAttendance = await prisma.$transaction(async (tx) => {
          for (const item of data?.attendances!) {
            let schoolUserId: string | undefined;
            let classSubjectId: string = '';
            let studentWhereClause: Prisma.StudentWhereInput = {
              schoolId,
            };

            if (member?.role === 'TEACHER' && member?.teacher?.id) {
              const classSubject = await tx.classSubjects.findFirst({
                where: {
                  assignments: {
                    teacherId: member.teacher.id,
                    lessons: {
                      some: {
                        status: 'ONGOING',
                      },
                    },
                  },
                  subjectId: item.subjectId,
                  group: {
                    classes: {
                      some: {
                        id: item.classId!,
                      },
                    },
                  },
                },
                select: {
                  id: true,
                },
              });

              if (!classSubject)
                throw createServiceError(
                  'Cette lesson ne pas encore été demarer',
                );
              classSubjectId = classSubject?.id ?? '';
            }
            switch (item.userType) {
              case 'STUDENT':
                if (member?.role === 'TEACHER' && member.teacher?.id) {
                  studentWhereClause.schoolClass = {
                    ...(item.classId && {
                      id: item.classId,
                    }),
                    group: {
                      classSubjects: {
                        some: {
                          assignments: {
                            teacherId: member.teacher.id,
                          },
                        },
                      },
                    },
                  };
                }
                const student = await tx.student.findFirst({
                  where: studentWhereClause,
                  select: {
                    id: true,
                    schoolUser: {
                      select: {
                        id: true,
                      },
                    },
                  },
                });

                console.log('Student', student);
                schoolUserId = student?.schoolUser.id;
                break;
              case 'TEACHER':
                const teacher = await tx.teacher.findFirst({
                  where: {
                    schoolUser: { schoolId },
                    id: item.id,
                  },
                  select: {
                    id: true,
                    schoolUser: {
                      select: {
                        id: true,
                      },
                    },
                  },
                });
                schoolUserId = teacher?.schoolUser.id;
                break;
            }

            if (!schoolUserId)
              throw createServiceError('Aucune valeur trouvé pour cette école');
            if (!item.status) throw createServiceError('Status manquant');

            return await tx.attendance.upsert({
              where: {
                schoolUserId_date_type_classSubjectId: {
                  schoolUserId,
                  date: item.date,
                  type: item.isSubjectMode ? 'SUBJECT' : 'DAILY',
                  classSubjectId,
                },
              },
              create: {
                schoolId,
                schoolUserId,
                status: item.status,
                checkInTime: now,
                recordedBy: member?.id,
                date: item.date,
                classSubjectId,
                type: item.isSubjectMode ? 'SUBJECT' : ('DAILY' as any),
              },
              update: {
                status: item.status,
                checkInTime: now,
              },
            });
          }
        });
        // on retourne le dernier du tableau
        return {
          id: markedAttendance?.id,
          status: markedAttendance?.status as AttendanceStatusEnum,
          date: markedAttendance?.date,
          recordedBy: markedAttendance?.recordedBy as any, // c'est un type User mais je retourne l'id ici
          checkInTime: markedAttendance?.checkInTime,
          type: markedAttendance?.type,
        };
      } catch (error: any) {
        throw createServiceError(error?.message || 'Erreur interne du serveur');
      }
    },
  },
};
