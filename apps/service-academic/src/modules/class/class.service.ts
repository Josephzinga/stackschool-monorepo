import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../prisma/db/generated/client';
import { CreateClassInput, GetSchoolClassesInput } from '../../graphql';
import { AcademicRpcException } from '@stackschool/messaging';

@Injectable()
export class ClassService {
  constructor(private readonly prisma: PrismaService) {}

  async getClasses(where: Prisma.ClassWhereInput) {
    return this.prisma.class.findMany({
      where,
    });
  }

  async getSchoolClasses(
    {
      page,
      limit,
      level,
      searchTerm,
      section,
      teacherId,
    }: GetSchoolClassesInput,
    schoolId: string,
  ) {
    const skip = page * limit;
    const search = searchTerm?.trim();

    let whereClause: Prisma.ClassWhereInput = { schoolId };

    if (teacherId) {
      whereClause.group = {
        classSubjects: {
          some: {
            assignments: {
              teacherId,
            },
          },
        },
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { section: { contains: search, mode: 'insensitive' } },
        { level: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (level) {
      whereClause.level = {
        equals: level,
        mode: 'insensitive',
      };
    }

    if (section) {
      whereClause.section = {
        equals: section,
        mode: 'insensitive',
      };
    }

    const [total, classes] = await Promise.all([
      this.prisma.class.count({ where: whereClause }),
      this.prisma.class.findMany({
        where: whereClause,
        take: limit,
        skip,
        orderBy: { name: 'asc' },
      }),
    ]);
    return {
      data: classes || [],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: CreateClassInput, schoolId: string) {
    const existing = await this.prisma.class.findFirst({
      where: {
        name: { equals: data.name, mode: 'insensitive' },
        schoolId,
      },
    });

    if (existing) {
      throw new AcademicRpcException(
        'CLASS_ALREADY_EXISTS',
        'Une classe avec ce nom existe déjà',
      );
    }

    const group = await this.prisma.group.create({
      data: {
        schoolId,
        name: data.name,
        type: 'SOLO',
        classes: {
          create: {
            name: data.name,
            level: data.level,
            section: data.section,
            schoolId,
            supervisorId: data.supervisorId || undefined,
          },
        },
      },
      select: {
        classes: true,
      },
    });

    return group.classes?.[0];
  }

  findOne(id: string, schoolId?: string) {
    if (schoolId) {
      return this.prisma.class.findFirst({
        where: {
          id,
          schoolId,
        },
      });
    }
    return this.prisma.class.findUnique({
      where: {
        id,
      },
    });
  }
}
