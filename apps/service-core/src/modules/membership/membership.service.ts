import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ACADEMIC_PATTERNS,
  ACADEMIC_SERVICE,
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  type HandleRoleDataInput,
  parentChildDraft,
  ProfileContract,
  teacherAssignmentDraft,
} from '@stackschool/messaging';
import { Prisma } from '../../prisma/db/generated/client';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { z } from 'zod';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(ACADEMIC_SERVICE) private readonly academicClient: ClientProxy,
  ) {}

  async create(input: Prisma.SchoolUserCreateInput) {
    return this.prisma.schoolUser.create({
      data: input,
    });
  }
  async findUnique(where: Prisma.SchoolUserWhereUniqueInput) {
    return this.prisma.schoolUser.findUnique({
      where,
    });
  }
  async findMany(schoolUserIds: string[]) {
    return this.prisma.schoolUser.findMany({
      where: {
        id: {
          in: [...schoolUserIds],
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.schoolUser.findUnique({
      where: {
        id,
      },
    });
  }

  async findManyByUserId(userIds: string[]) {
    return this.prisma.schoolUser.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
      },
    });
  }
  // service-core : approbation du rôle Teacher
  async approveTeacherRole(tempSchoolUserId: string) {
    const tempUser = await this.prisma.tempSchoolUser.findUniqueOrThrow({
      where: { id: tempSchoolUserId },
      include: { teacher: true },
    });

    const teacher = await this.prisma.teacher.update({
      where: { id: tempUser.teacher?.id },
      data: { needAdminConfirm: false },
    });

    // Crée le SchoolUser définitif (pivot)
    await this.prisma.schoolUser.create({
      data: {
        userId: tempUser.userId,
        schoolId: tempUser.schoolId,
        role: 'TEACHER',
      },
    });

    // Matérialise les assignations dans academic — SEULEMENT maintenant
    const assignments = z
      .array(teacherAssignmentDraft)
      .parse(teacher.pendingAssignments ?? []);
    if (assignments.length > 0) {
      this.academicClient.send<void>(
        ACADEMIC_PATTERNS.MATERIALIZE_TEACHER_ASSIGNMENTS,
        {
          teacherId: teacher.id,
          schoolId: tempUser.schoolId,
          assignments,
        },
      );
    }

    await this.prisma.tempSchoolUser.delete({
      where: { id: tempSchoolUserId },
    });
  }
  async handleRoleData({ roleData, userId, schoolId }: HandleRoleDataInput) {
    const existingMember = await this.findUnique({
      schoolId_userId: { schoolId, userId },
    });
    if (existingMember) {
      throw new CoreRpcException(
        'MEMBERSHIP_ALREADY_EXIST',
        'Vous êtes déjà membre de cette école.',
      );
    }

    const tempSchoolUser = await this.prisma.tempSchoolUser.upsert({
      where: { userId_schoolId: { schoolId, userId } },
      create: { userId, schoolId, role: roleData.role },
      update: {},
      include: { teacher: true, staff: true, parent: true, student: true },
    });

    switch (roleData.role) {
      case 'TEACHER': {
        const assignments = z
          .array(teacherAssignmentDraft)
          .parse(roleData.teacher.assignments ?? []);

        await this.prisma.teacher.upsert({
          where: { tempSchoolUserId: tempSchoolUser.id },
          create: {
            tempSchoolUserId: tempSchoolUser.id,
            diploma: roleData.teacher.diploma,
            department: roleData.teacher.department,
            isActive: true,
            needAdminConfirm: true,
            pendingAssignments: assignments, // JSON brut, RIEN écrit dans academic pour l'instant
          },
          update: {
            diploma: roleData.teacher.diploma,
            department: roleData.teacher.department,
            pendingAssignments: assignments,
          },
        });
        break;
      }

      case 'STUDENT': {
        const { id: profileId } = await this.getProfile(userId);
        const s = roleData.student;

        await this.prisma.student.create({
          data: {
            tempSchoolUserId: tempSchoolUser.id,
            needAdminConfirm: true,
            schoolId,
            profileId,
            matricule: s.matricule,
            motherName: s.motherName,
            fatherName: s.fatherName,
            birthDate: s.birthDate,
            nationality: s.nationality,
            enrollmentYear: s.enrollmentYear,
            birthPlace: s.birthPlace,
            classId: s.classId,
          },
        });
        break;
      }

      case 'PARENT': {
        const children = z
          .array(parentChildDraft)
          .parse(roleData.parent.children ?? []);

        const parent = await this.prisma.parent.create({
          data: {
            tempSchoolUserId: tempSchoolUser.id,
            needAdminConfirm: true,
            profession: roleData.parent.profession,
            contactPreference: roleData.parent.contactPreference,
          },
        });

        // Student vit dans core → création directe possible, MAIS toujours avec needAdminConfirm
        for (const child of children) {
          if (child?.studentId) {
            await this.prisma.parentStudent.create({
              data: {
                needAdminConfirm: true,
                parentId: parent.id,
                studentId: child.studentId,
                relationType: child.relationType,
              },
            });
          }
          // Si studentRawName seulement (pas de match) : à gérer via un ParentChildLinkRequest
          // séparé pour que l'admin résolve manuellement — cf. discussion précédente
        }
        break;
      }

      case 'STAFF':
        // même logique que TEACHER si Staff a aussi des assignations cross-service
        break;

      case 'ADMIN':
        break;
    }
  }
  private async getProfile(userId: string) {
    const result = firstValueFrom<ProfileContract>(
      this.authClient.send(AUTH_PATTERNS.GET_PROFILE, { userId }).pipe(
        timeout(3000),
        catchError((err) =>
          throwError(
            () =>
              new CoreRpcException(
                'AUTH_SERVICE_ERROR',
                'Echec lors de la recupération du profile.',
                err,
              ),
          ),
        ),
      ),
    );
    return result;
  }
}
