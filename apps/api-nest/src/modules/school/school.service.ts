import { Injectable } from '@nestjs/common';
import { CreateSchoolInput } from './dto/create-school.input';
import { UpdateSchoolInput } from './dto/update-school.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@stackschool/db';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService) {}
  create(createSchoolInput: CreateSchoolInput) {
    return 'This action adds a new school';
  }

  findAll() {
    return `This action returns all school`;
  }

  async findOne(where: Prisma.SchoolWhereInput) {
    return this.prisma.school.findFirst({
      where,
    });
  }

  async search(term: string) {
    return await this.prisma.school.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { address: { contains: term, mode: 'insensitive' } },
          { slug: { contains: term, mode: 'insensitive' } },
        ],
      },
    });
  }

  update(id: number, updateSchoolInput: UpdateSchoolInput) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
