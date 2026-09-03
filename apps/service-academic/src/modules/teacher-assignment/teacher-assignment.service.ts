import { Injectable } from '@nestjs/common';
import {
  ApiResponse,
  CreateTeacherAssignmentInput,
  GetTeacherAssignmentInput,
  TeacherAssignment,
} from '../../graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { group } from 'console';
import { Prisma } from '../../prisma/db/generated/client';

@Injectable()
export class TeacherAssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(dto: GetTeacherAssignmentInput): Promise<TeacherAssignment[]> {
    const { classId, teacherId, groupId, limit } = dto;
    const where: Prisma.TeacherAssignmentWhereInput = {
      ...(teacherId && {
        teacherId,
      }),
      ...((groupId || classId) && {
        classSubject: {
          ...(groupId && {
            groupId,
          }),
          ...(classId && {
            group: {
              classes: {
                some: {
                  id: classId,
                },
              },
            },
          }),
        },
      }),
    };

    return await this.prisma.teacherAssignment.findMany({
      where,
      take: limit || 50,
    });
  }

  async sync(
    dto: CreateTeacherAssignmentInput,
    schoolId: string,
  ): Promise<ApiResponse> {
    // À l'intérieur de ton resolver syncTeacherAssignments
    const { teacherId, classId, subjectIds } = dto;

    return await this.prisma.$transaction(async (tx) => {
      // 1. Récupérer les IDs de jonction (ClassSubjects) pour cette classe
      const classSubjects = await tx.classSubjects.findMany({
        where: {
          subjectId: { in: subjectIds },
          group: { classes: { some: { id: classId } } },
        },
      });

      const targetCSIds = classSubjects.map((cs) => cs.id);

      // 2. Récupérer les assignations actuelles
      const currentAssignments = await tx.teacherAssignment.findMany({
        where: {
          teacherId,
          classSubject: { group: { classes: { some: { id: classId } } } },
        },
      });
      const currentCSIds = currentAssignments.map((a) => a.classSubjectId);

      // 3. Calculer les deltas
      const toAdd = targetCSIds.filter((id) => !currentCSIds.includes(id));
      const toDelete = currentAssignments.filter(
        (a) => !targetCSIds.includes(a.classSubjectId),
      );

      // 4. Appliquer les changements
      if (toDelete.length > 0) {
        await tx.teacherAssignment.deleteMany({
          where: { id: { in: toDelete.map((a) => a.id) } },
        });
      }

      if (toAdd.length > 0) {
        await tx.teacherAssignment.createMany({
          data: toAdd.map((csId) => ({
            teacherId,
            classSubjectId: csId,
            schoolId, // Important pour ton multi-tenant
          })),
        });
      }
      return {
        ok: true,
      };
    });
  }
}
