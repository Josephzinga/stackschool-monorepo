import type { Request, Response } from 'express';
import { Cache } from '@nestjs/cache-manager';
import { SchoolRole } from '../prisma/db/generated/enums';
import {
  AUTH_PATTERNS,
  SchoolUserContract,
  UserWithRelationsContract,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { DataLoaders } from '../modules/dataloader/dataloader.service';
import { PrismaService } from '../prisma/prisma.service';

export interface GqlContext {
  req: Request;
  res: Response;
  schoolId: string | null;
  role: SchoolRole | null;
  userId: string | null;
  user: UserWithRelationsContract | null;
  schoolUser?: SchoolUserContract | null;
  loaders: DataLoaders;
}
interface CreateContextParams {
  req: Request;
  res: Response;
  cacheManager: Cache;
  authClient: ClientProxy;
  prisma: PrismaService;
}
export const createContext = async ({
  req,
  res,
  cacheManager,
  authClient,
  prisma,
}: CreateContextParams): Promise<Omit<GqlContext, 'loaders'>> => {
  const userId = req.headers['x-user-id'] as string | undefined;
  const schoolId = req.headers['x-school-id'] as string | undefined;
  const role = req.headers['x-school-role'] as SchoolRole | undefined;
  console.log('userId ', userId, 'schoolId', schoolId);
  const userKey = `user:${userId}`;
  let user: UserWithRelationsContract | null = null;
  let schoolUser: SchoolUserContract | null = null;
  if (userId) {
    const userCached = await cacheManager.get<string>(userKey);
    if (userCached) {
      user = (await JSON.parse(userCached)) as UserWithRelationsContract;
    }
  }

  if (userId && schoolId) {
    const schoolUserKey = `school_user:${schoolId}:${userId}`;
    const schoolUserCached = await cacheManager.get<string>(schoolUserKey);

    if (schoolUserCached) {
      schoolUser = (await JSON.parse(schoolUserCached)) as SchoolUserContract;
    }
    if (!schoolUser) {
      schoolUser = await prisma.schoolUser.findUnique({
        where: {
          schoolId_userId: {
            schoolId,
            userId,
          },
        },
      });
      if (schoolUser) {
        await cacheManager.set(schoolUserKey, schoolUser, 1000 * 60 * 60 * 5);
      }
    }
  }

  if (!user && userId) {
    user = await firstValueFrom(
      authClient.send(AUTH_PATTERNS.FIND_FULL_USER, { userId }).pipe(
        timeout(2500),
        catchError((err) => throwError(() => err)),
      ),
    );

    if (user) await cacheManager.set(userKey, user, 1000 * 60 * 60 * 5);
  }

  return {
    req,
    res,
    userId: userId ?? null,
    schoolId: schoolId ?? null,
    user,
    role: role ?? null,
    schoolUser,
  };
};
