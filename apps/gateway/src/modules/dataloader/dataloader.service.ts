import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';

/**
 * Token d'injection du client Prisma.
 * À fournir dans ton module (voir data-loader.module.ts).
 */
export const PRISMA_CLIENT = Symbol('PRISMA_CLIENT');

export interface UserLoader extends Pick<
  User,
  | 'id'
  | 'email'
  | 'username'
  | 'phoneNumber'
  | 'isActive'
  | 'emailVerified'
  | 'hasMembership'
  | 'profileCompleted'
> {
  profile: { id: string } | null;
}

export interface ClassCount {
  students: { male: number; female: number };
  subjects: number;
  teachers: number;
}

/** Indexe un tableau en Map<clé, valeur> en un seul passage — O(n). */
function indexBy<T, K>(items: readonly T[], keyFn: (item: T) => K): Map<K, T> {
  const map = new Map<K, T>();
  for (const item of items) map.set(keyFn(item), item);
  return map;
}

/** Regroupe un tableau en Map<clé, valeur[]> en un seul passage — O(n). */
function groupBy<T, K>(
  items: readonly T[],
  keyFn: (item: T) => K,
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = map.get(key);
    if (list) list.push(item);
    else map.set(key, [item]);
  }
  return map;
}

@Injectable()
export class DataLoaderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Construit un set de loaders frais.
   * À appeler une fois par requête (le cache DataLoader est alors limité à la requête,
   * ce qui évite toute fuite de données entre utilisateurs).
   */
  createLoaders() {
    const prisma = this.prisma;

    return {
      /** Charge les utilisateurs à partir du schoolUserId */
      userLoader: new DataLoader<string, UserLoader | undefined>(
        async (schoolUserIds) => {
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
                  hasMembership: true,
                  profileCompleted: true,
                  profile: { select: { id: true } },
                },
              },
            },
          });
          const map = indexBy(schoolUsers, (su) => su.id);
          return schoolUserIds.map((id) => map.get(id)?.user);
        },
      ),

      membershipLoader: new DataLoader<string, SchoolUser[] | undefined>(
        async (schoolUserIds) => {
          const schoolUsers = await prisma.schoolUser.findMany({
            where: { id: { in: [...schoolUserIds] } },
          });
          const map = groupBy(schoolUsers, (su) => su.id);
          return schoolUserIds.map((id) => map.get(id));
        },
      ),

      profileLoader: new DataLoader<string, Profile | undefined>(
        async (userIds) => {
          const profiles = await prisma.profile.findMany({
            where: { userId: { in: [...userIds] } },
          });
          const map = indexBy(profiles, (p) => p.userId);
          return userIds.map((id) => map.get(id));
        },
      ),

      classSubjectLoader: new DataLoader<string, ClassSubjects | undefined>(
        async (ids) => {
          const classSubjects = await prisma.classSubjects.findMany({
            where: { id: { in: [...ids] } },
          });
          const map = indexBy(classSubjects, (cls) => cls.id);
          return ids.map((id) => map.get(id));
        },
      ),

      classSubjectByGroupLoader: new DataLoader<string, ClassSubjects[]>(
        async (groupIds) => {
          const classSubjects = await prisma.classSubjects.findMany({
            where: { groupId: { in: [...groupIds] } },
          });
          const map = groupBy(classSubjects, (cls) => cls.groupId);
          return groupIds.map((id) => map.get(id) ?? []);
        },
      ),

      subjectLoader: new DataLoader<string, Subject | undefined>(
        async (ids) => {
          const subjects = await prisma.subject.findMany({
            where: { id: { in: [...ids] } },
          });
          const map = indexBy(subjects, (s) => s.id);
          return ids.map((id) => map.get(id));
        },
      ),

      teacherLoader: new DataLoader<string, Teacher | undefined>(
        async (teacherIds) => {
          const teachers = await prisma.teacher.findMany({
            where: { id: { in: [...teacherIds] } },
          });
          const map = indexBy(teachers, (t) => t.id);
          return teacherIds.map((id) => map.get(id));
        },
      ),

      classLoader: new DataLoader<string, Class | undefined>(
        async (classIds) => {
          const classes = await prisma.class.findMany({
            where: { id: { in: [...classIds] } },
          });
          const map = indexBy(classes, (cl) => cl.id);
          return classIds.map((id) => map.get(id));
        },
      ),

      classByGroupLoader: new DataLoader<string, Class[]>(async (groupIds) => {
        const classes = await prisma.class.findMany({
          where: { groupId: { in: [...groupIds] } },
        });
        const map = groupBy(classes, (cls) => cls.groupId);
        return groupIds.map((id) => map.get(id) ?? []);
      }),

      lessonsByIdLoader: new DataLoader<string, Lesson | undefined>(
        async (ids) => {
          const lessons = await prisma.lesson.findMany({
            where: { id: { in: [...ids] } },
          });
          const map = indexBy(lessons, (l) => l.id);
          return ids.map((id) => map.get(id));
        },
      ),

      lessonsByClassSubjectLoader: new DataLoader<string, Lesson[]>(
        async (classSubjectIds) => {
          const lessons = await prisma.lesson.findMany({
            where: {
              teacherAssignment: {
                classSubjectId: { in: [...classSubjectIds] },
              },
            },
            include: { teacherAssignment: true },
          });
          const map = groupBy(
            lessons,
            (l) => l.teacherAssignment.classSubjectId,
          );
          return classSubjectIds.map((id) => map.get(id) ?? []);
        },
      ),

      lessonsBySubjectLoader: new DataLoader<string, Lesson[]>(
        async (subjectIds) => {
          const lessons = await prisma.lesson.findMany({
            where: {
              teacherAssignment: {
                classSubject: { subject: { id: { in: [...subjectIds] } } },
              },
            },
            include: {
              teacherAssignment: {
                select: {
                  classSubject: {
                    select: { subject: { select: { id: true } } },
                  },
                },
              },
            },
          });
          const map = groupBy(
            lessons,
            (l) => l.teacherAssignment.classSubject.subject.id,
          );
          return subjectIds.map((id) => map.get(id) ?? []);
        },
      ),

      lessonsByTeacherLoader: new DataLoader<string, Lesson[]>(
        async (teacherIds) => {
          const lessons = await prisma.lesson.findMany({
            where: {
              teacherAssignment: { teacherId: { in: [...teacherIds] } },
            },
            include: { teacherAssignment: true },
          });
          const map = groupBy(lessons, (l) => l.teacherAssignment.teacherId);
          return teacherIds.map((id) => map.get(id) ?? []);
        },
      ),

      groupLoader: new DataLoader<string, Group | undefined>(
        async (groupIds) => {
          const groups = await prisma.group.findMany({
            where: { id: { in: [...groupIds] } },
          });
          const map = indexBy(groups, (g) => g.id);
          return groupIds.map((id) => map.get(id));
        },
      ),

      studentsByClassLoader: new DataLoader<string, Student[]>(
        async (classIds) => {
          const students = await prisma.student.findMany({
            where: { classId: { in: [...classIds] } },
            include: { profile: true },
          });
          const map = groupBy(students, (s) => s.classId);
          return classIds.map((id) => map.get(id) ?? []);
        },
      ),

      subjectsByClassLoader: new DataLoader<string, Subject[]>(
        async (classIds) => {
          const classSubjects = await prisma.classSubjects.findMany({
            where: {
              group: { classes: { some: { id: { in: [...classIds] } } } },
            },
            include: {
              subject: true,
              group: { select: { classes: { select: { id: true } } } },
            },
          });

          // Relation many-to-many (un classSubject peut concerner plusieurs classes) :
          // un seul parcours des arêtes au lieu de classIds × classSubjects.
          const map = new Map<string, Subject[]>();
          for (const cs of classSubjects) {
            for (const c of cs.group.classes) {
              const list = map.get(c.id);
              if (list) list.push(cs.subject);
              else map.set(c.id, [cs.subject]);
            }
          }
          return classIds.map((id) => map.get(id) ?? []);
        },
      ),

      supervisorByClassLoader: new DataLoader<
        string,
        Teacher | null | undefined
      >(async (classIds) => {
        const classes = await prisma.class.findMany({
          where: { id: { in: [...classIds] } },
          include: { supervisor: true },
        });
        const map = indexBy(classes, (c) => c.id);
        return classIds.map((id) => map.get(id)?.supervisor);
      }),

      lessonsByGroupLoader: new DataLoader<string, Lesson[]>(
        async (groupIds) => {
          const lessons = await prisma.lesson.findMany({
            where: {
              teacherAssignment: {
                classSubject: { group: { id: { in: [...groupIds] } } },
              },
            },
            include: {
              teacherAssignment: {
                select: { classSubject: { select: { groupId: true } } },
              },
            },
          });
          const map = groupBy(
            lessons,
            (l) => l.teacherAssignment.classSubject.groupId,
          );
          return groupIds.map((id) => map.get(id) ?? []);
        },
      ),

      classCountLoader: new DataLoader<string, ClassCount>(async (classIds) => {
        const [students, subjectsCount, teachersCount] = await Promise.all([
          prisma.profile.groupBy({
            by: ['gender'],
            where: { student: { classId: { in: [...classIds] } } },
            _count: { id: true },
          }),
          prisma.classSubjects.count({
            where: {
              group: { classes: { some: { id: { in: [...classIds] } } } },
            },
          }),
          prisma.teacherAssignment.count({
            where: {
              classSubject: {
                group: { classes: { some: { id: { in: [...classIds] } } } },
              },
            },
          }),
        ]);

        // NOTE: subjectsCount et teachersCount sont des totaux agrégés sur
        // TOUS les classIds (identiques pour chaque classe). Si tu veux un
        // compte réellement par classe, il faut grouper par classId.
        return classIds.map(() => ({
          students: {
            male: students.find((s) => s.gender === 'MALE')?._count.id ?? 0,
            female: students.find((s) => s.gender === 'FEMALE')?._count.id ?? 0,
          },
          subjects: subjectsCount,
          teachers: teachersCount,
        }));
      }),

      assignmentsByClassSubjectLoader: new DataLoader<
        string,
        TeacherAssignment | undefined
      >(async (classSubjectIds) => {
        const assignments = await prisma.teacherAssignment.findMany({
          where: { classSubjectId: { in: [...classSubjectIds] } },
        });
        const map = indexBy(assignments, (ass) => ass.classSubjectId);
        return classSubjectIds.map((id) => map.get(id));
      }),

      assignmentsByTeacherLoader: new DataLoader<string, TeacherAssignment[]>(
        async (teacherIds) => {
          const assignments = await prisma.teacherAssignment.findMany({
            where: { teacherId: { in: [...teacherIds] } },
          });
          const map = groupBy(assignments, (ass) => ass.teacherId);
          return teacherIds.map((id) => map.get(id) ?? []);
        },
      ),

      permissionsLoader: new DataLoader<string, Permission[]>(
        async (schoolUserIds) => {
          const permissions = await prisma.permission.findMany({
            where: {
              schoolUserPermissions: {
                some: { schoolUserId: { in: [...schoolUserIds] } },
              },
            },
            include: {
              schoolUserPermissions: { select: { schoolUserId: true } },
            },
          });

          const map = new Map<string, Permission[]>();
          for (const permission of permissions) {
            for (const su of permission.schoolUserPermissions) {
              const list = map.get(su.schoolUserId);
              if (list) list.push(permission);
              else map.set(su.schoolUserId, [permission]);
            }
          }
          return schoolUserIds.map((id) => map.get(id) ?? []);
        },
      ),
    };
  }
}

export type DataLoaders = ReturnType<DataLoaderService['createLoaders']>;
