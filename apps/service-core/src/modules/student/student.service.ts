import { Inject, Injectable } from '@nestjs/common';
import {
  CreateStudentInput,
  GetSchoolStudentsInput,
  Student,
  StudentList,
} from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../prisma/db/generated/client';
import {
  ACADEMIC_PATTERNS,
  ACADEMIC_SERVICE,
  AUTH_EVENTS,
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  CreateUserInput,
  generateUsername,
  mapCoreError,
  sendRmqRequest,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(ACADEMIC_SERVICE) private readonly academicClient: ClientProxy,
  ) {}

  async findAll(
    input: GetSchoolStudentsInput,
    schoolId: string,
  ): Promise<StudentList> {
    const {
      page = 0,
      limit = 10,
      searchTerm,
      classId,
      level,
      sort,
      section,
      teacherId,
    } = input;
    const skip = page * limit;
    const search = searchTerm?.trim();

    let whereClause: Prisma.StudentWhereInput = {
      schoolId,
      deletedAt: null,
    };

    if (classId) {
      whereClause = {
        ...whereClause,
        ...(classId && { classId }),
      };
    }

    if (search) {
      whereClause.OR = [
        { matricule: { contains: search, mode: 'insensitive' } },
        {
          schoolUser: {
            schoolProfile: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    let orderBy: Prisma.StudentOrderByWithRelationInput = {
      schoolUser: {
        schoolProfile: {
          firstName: 'asc',
        },
      },
    };
    if (sort) {
      if (sort?.field === 'lastName' || sort?.field === 'firstName') {
        orderBy.schoolUser = {
          schoolProfile: {
            [sort.field as string]: sort.order?.toLowerCase(),
          },
        };
      }
      if (sort?.field === 'enrolementYear') {
        orderBy = {
          ...orderBy,
          enrollmentYear: sort.order?.toLocaleLowerCase() as Prisma.SortOrder,
        };
      }
    }

    const [total, students] = await Promise.all([
      this.prisma.student.count({ where: whereClause }),
      this.prisma.student.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy,
      }),
    ]);
    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(input: CreateStudentInput, schoolId: string): Promise<Student> {
    const classe = await sendRmqRequest<{ id: string }>(
      this.academicClient,
      ACADEMIC_PATTERNS.FIND_ONE_CLASS,
      { id: input.classId, schoolId },
    );
    if (!classe) throw new CoreRpcException('NOT_FOUND', 'Classe non trouvé.');

    return this.prisma.$transaction(async (tx) => {
      const existingStudent = await tx.student.findUnique({
        where: {
          matricule_schoolId: {
            matricule: input?.matricule,
            schoolId,
          },
        },
      });

      if (existingStudent) {
        throw new CoreRpcException(
          'CONFLICT',
          "C'est élève existe déjà dans l'établissement",
        );
      }

      const userPayload: CreateUserInput = {
        username: generateUsername({
          firstName: input.firstName,
          lastName: input.lastName,
        }),
        isActive: false,
      };

      const user = await sendRmqRequest<{ id: string }>(
        this.authClient,
        AUTH_PATTERNS.CREATE_USER,
        userPayload,
        mapCoreError,
      );
      const schoolUser = await tx.schoolUser.create({
        data: {
          userId: user?.id,
          role: 'STUDENT',
          schoolId,
          schoolProfile: {
            create: {
              firstName: input.firstName,
              lastName: input.lastName,
              address: input?.address,
              schoolId,
              gender: input.gender,
            },
          },
        },
      });

      return tx.student.create({
        data: {
          schoolId,
          matricule: input?.matricule,
          enrollmentYear: input?.enrollmentYear ?? null,
          birthDate: new Date(input?.birthDate),
          birthPlace: input?.birthPlace,
          nationality: input?.nationality,
          schoolUserId: schoolUser.id,
          classId: input?.classId,
        },
      });
    });
  }

  async deleteMany(ids: string[], soft: boolean, schoolId: string) {
    const exist = await this.prisma.student.findMany({
      where: {
        id: { in: ids },
        schoolId,
      },
      select: {
        id: true,
        schoolUserId: true,
        schoolUser: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!exist || exist.length === 0) {
      throw new CoreRpcException('STUDENT_NOT_FOUND', 'Aucun élève trouvé');
    }

    if (soft) {
      // Soft Delete : On met à jour le statut et deletedAt
      await this.prisma.student.updateMany({
        where: {
          id: { in: ids },
          schoolId,
        },
        data: {
          status: 'INACTIVE',
          deletedAt: new Date(),
        },
      });

      // On désactive aussi le User associé pour empêcher la connexion
      const userIds =
        exist.map((s) => s.schoolUser?.userId).filter(Boolean) || [];

      if (userIds.length > 0)
        this.authClient.emit(AUTH_EVENTS.DISABLE_USERS_BY_IDS, {
          userIds,
        });

      return {
        ok: true,
        message: `${ids.length} élève(s) archivé(s)`,
      };
    } else {
      // Hard Delete
      const schoolUserIds = exist.map((s) => s.schoolUserId);

      await this.prisma.schoolUser.deleteMany({
        where: {
          id: { in: schoolUserIds as string[] },
        },
      });

      return {
        ok: true,
        message: `${ids.length} élève(s) supprimé(s) définitivement`,
      };
    }
  }
}
