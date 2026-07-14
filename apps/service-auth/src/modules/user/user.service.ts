import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../prisma/db/generated/client';
import { UserWithRelationsContract } from '@stackschool/messaging';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserInput: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data: createUserInput,
    });
  }

  async createArgs<T extends Prisma.UserCreateArgs>(
    createUserInput: T,
  ): Promise<Prisma.UserGetPayload<T> | null> {
    return (await this.prisma.user.create(
      createUserInput,
    )) as Prisma.UserGetPayload<T> | null;
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {}
  }

  async validateField({
    phoneNumber,
    email,
    selfCheck = false,
    user,
  }: {
    phoneNumber: string | null;
    email: string | null;
    selfCheck: boolean;
    user: UserWithRelationsContract;
  }) {
    // check email uniqueness
    if (selfCheck ? email && user?.email !== email : email) {
      const existingUser = await this.findUnique({
        where: { email: email ?? undefined },
      });

      if (existingUser) {
        return {
          ok: true,
          valid: false,
          field: 'email',
          message: 'Cette valeur est déjà utilisée.',
        };
      }
    }

    if (
      selfCheck
        ? phoneNumber &&
          user?.phoneNumber?.replace(/\s+/g, '') !==
            phoneNumber?.replace(/\s+/g, '')
        : phoneNumber
    ) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          phoneNumber: phoneNumber?.replace(/\s+/g, ''),
        },
      });

      if (existingUser) {
        return {
          ok: true,
          valid: false,
          field: 'phone',
          message: 'Cette valeur est déjà utilisée.',
        };
      }
    }

    // everything ok
    return {
      ok: true,
      valid: true,
    };
  }

  async findByIdentifier(identifier: string) {
    return await this.findOne({
      where: {
        isActive: true,
        OR: [
          { username: { equals: identifier.trim(), mode: 'insensitive' } },
          { phoneNumber: { equals: identifier.trim(), mode: 'insensitive' } },
          { email: { equals: identifier.trim(), mode: 'insensitive' } },
        ],
      },
    });
  }

  async findByIdentifierWithRelations(identifier: string) {
    return await this.findOne({
      where: {
        isActive: true,
        OR: [
          { username: { equals: identifier.trim(), mode: 'insensitive' } },
          { phoneNumber: { equals: identifier.trim(), mode: 'insensitive' } },
          { email: { equals: identifier.trim(), mode: 'insensitive' } },
        ],
      },
      include: {
        profile: true,
        accounts: true,
      },
    });
  }

  async findOne<T extends Prisma.UserFindFirstArgs>(
    args: T,
  ): Promise<Prisma.UserGetPayload<T> | null> {
    return (await this.prisma.user.findFirst(
      args,
    )) as Prisma.UserGetPayload<T> | null;
  }
  async findUnique<T extends Prisma.UserFindUniqueArgs>(
    args: T,
  ): Promise<Prisma.UserGetPayload<T> | null> {
    return (await this.prisma.user.findFirst(
      args,
    )) as Prisma.UserGetPayload<T> | null;
  }

  update(id: number, _updateUserInput: Prisma.UserCreateInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
