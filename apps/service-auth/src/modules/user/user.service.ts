import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@stackschool/db-auth';
import { PrismaService } from '../../prisma/prisma.service';

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
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Erreur lors de requête de users',
      );
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

  update(id: number, _updateUserInput: Prisma.UserCreateInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
