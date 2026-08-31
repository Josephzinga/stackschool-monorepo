import { Injectable } from '@nestjs/common';
import { ClassSubjectInput } from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClassSubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ClassSubjectInput, schoolId: string) {
    return this.prisma.classSubjects.findMany({
      where: {
        schoolId,
        group: {
          id: dto?.groupId ?? undefined,
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
}
