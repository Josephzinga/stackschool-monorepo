import { Inject, Injectable } from '@nestjs/common';
import {
  CreateParentInput,
  GetSchoolParentsInput,
  Parent,
  ParentList,
} from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  CreateUserInput,
  generateUsername,
  sendRmqRequest,
  UpdateParentSchema,
  UserContract,
} from '@stackschool/messaging';
import { Prisma } from '../../prisma/db/generated/client';

@Injectable()
export class ParentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async getSchool(
    dto: GetSchoolParentsInput,
    schoolId: string,
  ): Promise<ParentList> {
    const { searchTerm, studentId, page, limit } = dto;
    const search = searchTerm?.trim() || '';

    let where: Prisma.ParentWhereInput = {
      needAdminConfirm: false,
      schoolUser: {
        schoolId,
      },
    };

    if (searchTerm) {
      where = {
        schoolUser: {
          schoolId,
          schoolProfile: {
            OR: [
              {
                firstName: { contains: search, mode: 'insensitive' },
              },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    if (studentId) {
      where = {
        ...where,
        students: {
          some: {
            student: {
              id: studentId,
            },
          },
        },
      };
    }

    const [parents, total] = await Promise.all([
      this.prisma.parent.findMany({
        where,
        take: limit,
        skip: page * limit,
        orderBy: {
          schoolUser: {
            schoolProfile: {
              firstName: 'asc',
            },
          },
        },
      }),
      this.prisma.parent.count({ where: { schoolUser: { schoolId } } }),
    ]);

    return {
      data: parents,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        limit,
        page,
      },
    };
  }

  async create(dto: CreateParentInput, schoolId: string): Promise<Parent> {
    const user = await sendRmqRequest<UserContract>(
      this.authClient,
      AUTH_PATTERNS.FIND_USER_BY_IDENTIFIERS,
      {
        ...(dto.email && {
          email: dto.email,
        }),
        ...(dto.phoneNumber && {
          phoneNumber: dto.phoneNumber,
        }),
      },
    );

    if (user) {
      const schoolUser = await this.prisma.schoolUser.findUnique({
        where: {
          schoolId_userId: { schoolId, userId: user.id },
        },
      });
      if (schoolUser) {
        throw new CoreRpcException(
          'CONFLICT',
          `L'utilisateur existe déjà dans l'établissement.`,
        );
      }
      throw new CoreRpcException(
        'VALIDATION_ERROR',
        "L'email ou numéro de téléphone déjà utilisé.",
      );
    }

    const newUserPayload: CreateUserInput = {
      username: generateUsername({
        firstName: dto.firstName,
        lastName: dto.lastName,
      }),
      ...(dto.email && { email: dto.email }),
      ...(dto.phoneNumber && {
        phoneNumber: dto.phoneNumber,
      }),
      isActive: false,
    };

    return this.prisma.$transaction(async (tx) => {
      const newUser = await sendRmqRequest<UserContract>(
        this.authClient,
        AUTH_PATTERNS.CREATE_USER,
        newUserPayload,
      );
      const schoolUser = await tx.schoolUser.create({
        data: {
          userId: newUser?.id,
          role: 'PARENT',
          schoolId,
          schoolProfile: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              address: dto?.address,
              schoolId,
              gender: dto.gender,
            },
          },
        },
      });
      const newParent = await tx.parent.create({
        data: {
          profession: dto.profession,
          isDelegate: dto.isDelegate ?? undefined,
          schoolUserId: schoolUser.id,
        },
      });
      if (dto.children && dto.children?.length > 0) {
        for (const student of dto.children) {
          await tx.parentStudent.create({
            data: {
              schoolId,
              parentId: newParent.id,
              studentId: student.id,
              relationType: student.relationType,
            },
          });
        }
      }
      return newParent;
    });
  }

  async update(dto: UpdateParentSchema, schoolId: string): Promise<Parent> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Récupération et vérifications initiales (BDD)
      const parent = await tx.parent.findFirst({
        where: { id: dto.id, schoolUser: { schoolId } },
        include: {
          schoolUser: true,
          students: { select: { student: true } },
        },
      });

      if (!parent) {
        throw new CoreRpcException('NOT_FOUND', 'Parent non trouvé.');
      }

      if (dto.email || dto.phoneNumber) {
        const schoolUserCount = await tx.schoolUser.count({
          where: { id: parent.schoolUserId! },
        });
        if (schoolUserCount > 1) {
          throw new CoreRpcException(
            'FORBIDDEN',
            "L'email de l'utilisateur ne peut être modifié, veuillez le contacter.",
          );
        }

        // 2. Appel RabbitMQ en lecture seule (Vérification de doublon)
        // Si cette requête échoue ou lève une exception, la transaction Prisma s'arrête ici (aucun write n'a été fait)
        const existing = await sendRmqRequest<UserContract>(
          this.authClient,
          AUTH_PATTERNS.FIND_USER_BY_IDENTIFIERS,
          {
            ...(dto.email && { email: dto.email }),
            ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
          },
        );
        if (existing) {
          throw new CoreRpcException(
            'CONFLICT',
            "L'utilisateur avec l'email ou numéro existe déjà.",
          );
        }

        // 3. Appel RabbitMQ en ÉCRITURE (Modification de l'utilisateur)
        // /!\ Attention : Si le code crash APRÈS cette ligne, le service Auth sera modifié mais pas Prisma.
        const user = await sendRmqRequest<UserContract>(
          this.authClient,
          AUTH_PATTERNS.UPDATE_USER,
          {
            id: parent.schoolUser?.userId,
            ...(dto.email && { email: dto.email }),
            ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
          },
        );
        if (!user) {
          throw new CoreRpcException(
            'INTERNAL_ERROR',
            'Erreur lors de la mise à jour des données utilisateur.',
          );
        }
      }

      // 4. Traitement des enfants (Boucle for recommandée ici si BDD)
      if (dto.children && dto.children.length > 0) {
        // Si vous devez faire des requêtes Prisma ici, utilisez bien "tx" et non "this.prisma"
        for (const child of dto.children) {
          // Ex: await tx.student.update(...)
        }
      }

      // 5. Mises à jour Prisma locales
      await tx.schoolProfile.update({
        where: { schoolId, schoolUserId: parent.schoolUserId! },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          address: dto?.address,
          gender: dto.gender,
        },
      });

      return tx.parent.update({
        where: { id: parent.id },
        data: { profession: dto.profession },
      });
    });
  }
}
