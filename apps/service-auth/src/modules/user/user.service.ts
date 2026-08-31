import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../prisma/db/generated/client';
import {
  AuthRpcException,
  UpdateProfileInput,
  ValidateUserFieldInput,
} from '@stackschool/messaging';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheManager: Cache,
  ) {}
  async create(createUserInput: Prisma.UserCreateInput) {
    return this.prisma.user.create({
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
    selfCheck = true,
    userId,
  }: ValidateUserFieldInput) {
    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          ...(selfCheck && { id: { not: userId! } }),
          email,
        },
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

    if (phoneNumber) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          ...(selfCheck && { id: { not: userId! } }),
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
    try {
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
    } catch (e) {
      console.log('DB_ERROR', e);
      throw new AuthRpcException('DB_ERROR', 'Erreur Interne du serveur.');
    }
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

  async update(id: string, _updateUserInput: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: _updateUserInput,
    });
    await this.cacheManager.del(`user:${id}`);
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async updateProfile(userId: string, data: Prisma.ProfileUpdateInput) {
    return this.prisma.profile.upsert({
      where: {
        userId,
      },
      create: {
        avatarUrl: data?.avatarUrl,
      },
      update: {
        avatarUrl: data?.avatarUrl,
      },
    });
  }
  async handleUpdateProfile(data: UpdateProfileInput) {
    const orConditions: Prisma.UserWhereInput[] = [];

    if (data.profileData.phoneNumber) {
      orConditions.push({ phoneNumber: data.profileData.phoneNumber });
    }

    if (data.profileData.email) {
      orConditions.push({ email: data.profileData.email });
    }

    if (orConditions.length === 0) {
      return null;
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        id: { not: data.userId },
        OR: orConditions,
      },
    });

    if (existingUser) {
      throw new AuthRpcException(
        'EMAIL_TAKEN',
        'Email où numéro de téléphone déjà utilisé.',
      );
    }
    try {
      const profile = await this.prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          ...(data.profileData.email && {
            email: data.profileData.email,
          }),
          ...(data.profileData.phoneNumber && {
            phoneNumber: data.profileData.phoneNumber,
          }),
          profile: {
            upsert: {
              create: {
                firstName: data.profileData.firstName,
                lastName: data.profileData.lastName,
                gender: data.profileData.gender,
                avatarUrl: data.profileData.avatarUrl,
                address: data.profileData.address,
              },
              update: {
                firstName: data.profileData.firstName,
                lastName: data.profileData.lastName,
                gender: data.profileData.gender,
                avatarUrl: data.profileData.avatarUrl,
                address: data.profileData.address,
              },
            },
          },
        },
        select: {
          id: true,
          profile: {
            select: {
              id: true,
              avatarUrl: true,
            },
          },
        },
      });
      return {
        ok: true,
        message: 'Misse à jour du profile réussi avec succès.',
        data: {
          profileId: profile.profile?.id,
        },
      };
    } catch (err) {
      console.log('Erreur : ', err);
      throw new AuthRpcException(
        'INTERNAL_ERROR',
        'Erreur lors de la mise à jour du profile.',
      );
    }
  }

  disableByIds(schoolUserIds: string[]) {
    return this.prisma.user.updateMany({
      where: { id: { in: schoolUserIds } },
      data: { isActive: false },
    });
  }
}
