import { Injectable } from '@nestjs/common';
import { GetClassSubjectsInput } from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ClassSubjectContract,
  FindClassSubjectInput,
} from '@stackschool/messaging';
import { Prisma } from '../../prisma/db/generated/client';

@Injectable()
export class ClassSubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: GetClassSubjectsInput, schoolId: string) {
    return this.prisma.classSubjects.findMany({
      where: {
        schoolId,
        group: {
          ...(dto?.groupId && {
            id: dto.groupId,
          }),
          ...(dto?.classId && {
            classes: {
              some: {
                id: dto.classId ?? undefined,
              },
            },
          }),
        },
        ...(dto?.teacherId && {
          assignments: {
            teacherId: dto.teacherId,
          },
        }),
      },
    });
  }

  async findOne(
    dto: FindClassSubjectInput,
  ): Promise<ClassSubjectContract | null> {
    const { subjectId, schoolId, classId, teacherId } = dto;

    const where: Prisma.ClassSubjectsWhereInput = {
      schoolId,
    };

    if (subjectId) where.subjectId = subjectId;
    if (classId)
      where.group = {
        classes: {
          some: {
            id: classId,
          },
        },
      };
    if (teacherId)
      where.assignments = {
        teacherId,
      };

    return this.prisma.classSubjects.findFirst({
      where,
    });
  }
}
