import { Resolvers } from '../../types.generated';
import { Prisma, prisma } from '@stackschool/db';
import { createServiceError } from '../../../utils/api-errors';

export const lessonQueryResolver: Resolvers = {
  Query: {
    getLessons: async (parent, { filter }, { user, schoolId }) => {
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError(
          "Identifiant de l'établissement manquant",
          400,
        );
      if (!user) throw createServiceError('Non authentifié', 401);
      if (!schoolId)
        throw createServiceError(
          "Identifiant de l'établissement manquant",
          400,
        );

      const {
        mode,
        teacherId,
        groupId,
        hasLessonOnly,
        status,
        page = 0,
        limit = 6,
        classId,
      } = filter;
      const skip = page * limit;

      let groups: any[] = [];
      let totalCount = 0;
      let teachers: any[] = [];

      if (mode === 'TEACHER') {
        const classSubjectConditions: Prisma.ClassSubjectsWhereInput[] = [];
        if (hasLessonOnly)
          classSubjectConditions.push({ lessons: { some: {} } });

        if (groupId) classSubjectConditions.push({ groupId });

        const where: Prisma.TeacherWhereInput = {
          schoolUser: { schoolId },
          ...(teacherId && { id: teacherId }),

          ...(classSubjectConditions.length > 0 && {
            classSubjects: {
              some: {
                AND: classSubjectConditions,
              },
            },
          }),
        };
        teachers = await prisma.teacher.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            schoolUser: {
              user: {
                profile: {
                  firstname: 'asc',
                },
              },
            },
          },
          include: {
            schoolUser: {
              select: {
                user: {
                  select: {
                    profile: {
                      select: {
                        firstname: true,
                        lastname: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      } else if (mode === 'CLASS') {
        const classSubjectConditions: Prisma.ClassSubjectsWhereInput[] = [];
        if (hasLessonOnly)
          classSubjectConditions.push({ lessons: { some: {} } });
        classSubjectConditions.push({ id: { not: undefined } });
        if (teacherId) classSubjectConditions.push({ teacherId });
        if (classId)
          classSubjectConditions.push({
            group: {
              classes: {
                some: {
                  id: classId,
                },
              },
            },
          });
        const [data, count] = await Promise.all([
          await prisma.group.findMany({
            where: {
              schoolId,
              ...(groupId && {
                id: groupId,
              }),
              ...(classSubjectConditions.length > 0 && {
                classSubjects: {
                  some: {
                    AND: classSubjectConditions,
                  },
                },
              }),
            },
            include: {
              classes: true,
            },
            take: limit,
            skip,
          }),
          await prisma.group.count({
            where: {
              schoolId,
              ...(classSubjectConditions.length > 0 && {
                classSubjects: {
                  some: {
                    AND: classSubjectConditions,
                  },
                },
              }),
            },
          }),
        ]);

        groups = data;
        totalCount = count;
      }

      const teacherIds = teachers?.map((t) => t.id);
      const groupIds = groups.map((g) => g.id);
      const lessons = await prisma.lesson.findMany({
        where: {
          schoolId,
          ...(status && {
            status,
          }),
          classSubject: {
            ...(mode === 'TEACHER'
              ? {
                  teacher: {
                    id: { in: teacherIds },
                  },
                }
              : {
                  group: {
                    id: { in: groupIds },
                  },
                }),
          },
        },
        include: {
          classSubject: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              teacher: {
                select: {
                  id: true,
                  schoolUser: {
                    select: {
                      user: {
                        select: {
                          profile: {
                            select: {
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
              group: {
                include: {
                  classes: {
                    select: {
                      id: true,
                      name: true,
                      level: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        data: {
          events: lessons?.map((l) => ({
            id: l?.id,
            resourceId:
              mode === 'TEACHER'
                ? l?.classSubject?.teacherId
                : l.classSubject.groupId,
            title: l.classSubject.subject.name,
            status: l.status,
            startTime: l.startTime?.toISOString(),
            endTime: l.endTime.toISOString(),
            subject: l.classSubject.subject,
            day: l.day,
            teacher: {
              id: l.classSubject.teacher?.id,
              firstname:
                l.classSubject.teacher?.schoolUser.user.profile?.firstname,
              lastname:
                l.classSubject.teacher?.schoolUser.user.profile?.lastname,
            },
            group: l.classSubject.group,
          })),
          resources:
            mode === 'TEACHER'
              ? teachers.map((t) => ({
                  id: t.id,
                  title: `${t?.schoolUser.user.profile?.firstname} ${t?.schoolUser?.user?.profile?.lastname}`,
                }))
              : groups.map((g) => ({
                  id: g.id,
                  title: g.type === 'SOLO' ? g.classes[0].name : g?.name,
                })),
        },
        meta: {
          total: totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
          limit,
        },
      };
    },
    getClassTeacher: async (_, __, { schoolId, user }) => {
      if (!user) throw createServiceError('Non authentifier', 401);
      if (!schoolId) throw createServiceError('Identifiant manquant', 400);

      return {
        schoolId,
      };
    },
  },
};
