import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../prisma/db/generated/client';
import { MembershipService } from '../membership/membership.service';

@Injectable()
export class SchoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberService: MembershipService,
  ) {}
  async create(dto: Prisma.SchoolCreateInput) {
    return this.prisma.school.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all school`;
  }

  async findOne(id: string) {
    return this.prisma.school.findUnique({
      where: {
        id,
      },
    });
  }

  async findUnique(where: Prisma.SchoolWhereUniqueInput) {
    return this.prisma.school.findUnique({
      where,
    });
  }

  async findWhere(where: Prisma.SchoolWhereInput) {
    return this.prisma.school.findFirst({
      where,
    });
  }
  async search(search: string) {
    return this.prisma.school.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      },
    });
  }

  async getSchoolStats(schoolId: string) {
    const totalStudents = await this.prisma.student.count({
      where: {
        schoolUser: {
          schoolId,
        },
      },
    });

    const totalTeachers = await this.prisma.teacher.count({
      where: {
        schoolUser: {
          schoolId,
        },
      },
    });
    return {
      id: schoolId,
      totalStudents,
      totalTeachers,
    };
  }
}
