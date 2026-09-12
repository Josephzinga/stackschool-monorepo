import type { Request, Response } from 'express';
import { Cache } from '@nestjs/cache-manager';
import {
  SchoolRole,
  SchoolUserContract,
  UserWithRelationsContract,
} from '@stackschool/messaging';
import { PrismaService } from '../prisma/prisma.service';

export interface GqlContext {
  req: Request;
  res: Response;
  schoolId: string | null;
  role: SchoolRole | null;
  userId: string | null;
  user: UserWithRelationsContract | null;
  schoolUser?: SchoolUserContract | null;
  teacherId?: string | null;
  studentId?: string | null;
  staffId?: string | null;
  parentId?: string | null;
}
interface CreateContextParams {
  req: Request;
  res: Response;
  cacheManager: Cache;
  prisma: PrismaService;
}
export const createContext = async ({
  req,
  res,
  cacheManager,
  prisma,
}: CreateContextParams): Promise<Omit<GqlContext, 'loaders'>> => {
  const userId = req.headers['x-user-id'] as string | undefined;
  const schoolId = req.headers['x-school-id'] as string | undefined;
  const role = req.headers['x-school-role'] as SchoolRole | undefined;
  const teacherId = req.headers['x-teacher-id'] as string | undefined;
  const studentId = req.headers['x-student-id'] as string | undefined;
  const staffId = req.headers['x-staff-id'] as string | undefined;
  const parentId = req.headers['x-parent-id'] as string | undefined;
  console.log('userId ', userId, 'schoolId', schoolId);

  const userKey = `user:${userId}`;
  let user: UserWithRelationsContract | null = null;
  let schoolUser: SchoolUserContract | null = null;
  if (userId) {
    const userCached = await cacheManager.get<string>(userKey);
    if (userCached) {
      user = (await JSON.parse(userCached)) as UserWithRelationsContract;
    } else {
      user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          profile: true,
          accounts: true,
        },
      });
    }
  }

  if (userId && schoolId) {
    const schoolUserKey = `school_user:${schoolId}:${userId}`;
    const schoolUserCached = await cacheManager.get<string>(schoolUserKey);

    if (schoolUserCached) {
      schoolUser = (await JSON.parse(schoolUserCached)) as SchoolUserContract;
    }
  }

  return {
    req,
    res,
    userId: userId ?? null,
    schoolId: schoolId ?? null,
    user,
    role: role ?? null,
    schoolUser,
    teacherId: teacherId ?? null,
    studentId: studentId ?? null,
    staffId: staffId ?? null,
    parentId: parentId ?? null,
  };
};
