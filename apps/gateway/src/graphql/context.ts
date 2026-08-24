import { Request, Response } from 'express';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { DataLoaders } from '../modules/dataloader/dataloader.service';
import { SchoolUserContract } from '@stackschool/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from '@nestjs/cache-manager';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { CORE_PATTERNS } from '@stackschool/messaging';
import { mapCoreError } from '../errors/core.error-maper';

export interface GraphQLContext {
  req: Request;
  user: NonNullable<Request['user']>;
  schoolId?: string;
  schoolUser?: SchoolUserContract;
  teacherId?: string;
  studentId?: string;
  staffId?: string;
  loaders?: DataLoaders;
}

export async function createContext(
  req: Request,
  res: Response,
  coreClient: ClientProxy,
  cacheManager: Cache,
): Promise<GraphQLContext> {
  const user = req.user;

  if (!user)
    throw new UnauthorizedException({
      ok: false,
      message: 'Vous devez être connecté pour accéder à cette ressource.',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  const schoolId =
    (req.headers['x-school-id'] as string) || (req.query?.schoolId as string);

  const context: GraphQLContext = { req, schoolId, user };
  let schoolUser: SchoolUserContract | undefined;
  if (user && schoolId) {
    const cachedKey = `school_user:${schoolId}:${user.id}`;
    const cached = await cacheManager.get<string>(cachedKey);
    if (cached) {
      schoolUser = JSON.parse(cached) as SchoolUserContract;
    } else {
      schoolUser = await firstValueFrom(
        coreClient
          .send(CORE_PATTERNS.MEMBERSHIP.FIND_BY_SCHOOL_ID_AND_USER_ID, {
            schoolId,
            userId: user.id,
          })
          .pipe(
            timeout(3000),
            catchError((err) => throwError(() => mapCoreError(err))),
          ),
      );
    }

    if (schoolUser)
      await cacheManager.set(
        cachedKey,
        JSON.stringify(schoolUser),
        1000 * 60 * 60 * 5,
      );

    context.schoolId = schoolId;

    if (!schoolUser)
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette école.",
      );

    context.schoolUser = schoolUser;

    /* switch (schoolUser.role) {
      case 'TEACHER': {
        const teacher = await prisma.teacher.findFirst({
          where: { schoolUserId: schoolUser.id },
          select: { id: true },
        });
        context.teacherId = teacher?.id;
        break;
      }
      case 'STUDENT': {
        const student = await prisma.student.findFirst({
          where: { schoolUserId: schoolUser.id },
          select: { id: true },
        });
        context.studentId = student?.id;
        break;
      }
      case 'STAFF': {
        const staff = await prisma.staff.findFirst({
          where: { schoolUserId: schoolUser.id },
          select: { id: true },
        });
        context.staffId = staff?.id;
        break;
      }
      default:
        break;
    }*/
  }

  return context;
}
