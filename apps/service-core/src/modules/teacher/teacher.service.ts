import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../../prisma/db/generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherInput, GetSchoolTeachersInput } from '../../graphql';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  generateUsername,
  UserWithRelationsContract,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class TeacherService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}
  async create(data: CreateTeacherInput, schoolId: string) {
    const user = await firstValueFrom<UserWithRelationsContract>(
      this.authClient
        .send(AUTH_PATTERNS.CREATE_USER, {
          phoneNumber: data?.phoneNumber,
          email: data.email,
          username: generateUsername({
            firstName: data.firstName,
            lastName: data.lastName,
            includeSuffix: true,
          }),
        })
        .pipe(
          timeout(3000),
          catchError((err: any) =>
            throwError(
              () => new CoreRpcException(err?.code, err?.message, err?.meta),
            ),
          ),
        ),
    );
    return this.prisma.$transaction(async (tx) => {
      const schoolUser = await tx.schoolUser.create({
        data: {
          userId: user.id,
          schoolId,
          role: 'TEACHER',
        },
      });

      await tx.schoolProfile.create({
        data: {
          schoolUserId: schoolUser.id,
          firstName: data.firstName,
          lastName: data.lastName,
          schoolId,
          gender: data.gender,
        },
      });

      return tx.teacher.create({
        data: {
          diploma: data.diploma,
          schoolUserId: schoolUser.id,
          specialization: data.specialization,
        },
      });
    });
  }

  async getMany(input: GetSchoolTeachersInput, schoolId: string) {
    const {
      page = 0,
      limit = 10,
      searchTerm,
      classId,
      subjectId,
      isActive,
      isSupervisor,
      day,
    } = input;

    const skip = page * limit;
    const search = searchTerm?.trim();

    // 1. Filtre de base : L'école
    const whereClause: Prisma.TeacherWhereInput = {
      needAdminConfirm: false,
      schoolUser: { schoolId },
    };

    // 2. Filtres spécifiques
    if (isActive !== undefined && isActive !== null) {
      whereClause.isActive = isActive;
    }

    // 3. Filtre de recherche (si présent)
    if (search) {
      const searchCondition = {
        OR: [
          {
            specialization: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        ],
      };

      // Si on a déjà un OR (à cause de classId), on doit utiliser AND pour combiner
      if (whereClause.OR) {
        whereClause.AND = [
          { OR: whereClause.OR }, // La condition classId
          searchCondition, // La condition search
        ];
        delete whereClause.OR; // On nettoie l'ancien OR
      } else {
        // Sinon on ajoute simplement le AND avec la recherche
        const existingAnd = Array.isArray(whereClause.AND)
          ? whereClause.AND
          : whereClause.AND
            ? [whereClause.AND]
            : [];
        whereClause.AND = [...existingAnd, searchCondition];
      }
    }

    const [total, teachers] = await Promise.all([
      this.prisma.teacher.count(),
      this.prisma.teacher.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy: {
          schoolUser: {
            schoolProfile: {
              firstName: 'asc',
            },
          },
        },
      }),
    ]);
    return {
      data: teachers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
