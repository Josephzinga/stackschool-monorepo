import { MembershipService } from '../membership/membership.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ACADEMIC_PATTERNS,
  ACADEMIC_SERVICE,
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  HandleRoleDataInput,
  HandleSchoolDataInput,
  parentChildDraft,
  ProfileContract,
  teacherAssignmentDraft,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class EnrolmentService {
  constructor(
    private readonly memberService: MembershipService,
    private readonly prisma: PrismaService,
    @Inject(ACADEMIC_SERVICE) private readonly academicClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}
  async approveTeacherRole(tempSchoolUserId: string, reviewerId: string) {
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
      this.academicClient.send(
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

  async handleSchoolData({ schoolData, userId, role }: HandleSchoolDataInput) {
    if (schoolData.type === 'create') {
      const newSchool = await this.prisma.school.upsert({
        where: {
          code: schoolData.newSchool.code,
        },
        create: {
          name: schoolData.newSchool.name,
          address: schoolData.newSchool.address,
          code: schoolData.newSchool.code,
        },
        update: {},
        include: {
          memberships: true,
        },
      });
      return {
        ok: true,
        message: 'Ecole crée avec succès.',
        data: {
          schoolId: newSchool.id,
          schoolUserId: newSchool.memberships.find(
            (m) => m.schoolId === newSchool.id,
          )?.id,
        },
      };
    }

    // Cas 2 : Rejoindre une école existante (via recherche ou invitation)
    if (schoolData.type === 'join') {
      const existingSchool = await this.prisma.school.findFirst({
        where: {
          id: schoolData.schoolSelected.id,
        },
      });

      if (!existingSchool)
        throw new CoreRpcException('SCHOOL_NOT_FOUND', 'Ecole introuvable.');

      await this.prisma.tempSchoolUser.upsert({
        where: {
          userId_schoolId: { userId, schoolId: existingSchool.id },
        },
        create: {
          schoolId: existingSchool.id,
          role,
          userId,
        },
        update: {},
      });

      return {
        ok: true,
        message: "Jointure de l'école réussi avec succès",
        data: {
          schoolId: existingSchool.id,
        },
      };
    }

    throw new CoreRpcException('VALIDATION_ERROR', 'Aucun type trouvé');
  }

  async handleRoleData({
    roleData,
    userId,
    schoolId,
    isNewSchool,
  }: HandleRoleDataInput) {
    if (isNewSchool) {
      const membership = this.prisma.schoolUser.upsert({
        where: {
          schoolId_userId: { schoolId, userId },
        },
        create: {
          school: { connect: { id: schoolId } },
          userId,
          role: 'ADMIN',
        },
        update: {},
      });
      return {
        ok: true,
        message: '',
        data: {
          schoolUser: membership,
        },
      };
    }

    const existingMember = await this.memberService.findUnique({
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
        return {
          ok: true,
          message: 'Professeur crée avec succès.',
          data: {},
        };
      }

      case 'STUDENT': {
        const s = roleData.student;
        await this.prisma.student.upsert({
          where: {
            tempSchoolUserId: tempSchoolUser.id,
          },
          create: {
            tempSchoolUserId: tempSchoolUser.id,
            needAdminConfirm: true,
            schoolId,
            matricule: s.matricule,
            birthDate: s.birthDate,
            nationality: s.nationality,
            enrollmentYear: s.enrollmentYear,
            birthPlace: s.birthPlace,
            classId: s.classId,
          },
          update: {},
        });
        return {
          ok: true,
          message: 'Donné élève sauvegarder avec succès.',
          data: {
            tempSchoolUserId: tempSchoolUser.id,
          },
        };
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

      case 'STAFF': {
        await this.prisma.staff.upsert({
          where: {
            tempSchoolUserId: tempSchoolUser.id,
          },
          create: {
            needAdminConfirm: true,
            position: roleData.staff.position,
            hireDate: roleData.staff.hireDate,
            department: roleData.staff.department,
            tempSchoolUserId: tempSchoolUser.id,
          },
          update: {
            position: roleData.staff.position,
            hireDate: roleData.staff.hireDate,
            department: roleData.staff.department,
          },
        });

        return {
          ok: true,
          message: 'Staff créé un succès.',
          data: {
            tempSchoolUserId: tempSchoolUser.id,
          },
        };
      }
      case 'ADMIN': {
        return {
          ok: true,
          message: 'Admin crée avec succèss.',
          data: {},
        };
      }
    }
  }

  private async getProfile(userId: string) {
    return firstValueFrom<ProfileContract>(
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
  }
}
