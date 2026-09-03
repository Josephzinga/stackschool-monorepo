import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../../prisma/db/generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherInput, GetSchoolTeachersInput } from '../../graphql';
import {
  ACADEMIC_PATTERNS,
  ACADEMIC_SERVICE,
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  FindTeachersPaginatedInput,
  FindTeachersPaginatedResponse,
  generateUsername,
  mapCoreError,
  sendRmqRequest,
  UserWithRelationsContract,
  ValidateUserFieldInput,
  ValidateUserFieldResponse,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TeacherService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(ACADEMIC_SERVICE) private readonly academicClient: ClientProxy,
  ) {}
  async create(data: CreateTeacherInput, schoolId: string) {
    const userFields: ValidateUserFieldInput = {
      phoneNumber: data.phoneNumber ?? null,
      ...(data.email && {
        email: data.email,
      }),
      selfCheck: false,
      userId: null,
    };
    const existing = await sendRmqRequest<ValidateUserFieldResponse>(
      this.authClient,
      AUTH_PATTERNS.VALIDATE_USER_FIELD,
      userFields,
    );
    console.log('Existing', existing);

    if (!existing.valid) {
      throw new CoreRpcException(
        'CONFLICT',
        existing.message ?? 'Entré déjà utiliser.',
      );
    }

    const user = await sendRmqRequest<UserWithRelationsContract>(
      this.authClient,
      AUTH_PATTERNS.CREATE_USER,
      {
        phoneNumber: data?.phoneNumber,
        email: data.email,
        username: generateUsername({
          firstName: data.firstName,
          lastName: data.lastName,
          includeSuffix: true,
        }),
      },
      mapCoreError,
    );

    return this.prisma.$transaction(async (tx) => {
      const schoolUser = await tx.schoolUser.create({
        data: {
          userId: user.id,
          schoolId,
          role: 'TEACHER',
          schoolProfile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              schoolId,
              gender: data.gender,
            },
          },
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

  async getSchool(input: GetSchoolTeachersInput, schoolId: string) {
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
    let whereClause: Prisma.TeacherWhereInput = {
      needAdminConfirm: false,
      schoolUser: { schoolId },
    };

    if (classId || subjectId) {
      const result = await sendRmqRequest<{ ids: string[] }>(
        this.academicClient,
        ACADEMIC_PATTERNS.FIND_TEACHER_IDS_BY_CLASS_SUBJECT,
        { classId, subjectId, schoolId },
      );
      console.log('TeacherIds', result.ids);
      whereClause = {
        ...whereClause,
        id: { in: result.ids },
      };
    }

    // 2. Filtres spécifiques
    if (isActive !== undefined && isActive !== null) {
      whereClause.isActive = isActive;
    }

    // 3. Filtre de recherche (si présent)
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            specialization: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
          {
            schoolUser: {
              schoolProfile: {
                OR: [
                  {
                    firstName: { contains: search, mode: 'insensitive' },
                  },
                  {
                    lastName: { contains: search, mode: 'insensitive' },
                  },
                ],
              },
            },
          },
        ],
      };
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
      data: teachers || [],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, schoolId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        id,
        schoolUser: {
          schoolId,
        },
      },
    });
    if (!teacher) {
      throw new CoreRpcException('TEACHER_NOT_FOUND', 'Enseignant non trouvé.');
    }
    return teacher;
  }

  async findTeachersPaginated(
    input: FindTeachersPaginatedInput,
  ): Promise<FindTeachersPaginatedResponse> {
    const where: Prisma.TeacherWhereInput = {
      schoolUser: {
        schoolId: input.schoolId,
      },
      ...(input?.department ? { department: input.department } : {}),
    };

    const [teachers, totalCount] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        select: {
          id: true,
          schoolUser: {
            select: {
              schoolProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        skip: input.page * input.limit,
        take: input.limit,
      }),
      this.prisma.teacher.count({ where }),
    ]);
    return {
      teachers: teachers?.map((t) => ({
        id: t.id,
        firstName: t.schoolUser?.schoolProfile?.firstName ?? '',
        lastName: t.schoolUser?.schoolProfile?.lastName ?? '',
      })),
      totalCount,
    };
  }
}
