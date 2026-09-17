import { Request, Response } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DataLoaders } from '../modules/dataloader/dataloader.service';
import { SchoolUserContract } from '@stackschool/contracts';
import { Cache } from '@nestjs/cache-manager';
import { safeValidateSchema } from '@stackschool/messaging';

import z from 'zod';
import { MembershipService } from '../modules/membership/membership.service';

export interface GraphQLContext {
  req: Request;
  res: Response;
  user: NonNullable<Request['user']>;
  schoolId?: string;
  schoolUser?: SchoolUserContract;
  teacherId?: string;
  studentId?: string;
  staffId?: string;
  parentId?: string;
  loaders?: DataLoaders;
}

interface CreateContextParams {
  req: Request;
  res: Response;
  cacheManager: Cache;
  membershipService: MembershipService;
}

export async function createContext({
  req,
  res,
  cacheManager,
  membershipService,
}: CreateContextParams): Promise<GraphQLContext> {
  const user = req.user;

  if (!user)
    throw new UnauthorizedException(
      'Vous devez être connecté pour accéder à cette ressource.',
    );
  const schoolId =
    (req.headers['x-school-id'] as string) || (req.query?.schoolId as string);
  console.log('SchoolId: ', schoolId);

  const { success, errors } = safeValidateSchema(z.uuid().optional(), schoolId);
  if (!success) {
    throw new BadRequestException(errors?.[0]?.message, { cause: errors });
  }

  let schoolUser: SchoolUserContract | undefined;
  if (user && schoolId) {
    const cachedKey = `school_user:${schoolId}:${user.id}`;

    const cached = await cacheManager.get<string>(cachedKey);
    console.log('Cached: ', cached);
    if (cached) {
      schoolUser = JSON.parse(cached) as SchoolUserContract;
    } else {
      schoolUser = await membershipService.findBySchoolIdAndUserId({
        schoolId,
        userId: user.id,
      });
      if (schoolUser)
        await cacheManager.set(
          cachedKey,
          JSON.stringify(schoolUser),
          1000 * 60 * 60 * 5,
        );
    }

    if (!schoolUser)
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette école.",
      );
  }

  const teacherId = schoolUser?.teacher?.id;
  const studentId = schoolUser?.student?.id;
  const staffId = schoolUser?.staff?.id;
  const parentId = schoolUser?.parent?.id;

  return {
    user,
    schoolUser,
    schoolId,
    teacherId,
    studentId,
    staffId,
    parentId,
    req,
    res,
  };
}
