import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Class,
  ClassSubjects,
  Group,
  Lesson,
  Subject,
  TeacherAssignment,
} from 'src/prisma/db/generated/client';

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
      classSubjectLoader: new DataLoader<string, ClassSubjects | undefined>(
        async (ids) => {
          const classSubjects = await prisma.classSubjects.findMany({
            where: { id: { in: [...ids] } },
          });
          const map = indexBy(classSubjects, (cls) => cls.id);
          return ids.map((id) => map.get(id));
        },
      ),
      classSubjectBySubjectLoader: new DataLoader<string, ClassSubjects[]>(
        async (subjectIds) => {
          const classSubjects = await prisma.classSubjects.findMany({
            where: {
              subjectId: { in: [...subjectIds] },
            },
          });
          const map = groupBy(classSubjects, (cls) => cls.subjectId);
          return subjectIds.map((id) => map.get(id) ?? []);
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
              assignments: {
                classSubjectId: { in: [...classSubjectIds] },
              },
            },
            include: { assignments: true },
          });
          const map = groupBy(lessons, (l) => l.assignments.classSubjectId);
          return classSubjectIds.map((id) => map.get(id) ?? []);
        },
      ),

      lessonsBySubjectLoader: new DataLoader<string, Lesson[]>(
        async (subjectIds) => {
          const lessons = await prisma.lesson.findMany({
            where: {
              assignments: {
                classSubject: { subject: { id: { in: [...subjectIds] } } },
              },
            },
            include: {
              assignments: {
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
            (l) => l.assignments.classSubject.subject.id,
          );
          return subjectIds.map((id) => map.get(id) ?? []);
        },
      ),

      lessonsByTeacherLoader: new DataLoader<string, Lesson[]>(
        async (teacherIds) => {
          const lessons = await prisma.lesson.findMany({
            where: {
              assignments: { teacherId: { in: [...teacherIds] } },
            },
            include: { assignments: true },
          });
          const map = groupBy(lessons, (l) => l.assignments.teacherId);
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

      lessonsByGroupLoader: new DataLoader<string, Lesson[]>(
        async (groupIds) => {
          const lessons = await prisma.lesson.findMany({
            where: {
              assignments: {
                classSubject: { group: { id: { in: [...groupIds] } } },
              },
            },
            include: {
              assignments: {
                select: { classSubject: { select: { groupId: true } } },
              },
            },
          });
          const map = groupBy(
            lessons,
            (l) => l.assignments.classSubject.groupId,
          );
          return groupIds.map((id) => map.get(id) ?? []);
        },
      ),

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
    };
  }
}

export type DataLoaders = ReturnType<DataLoaderService['createLoaders']>;
