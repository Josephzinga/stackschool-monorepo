import { Injectable } from '@nestjs/common';
import { CreateTeacherAssignmentInput } from '../../../graphql';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  AcademicRpcException,
  CoreRpcException,
  FindTeacherIdsByClassOrSubject,
} from '@stackschool/messaging';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssignment(dto: CreateTeacherAssignmentInput, schoolId: string) {
    const { subjectIds, teacherId, classId } = dto;
    const existingClassSubjects = await this.prisma.classSubjects.findMany({
      where: {
        schoolId,
        group: { classes: { some: { id: classId } } },
        subjectId: { in: subjectIds },
      },
      include: { subject: true },
    });

    if (existingClassSubjects.length !== subjectIds.length) {
      throw new AcademicRpcException(
        'NOT_FOUND',
        'Certaines matières sont introuvables pour cette classe.',
      );
    }

    const conflicts = await this.prisma.teacherAssignment.findMany({
      where: {
        schoolId,
        classSubjectId: { in: existingClassSubjects.map((cs) => cs.id) },
      },
      select: {
        classSubject: { select: { subject: true } },
      },
    });

    if (conflicts.length > 0) {
      const conflictNames = conflicts
        .map((c) => c.classSubject.subject.name)
        .join(', ');
      throw new CoreRpcException(
        'CONFLICT',
        `Les matières suivantes ont déjà un enseignant : ${conflictNames}`,
      );
    }

    const dataToCreate = existingClassSubjects.map((cs) => ({
      schoolId,
      teacherId,
      classSubjectId: cs.id,
    }));

    const result = await this.prisma.teacherAssignment.createMany({
      data: dataToCreate,
    });

    return {
      ok: true,
      message: `${result.count} assignation(s) créée(s) avec succès`,
    };
  }

  async syncAssignment(dto: CreateTeacherAssignmentInput, schoolId: string) {
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

      return { ok: true };
    });
  }

  async findIdsByClassOrSubject(dto: FindTeacherIdsByClassOrSubject) {
    const assignment = await this.prisma.teacherAssignment.findMany({
      where: {
        schoolId: dto.schoolId,
        classSubject: {
          ...(dto.classId && {
            group: {
              classes: {
                some: {
                  id: dto.classId,
                },
              },
            },
          }),
          ...(dto.subjectId && {
            subjectId: dto.subjectId,
          }),
        },
      },
      select: {
        teacherId: true,
      },
      distinct: ['teacherId'],
    });
    return {
      ids: assignment.map((ass) => ass.teacherId),
    };
  }
}
