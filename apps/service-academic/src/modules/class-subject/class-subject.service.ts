import { Injectable } from '@nestjs/common';
import { GetClassSubjectsInput } from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';

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
}
