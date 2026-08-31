import { Injectable } from '@nestjs/common';
import {
  CreateSubjectInput,
  DeleteSubjectsInput,
  GetSubjectInput,
  SubjectCategory,
} from '../../graphql';
import { Prisma, Subject } from '../../prisma/db/generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AcademicRpcException } from '@stackschool/messaging';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubjectInput, schoolId: string) {
    const exist = await this.prisma.subject.findFirst({
      where: {
        schoolId,
        deletedAt: null,
        OR: [
          { name: { equals: dto?.name, mode: 'insensitive' } },
          { code: { equals: dto?.code, mode: 'insensitive' } },
        ],
      },
    });
    if (exist) {
      throw new AcademicRpcException(
        'SUBJECT_ALREADY_EXIST',
        'Cette matière existe déjà.',
      );
    }

    const subject = await this.prisma.subject.create({
      data: {
        schoolId,
        name: dto?.name!,
        code: dto?.code,
        mainTeacherId: dto?.mainTeacherId,
        category: dto?.category,
      },
    });

    if (dto?.classSubjects && dto.classSubjects.length > 0) {
      for (const cls of dto?.classSubjects) {
        const group = await this.prisma.group.findFirst({
          where: {
            classes: {
              some: {
                deletedAt: null,
                id: cls.classId!,
              },
            },
          },
        });
        await this.prisma.classSubjects.create({
          data: {
            schoolId,
            subjectId: subject?.id,
            groupId: group?.id!,
            coefficient: cls?.coefficient,
            weeklyHours: cls?.weeklyHours,
          },
        });
      }
    }

    return {
      ...subject,
      category: subject?.category as SubjectCategory,
    };
  }

  async getAll(dto: GetSubjectInput, schoolId: string) {
    const skip = dto.page * dto.limit;
    const search = dto.searchTerm?.trim();

    let whereClause: Prisma.SubjectWhereInput = {
      schoolId,
      deletedAt: null,
    };

    if (dto.classId) {
      whereClause = {
        ...whereClause,
        classSubjects: {
          some: {
            group: {
              classes: {
                some: {
                  id: dto.classId,
                },
              },
            },
          },
        },
      };
    }

    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (dto.teacherId) {
      if (whereClause.classSubjects?.some) {
        whereClause = {
          ...whereClause,
          classSubjects: {
            some: {
              ...whereClause.classSubjects.some,
              assignments: {
                teacherId: dto.teacherId,
              },
            },
          },
        };
      } else {
        whereClause = {
          ...whereClause,
          classSubjects: {
            some: {
              assignments: {
                teacherId: dto.teacherId,
              },
            },
          },
        };
      }
    }
    let orderBy: Prisma.SubjectOrderByWithRelationInput = {
      name: 'asc',
    };

    const [total, subject] = await Promise.all([
      await this.prisma.subject.count({
        where: whereClause,
      }),
      await this.prisma.subject.findMany({
        where: whereClause,
        skip,
        take: dto.limit,
        orderBy,
      }),
    ]);

    return {
      data: subject,
      meta: {
        total,
        page: dto.page,
        limit: dto.limit,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }

  async deleteMany(dto: DeleteSubjectsInput, schoolId: string) {
    const exist = await this.prisma.subject.findMany({
      where: {
        schoolId,
        deletedAt: null,
        id: {
          in: [...dto.subjectIds],
        },
      },
    });

    if (!exist || exist?.length === 0)
      throw new AcademicRpcException(
        'SUBJECT_NOT_FOUND',
        "Ces matières n'existe pas",
      );

    let subjects: Prisma.BatchPayload | null = null;
    if (dto.soft) {
      subjects = await this.prisma.subject.updateMany({
        where: {
          id: { in: [...dto.subjectIds] },
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } else {
      subjects = await this.prisma.subject.deleteMany({
        where: {
          id: {
            in: [...dto.subjectIds],
          },
        },
      });
    }
    return {
      ok: true,
      message: `${subjects?.count ?? 0} matière supprimer avec succès`,
    };
  }
}
