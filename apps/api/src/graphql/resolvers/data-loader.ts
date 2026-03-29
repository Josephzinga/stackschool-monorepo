import DataLoader from 'dataloader';
import { Lesson, PrismaClient } from '@stackschool/db';

export const createLoaders = (prisma: PrismaClient) => {
  return {
    userLoader: new DataLoader(async (schoolUserIds: readonly string[]) => {
      const schoolUsers = await prisma.schoolUser.findMany({
        where: { id: { in: [...schoolUserIds] } },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phoneNumber: true,
              username: true,
              isActive: true,
              emailVerified: true,
              profile: true,
            },
          },
        },
      });
      const userMap = new Map(schoolUsers.map((su) => [su.id, su.user]));
      return schoolUserIds.map((id) => userMap.get(id) || null);
    }),
    classSubjectLoader: new DataLoader(async (classIds: readonly string[]) => {
      const allSubjects = await prisma.classSubjects.findMany({
        where: { classId: { in: [...classIds] } },
        include: { subject: true, teacher: true },
      });
    }),
    subjectLoader: new DataLoader(async (ids: readonly string[]) => {
      const subjects = await prisma.subject.findMany({
        where: { id: { in: [...ids] } },
      });
      const map = new Map(subjects.map((s) => [s.id, s]));
      return ids.map((id) => map.get(id) || null);
    }),
    teacherLoader: new DataLoader(async (teacherIds: readonly string[]) => {
      const teachers = await prisma.teacher.findMany({
        where: {
          id: { in: [...teacherIds] },
        },
      });
      const map = new Map(teachers.map((t) => [t.id, t]));
      return teacherIds.map((id) => map.get(id) || null);
    }),
    classLoader: new DataLoader(async (classIds: readonly string[]) => {
      const classes = await prisma.class.findMany({
        where: {
          id: { in: [...classIds] },
        },
      });
      const map = new Map(classes.map((cl) => [cl.id, cl]));
      return classIds.map((id) => map.get(id) || null);
    }),
    lessonsByIdLoader: new DataLoader<string, Lesson | undefined>(
      async (ids) => {
        const lessons = await prisma.lesson.findMany({
          where: { id: { in: [...ids] } },
        });
        const map = new Map(lessons.map((l) => [l.id, l]));
        return ids.map((id) => map.get(id));
      },
    ),

    lessonsByClassSubjectLoader: new DataLoader<string, Lesson[]>(
      async (classSubjectIds) => {
        const lessons = await prisma.lesson.findMany({
          where: { classSubjectId: { in: [...classSubjectIds] } },
        });

        return classSubjectIds.map((csId) =>
          lessons.filter((l) => l.classSubjectId === csId),
        );
      },
    ),
  };
};
export type DataLoaders = ReturnType<typeof createLoaders>;
