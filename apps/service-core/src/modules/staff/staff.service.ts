import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '../../prisma/db/generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffInput, GetSchoolStaffInput, Staff } from '../../graphql';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  CreateUserInput,
  generateUsername,
  sendRmqRequest,
  UserContract,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async getSchool(input: GetSchoolStaffInput, schoolId: string) {
    const { page = 0, limit = 10, searchTerm } = input;
    const search = searchTerm?.trim();
    const where: Prisma.StaffWhereInput = {
      schoolUser: {
        schoolId,
        ...(search && {
          schoolProfile: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        }),
      },
      ...(search && {
        OR: [
          { positionOther: { contains: search, mode: 'insensitive' } },
          { department: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    const [total, data] = await Promise.all([
      this.prisma.staff.count({ where }),
      this.prisma.staff.findMany({
        where,
        skip: page * limit,
        take: limit,
        orderBy: {
          schoolUser: { schoolProfile: { firstName: 'asc' } },
        },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(dto: CreateStaffInput, schoolId: string): Promise<Staff> {
    return this.prisma.$transaction(async (tx) => {
      const user = await sendRmqRequest<UserContract>(
        this.authClient,
        AUTH_PATTERNS.FIND_USER_BY_IDENTIFIERS,
        { email: dto.email, phoneNumber: dto.phoneNumber },
      );

      if (user) {
        const schoolUser = await tx.schoolUser.findUnique({
          where: {
            schoolId_userId: { schoolId, userId: user.id },
          },
        });

        if (schoolUser) {
          throw new CoreRpcException(
            'CONFLICT',
            "L'utilisateur existe déjà dans cet établissement.",
          );
        }
        throw new CoreRpcException(
          'VALIDATION_ERROR',
          "L'email ou numéro de téléphone déjà utilisé.",
        );
      }

      const userPayload: CreateUserInput = {
        isActive: false,
        ...(dto.phoneNumber && {
          phoneNumber: dto.phoneNumber,
        }),
        ...(dto.email && {
          email: dto.email,
        }),
        username: generateUsername({
          firstName: dto.firstName,
          lastName: dto.lastName,
        }),
      };
      const newUser = await sendRmqRequest<UserContract>(
        this.authClient,
        AUTH_PATTERNS.CREATE_USER,
        userPayload,
      );

      if (!newUser)
        throw new CoreRpcException(
          'INTERNAL_ERROR',
          "Erreur lors de la création de l'utilisateur.",
        );

      const schoolUser = await tx.schoolUser.create({
        data: {
          userId: newUser.id,
          schoolId,
          role: 'STAFF',
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

      const staff = await tx.staff.create({
        data: {
          schoolUserId: schoolUser.id,
          position: dto.position,
          department: dto.department,
        },
      });
      return {
        ...staff,
        schoolUserId: staff.schoolUserId!,
      };
    });
  }
}
