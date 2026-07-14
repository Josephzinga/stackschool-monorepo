import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { FindBySchoolIdAndUserIdInput } from '@stackschool/messaging';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(schoolUserIds: string[]) {
    return this.prisma.schoolUser.findMany({
      where: {
        id: {
          in: [...schoolUserIds],
        },
      },
    });
  }

  async findBySchoolIdAndUserId({
    schoolId,
    userId,
  }: FindBySchoolIdAndUserIdInput) {
    return this.prisma.schoolUser.findUnique({
      where: {
        schoolId_userId: {
          schoolId,
          userId,
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.schoolUser.findUnique({
      where: {
        id,
      },
    });
  }

  async findManyByUserId(userIds: string[]) {
    return await this.prisma.schoolUser.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
      },
    });
  }
}
