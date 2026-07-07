import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@stackschool/db';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMembershipInput: Prisma.SchoolUserCreateInput) {
    return this.prisma.schoolUser.create({
      data: createMembershipInput,
    });
  }

  async findOne<T extends Prisma.SchoolUserFindUniqueArgs>(
    args: T,
  ): Promise<Prisma.SchoolUserGetPayload<T> | null> {
    return (await this.prisma.schoolUser.findUnique(
      args,
    )) as Prisma.SchoolUserGetPayload<T> | null;
  }

  async getSchoolById(schoolId: string) {
    return await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });
  }
}
