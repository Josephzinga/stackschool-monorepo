import { Request, Response } from 'express';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { DataLoaders } from '../modules/dataloader/dataloader.service';
import type { SchoolUserContract } from '@stackschool/contracts';
import { MembershipService } from '../modules/membership/membership.service';

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
  memberService: MembershipService,
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

  if (user && schoolId) {
    const schoolUser = await memberService.findBySchoolIdAndUserId({
      schoolId,
      userId: user.id,
    });

    console.log('schooLuser', schoolUser);

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
