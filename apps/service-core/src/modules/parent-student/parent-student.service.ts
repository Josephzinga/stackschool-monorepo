import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateParentStudentInput, ParentStudent } from '../../graphql';
import { CoreRpcException } from '@stackschool/messaging';
import { ParentStudent as PrismaParentStudent } from '../../prisma/db/generated/client';

@Injectable()
export class ParentStudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateParentStudentInput[],
    schoolId: string,
  ): Promise<ParentStudent[]> {
    const parentStudents: PrismaParentStudent[] = [];
    await this.prisma.$transaction(async (tx) => {
      for (const data of dto) {
        const parent = await tx.parent.findFirst({
          where: {
            schoolUser: {
              schoolId,
            },
            id: data.parentId!,
          },
        });
        if (!parent)
          throw new CoreRpcException('NOT_FOUND', 'Parent non trouvé.');

        const student = await tx.student.findFirst({
          where: {
            id: data.studentId!,
            schoolId,
          },
        });
        if (!student)
          throw new CoreRpcException('STUDENT_NOT_FOUND', 'Élève non trouvé.');

        const existing = await tx.parentStudent.findUnique({
          where: {
            schoolId,
            parentId_studentId: { parentId: parent.id, studentId: student.id },
          },
        });
        if (existing)
          throw new CoreRpcException('CONFLICT', 'Cette relation existe déjà.');

        const parentStudent = await tx.parentStudent.create({
          data: {
            schoolId,
            parentId: parent.id,
            studentId: student.id,
            relationType: data.relationType!,
          },
        });
        parentStudents.push(parentStudent);
      }
    });
    return parentStudents ?? [];
  }

  async update(
    dto: CreateParentStudentInput[],
    schoolId: string,
  ): Promise<ParentStudent[]> {}
}
