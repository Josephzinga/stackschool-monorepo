import { GetLessonsInput } from '../../types.generated';
import { prisma, Prisma } from '@stackschool/db';
import { LessonStatusEnum } from '@stackschool/shared';
import { lessonMutationResolver } from './lesson-mutation.resolver';
import { lessonQueryResolver } from './lesson-query.resolver';
import { lessonsResolver } from './lessons.resolver';

export const lessonResolvers = {
  ...lessonMutationResolver,
  ...lessonQueryResolver,
  ...lessonsResolver,
};

export const teacherWhereClause = (
  filter: GetLessonsInput,
  schoolId: string,
): Prisma.TeacherWhereInput => {
  const { teacherId, groupId, hasLessonOnly } = filter;
  const assignmentWhereClause: Prisma.TeacherAssignmentWhereInput[] = [];

  if (hasLessonOnly) assignmentWhereClause.push({ lessons: { some: {} } });
  if (groupId)
    assignmentWhereClause.push({ classSubject: { group: { id: groupId } } });

  return {
    schoolUser: { schoolId },
    ...(teacherId && { id: teacherId }),
    ...(assignmentWhereClause.length > 0 && {
      assignments: { some: { AND: assignmentWhereClause } },
    }),
  };
};

export const groupWhereClause = (
  filter: GetLessonsInput,
  schoolId: string,
): Prisma.GroupWhereInput => {
  const { groupId, teacherId, classId, hasLessonOnly } = filter;
  const assignmentWhereClause: Prisma.ClassSubjectsWhereInput[] = [];

  if (hasLessonOnly)
    assignmentWhereClause.push({ assignments: { lessons: { some: {} } } });
  if (teacherId) assignmentWhereClause.push({ assignments: { teacherId } });
  if (classId)
    assignmentWhereClause.push({
      group: { classes: { some: { id: classId } } },
    });

  return {
    schoolId,
    ...(groupId && { id: groupId }),
    classSubjects: { some: { AND: assignmentWhereClause } },
  };
};

export const fetchTeachers = async (
  where: Prisma.TeacherWhereInput,
  skip: number,
  limit: number,
) => {
  return prisma.teacher.findMany({
    where,
    skip,
    take: limit,
    orderBy: { schoolUser: { user: { profile: { firstname: 'asc' } } } },
    include: {
      schoolUser: {
        select: {
          user: {
            select: {
              profile: { select: { firstname: true, lastname: true } },
            },
          },
        },
      },
    },
  });
};

export const fetchGroups = async (
  where: Prisma.GroupWhereInput,
  skip: number,
  limit: number,
) => {
  const [groups, totalCount] = await Promise.all([
    prisma.group.findMany({
      where,
      include: { classes: true },
      take: limit,
      skip,
    }),
    prisma.group.count({ where }),
  ]);
  return { groups, totalCount };
};

export const fetchLessons = async (
  schoolId: string,
  mode: string,
  teacherIds: string[],
  groupIds: string[],
  status?: LessonStatusEnum,
) => {
  const lessonWhere: Prisma.LessonWhereInput = {
    schoolId,
    ...(status && { status }),
    teacherAssignment:
      mode === 'TEACHER'
        ? { teacher: { id: { in: teacherIds } } }
        : { classSubject: { group: { id: { in: groupIds } } } },
  };

  return prisma.lesson.findMany({
    where: lessonWhere,
    include: {
      teacherAssignment: {
        include: {
          teacher: {
            select: {
              id: true,
              schoolUser: {
                select: {
                  user: {
                    select: {
                      profile: { select: { firstname: true, lastname: true } },
                    },
                  },
                },
              },
            },
          },
          classSubject: {
            include: {
              group: {
                include: {
                  classes: {
                    select: {
                      id: true,
                      name: true,
                      level: true,
                      groupId: true,
                    },
                  },
                },
              },
              subject: { select: { id: true, name: true, code: true } },
            },
          },
        },
      },
    },
  });
};

export const transformLessonToEvent = (lesson: any, mode: string) => ({
  id: lesson.id,
  resourceId:
    mode === 'TEACHER'
      ? lesson.teacherAssignment?.teacherId
      : lesson?.teacherAssignment?.classSubject?.groupId,
  title: lesson?.teacherAssignment?.classSubject.subject.name,
  status: lesson?.status,
  startTime: lesson?.startTime?.toISOString(),
  endTime: lesson?.endTime?.toISOString(),
  subject: lesson?.teacherAssignment?.classSubject?.subject,
  day: lesson?.day,
  teacher: {
    id: lesson?.teacherAssignment.teacher?.id ?? '',
    firstname:
      lesson?.teacherAssignment.teacher?.schoolUser.user.profile?.firstname ??
      '',
    lastname:
      lesson?.teacherAssignment?.teacher?.schoolUser.user?.profile?.lastname ??
      '',
  },
  group: lesson?.teacherAssignment?.classSubject?.group,
});
