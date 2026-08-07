import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../prisma/db/generated/client';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: any) {
    return this.prisma.school.create({
      data: {
        name: dto.name,
        address: dto.address,
        code: dto.code,
        logo: dto.logo ?? null,
        slug: dto.slug ?? null,
      },
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

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
