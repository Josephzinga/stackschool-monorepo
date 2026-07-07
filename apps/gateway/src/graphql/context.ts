import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { UserInMe } from '@stackschool/shared';
import { SchoolUser } from '@stackschool/db';
import { UnauthorizedException } from '@nestjs/common';
import { DataLoaders } from '../modules/dataloader/dataloader.service';

export interface GraphQLContext {
  req: Request;
  user: UserInMe;
  schoolId?: string;
  schoolUser?: SchoolUser;
  teacherId?: string;
  studentId?: string;
  staffId?: string;
  loaders?: DataLoaders;
}

export function createContext(
  req: Request,
  prisma: PrismaService,
): Promise<GraphQLContext> {
  const user = req.user;

  if (!user)
    throw new UnauthorizedException(
      'Vous devez être connecté pour accéder à cette ressource.',
    );
  const schoolId =
    (req.headers['x-school-id'] as string) || (req.query?.schoolId as string);

  const context: GraphQLContext = { req, schoolId, user };

  /* if (user && schoolId) {
    const schoolUser = await prisma.schoolUser.findUnique({
      where: {
        schoolId_userId: { schoolId, userId: user.id },
      },
    });

    if (!schoolUser)
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette école.",
      );

    context.schoolUser = schoolUser;

    switch (schoolUser.role) {
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
  }
       
  }
   */
  return context;
}
