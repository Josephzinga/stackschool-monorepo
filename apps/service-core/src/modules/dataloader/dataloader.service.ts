import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Permission,
  SchoolProfile,
  SchoolUser,
  Student,
} from '../../prisma/db/generated/client';

/**
 * Token d'injection du client Prisma.
 * À fournir dans ton module (voir data-loader.module.ts).
 */

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
      membershipLoader: new DataLoader<string, SchoolUser[] | undefined>(
        async (schoolUserIds) => {
          const schoolUsers = await prisma.schoolUser.findMany({
            where: { id: { in: [...schoolUserIds] } },
          });
          const map = groupBy(schoolUsers, (su) => su.id);
          return schoolUserIds.map((id) => map.get(id));
        },
      ),

      schoolProfileLoader: new DataLoader<string, SchoolProfile | undefined>(
        async (schoolUserIds) => {
          const schoolProfiles = await prisma.schoolProfile.findMany({
            where: {
              schoolUserId: {
                in: [...schoolUserIds],
              },
            },
          });

          const map = indexBy(schoolProfiles, (item) => item.schoolUserId);
          return schoolUserIds.map((id) => map.get(id));
        },
      ),

      studentsByClassLoader: new DataLoader<string, Student[]>(
        async (classIds) => {
          const students = await prisma.student.findMany({
            where: { classId: { in: [...classIds] } },
          });
          const map = groupBy(students, (s) => s.classId);
          return classIds.map((id) => map.get(id) ?? []);
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
