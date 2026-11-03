import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ACADEMIC_PATTERNS,
  ACADEMIC_SERVICE,
  AUTH_PATTERNS,
  AUTH_SERVICE,
  CoreRpcException,
  FindManyMemberInput,
  FindManyMemberResponse,
  type HandleRoleDataInput,
  ParentChildDraft,
  ProfileContract,
  SchoolUserContract,
  TeacherAssignmentDraft,
} from '@stackschool/messaging';
import { Prisma } from '../../prisma/db/generated/client';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { z } from 'zod';
import { GetSchoolMembershipsInput, SchoolMembership } from '../../graphql';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(ACADEMIC_SERVICE) private readonly academicClient: ClientProxy,
  ) {}

  async getSchoolMember(parent: SchoolMembership, loaders: DataLoaders) {
    switch (parent.role) {
      case 'STUDENT': {
        const student = await loaders.studentBySchoolUserLoader.load(parent.id);
        return {
          ...student,
          __typename: 'Student',
        };
      }
      case 'TEACHER': {
        const teacher = await loaders.teacherBySchoolUserLoader.load(parent.id);
        if (!teacher) return null;

        return {
          ...teacher,
          __typename: 'Teacher',
        };
      }
      case 'STAFF': {
        const staff = await loaders.staffBySchoolUserLoader.load(parent.id);
        if (!staff) return null;
        return {
          ...staff,
          __typename: 'Staff',
        };
      }

      case 'PARENT': {
        const parents = await loaders.parentBySchoolUserLoader.load(parent.id);
        return {
          ...parents,
          __typename: 'Parent',
        };
      }
      default: {
        return null;
      }
    }
  }

  async findSchool(
    dto: GetSchoolMembershipsInput,
    schoolId: string,
  ): Promise<SchoolMembership[]> {
    const where: Prisma.SchoolUserWhereInput = {
      schoolId,
      isActive: true,
    };

    if (dto.searchTerm) {
      where.schoolProfile = {
        OR: [
          { firstName: { contains: dto.searchTerm, mode: 'insensitive' } },
          { lastName: { contains: dto.searchTerm, mode: 'insensitive' } },
        ],
      };
    }

    if (dto.id) {
      where.id = dto.id;
    }

    return this.prisma.schoolUser.findMany({
      where,
      orderBy: {
        schoolProfile: {
          firstName: 'asc',
        },
      },
      take: dto.limit ?? 50,
    });
  }

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
  async findFull(
    where: Prisma.SchoolUserWhereUniqueInput,
  ): Promise<SchoolUserContract | null> {
    const schoolUser = await this.prisma.schoolUser.findUnique({
      where,
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
        Parent: true,
        teacher: true,
        staff: true,
        student: true,
      },
    });

    if (!schoolUser) {
      return null;
    }

    return {
      ...schoolUser,
      parent: schoolUser.Parent,
      permissions: schoolUser.permissions.map((perm) => perm.permission),
    } as SchoolUserContract;
  }
  async findMany(dto: FindManyMemberInput): Promise<FindManyMemberResponse> {
    const { ids, schoolId, permissions, role } = dto;
    const schoolUsers = await this.prisma.schoolUser.findMany({
      where: {
        schoolId,
        ...(ids &&
          ids.length > 0 && {
            id: {
              in: [...ids],
            },
          }),
        ...(role && {
          role,
        }),
      },
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
    return {
      members: schoolUsers
        .filter((su) => {
          if (permissions && permissions.length > 0) {
            for (const sup of su.permissions) {
              return permissions.some(
                (p) =>
                  p.action === sup.permission.action &&
                  p.subject === sup.permission.subject,
              );
            }
          }
          return true;
        })
        .map((su) => ({
          ...su,
          permissions: su.permissions.map((perm) => perm.permission),
        })),
    };
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
      .array(TeacherAssignmentDraft)
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
          .array(TeacherAssignmentDraft)
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
          .array(ParentChildDraft)
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
                schoolId,
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

  async findAdmins(dto: any) {
    return this.prisma.schoolUser.findMany({
      where: {
        role: 'ADMIN',
        schoolId: dto.schoolId,
      },
    });
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
