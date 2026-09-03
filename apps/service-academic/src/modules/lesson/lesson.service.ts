import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateLessonInput,
  Day,
  GetLessonsInput,
  GroupType,
  LessonsList,
  LessonStatus,
  SubjectCategory,
  UpdateLessonInput,
} from '../../graphql';
import {
  AcademicRpcException,
  CORE_PATTERNS,
  CORE_SERVICE,
  FindTeachersPaginatedInput,
  FindTeachersPaginatedResponse,
  lessonStatusConfig,
  LessonStatusEnum,
  parseTimeString,
  RawLessonEvent,
  SchoolUserContract,
  sendRmqRequest,
} from '@stackschool/messaging';
import { format } from 'date-fns';
import { ClientProxy } from '@nestjs/microservices';
import { Lesson, Prisma } from '../../prisma/db/generated/client';

@Injectable()
export class LessonService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CORE_SERVICE) private readonly coreClient: ClientProxy,
  ) {}

  async create(
    dto: CreateLessonInput,
    schoolId: string,
    member: SchoolUserContract,
  ) {
    const {
      startTime,
      endTime,
      day,
      subjectId,
      teacherId,
      groupId,
      classId,
      roomId,
      mode,
      title,
    } = dto;

    // Sécurité : Si c'est un prof, il ne peut créer que pour lui-même
    if (member.role === 'TEACHER' && teacherId !== member.teacher?.id) {
      throw new AcademicRpcException(
        'FORBIDDEN',
        'Vous ne pouvez pas créer une leçon pour un autre professeur',
      );
    }

    const currentCS = await this.prisma.classSubjects.findUnique({
      where: {
        groupId_subjectId: { groupId: groupId!, subjectId },
      },
      include: {
        assignments: true,
        subject: {
          select: {
            name: true,
          },
        },
        group: {
          include: {
            classes: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!currentCS)
      throw new AcademicRpcException(
        'FORBIDDEN',
        "Cette matière n'est pas enseigné dans cette Classe. ",
      );

    const assignment = await this.prisma.teacherAssignment.findUnique({
      where: {
        schoolId_classSubjectId_teacherId: {
          schoolId,
          classSubjectId: currentCS.id,
          teacherId: teacherId!,
        },
      },
    });
    if (!assignment) {
      throw new AcademicRpcException(
        'FORBIDDEN',
        `Le professeur n'enseigne pas ${currentCS.subject?.name} dans ${currentCS.group?.classes?.[0]?.name}`,
      );
    }

    const conflicts = await this.checkLessonConflict({
      schoolId,
      day,
      startTime: parseTimeString(startTime),
      endTime: parseTimeString(endTime),
      teacherAssignmentId: assignment.id,
      groupId: currentCS.groupId!,
      roomId: roomId ?? undefined,
      teacherId: teacherId ?? undefined,
    });

    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      const isTeacherConflict = conflict.teacherAssignmentId === assignment.id;
      const isRoomConflict = roomId && conflict.roomId === roomId;

      if (isTeacherConflict) {
        throw new AcademicRpcException(
          'CONFLICT',
          `Le professeur a déjà un cours de ${conflict.assignments.classSubject.subject.name} dans la classe ${conflict.assignments.classSubject.group.name} à ce créneau.`,
        );
      }
      if (isRoomConflict) {
        throw new AcademicRpcException(
          'CONFLICT',
          `La salle est déjà occupée à ce créneau.`,
        );
      }
      throw new AcademicRpcException(
        'CONFLICT',
        mode === 'TEACHER'
          ? `La classe a déjà un cours de ${conflict.assignments.classSubject.subject.name} à ce créneau.`
          : `Le professeur a déjà un cours de ${conflict.assignments.classSubject.subject.name} dans la classe ${conflict.assignments.classSubject.group.name} à ce créneau.`,
      );
    }

    return this.prisma.lesson.create({
      data: {
        schoolId,
        day,
        startTime: parseTimeString(dto.startTime),
        endTime: parseTimeString(dto.endTime),
        teacherAssignmentId: assignment.id,
        roomId,
        title,
      },
    });
  }

  async update(
    dto: UpdateLessonInput,
    schoolId: string,
    schoolUser: SchoolUserContract,
  ): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: dto.id,
      },
      include: {
        assignments: {
          include: {
            classSubject: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });
    if (!lesson)
      throw new AcademicRpcException('NOT_FOUND', 'Leçon non trouvé.');

    if (
      schoolUser.role === 'TEACHER' &&
      lesson.assignments.teacherId !== schoolUser.teacher?.id
    ) {
      throw new AcademicRpcException(
        'FORBIDDEN',
        "Vous ne pouvez pas modifier une leçon qui n'est pas la vôtre.",
      );
    }

    if (lesson.status !== 'PLANNED') {
      throw new AcademicRpcException(
        'FORBIDDEN',
        `Cette leçon est déjà "${lessonStatusConfig[lesson.status].label.toLocaleUpperCase()}". Vous ne pouvez plus modifier sa ressource ou son horaire.`,
      );
    }
    const activeDay = (dto.day ?? lesson.day) as unknown as Day;
    const activeStartTime = dto.startTime ?? lesson.startTime;
    const activeEndTime = dto.endTime ?? lesson.endTime;
    const hasChanges =
      activeDay !== lesson.day ||
      parseTimeString(activeStartTime).getTime() !==
        lesson.startTime.getTime() ||
      parseTimeString(activeEndTime).getTime() !== lesson.endTime.getTime();

    if (!hasChanges) {
      throw new AcademicRpcException(
        'BAD_REQUEST',
        'Aucune modification détectée. Modifiez au moins l’horaire ou le jour de la leçon.',
      );
    }

    const isClassMode = dto.mode === 'CLASS';

    const conflicts = await this.checkLessonConflict({
      schoolId,
      day: activeDay,
      startTime: parseTimeString(activeStartTime),
      endTime: parseTimeString(activeEndTime),
      teacherAssignmentId: lesson.assignments.id,
      groupId: lesson.assignments.classSubject.groupId,
      roomId: lesson.roomId || undefined,
      excludeLessonId: lesson.id,
      teacherId: lesson.assignments.teacherId,
    });
    if (conflicts.length > 0) {
      throw new AcademicRpcException(
        'CONFLICT',
        !isClassMode
          ? `Conflit détecté : la classe est déjà occupé sur ce créneau `
          : 'Conflit détecté : le professeur est déjà occupé sur ce créneau',
      );
    }

    return await this.prisma.lesson.update({
      where: { id: dto.id },
      data: {
        startTime: parseTimeString(activeStartTime),
        endTime: parseTimeString(activeEndTime),
        day: activeDay,
        schoolId,
      },
    });
  }

  async delete(id: string, schoolId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        schoolId,
        id,
      },
    });

    if (!lesson) throw new AcademicRpcException('NOT_FOUND', 'Leçon no trouvé');
    await this.prisma.lesson.delete({
      where: {
        schoolId,
        id,
      },
    });
    return {
      ok: true,
      message: 'Leçon supprimer avec succès.',
    };
  }

  async findLessonsByTeacherIds(dto: {
    schoolId: string;
    status: LessonStatusEnum;
    teacherIds: string[];
  }): Promise<RawLessonEvent[]> {
    const lessons = await this.prisma.lesson.findMany({
      where: {
        schoolId: dto.schoolId,
        deletedAt: null,
        ...(dto.status ? { status: dto.status } : {}),
        assignments: { teacherId: { in: dto.teacherIds } },
      },
      include: {
        assignments: {
          include: {
            classSubject: { include: { subject: true, group: true } },
          },
        },
        room: true,
      },
    });

    return lessons.map((l) => ({
      id: l.id,
      teacherId: l.assignments.teacherId,
      title: l.title ?? l.assignments.classSubject.subject.name,
      startTime: format(l.startTime, 'HH:mm'),
      endTime: format(l.endTime, 'HH:mm'),
      day: l.day,
      status: l.status as LessonStatusEnum,
      subject: l.assignments.classSubject.subject,
      group: l.assignments.classSubject.group,
      room: l.room,
    }));
  }

  async getByTeacherResource(
    input: GetLessonsInput,
    schoolId: string,
  ): Promise<LessonsList> {
    const teachersData = await this.findTeachersPaginated({
      schoolId,
      department: input.department ?? null,
      hasLessonOnly: input.hasLessonOnly ?? false,
      page: input.page,
      limit: input.limit,
    });
    console.log('TEacherData: ', teachersData);
    const teachers = teachersData?.teachers ?? [];
    const totalCount = teachersData?.totalCount ?? 0;

    if (teachers.length === 0) {
      return {
        data: { events: [], resources: [] },
        meta: {
          total: totalCount,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(totalCount / input.limit),
        },
      };
    }

    const teacherIds = teachers.map((t) => t.id);

    const lessons = await this.prisma.lesson.findMany({
      where: {
        schoolId,
        deletedAt: null,
        ...(input.status ? { status: input.status } : {}),
        assignments: { teacherId: { in: teacherIds } },
      },
      include: {
        assignments: {
          include: {
            classSubject: { include: { subject: true, group: true } },
          },
        },
        room: true,
      },
    });

    return {
      data: {
        resources: teachers.map((t) => ({
          id: t.id,
          title: `${t.firstName} ${t.lastName}`,
          weeklyHours: t.weeklyHours ?? 10,
        })),
        events: lessons.map((l) => ({
          id: l.id,
          resourceId: l.assignments.teacherId,
          title: l.title ?? l.assignments.classSubject.subject.name,
          startTime: format(l.startTime, 'HH:mm'),
          endTime: format(l.endTime, 'HH:mm'),
          day: l.day as Day,
          status: l.status as LessonStatus,
          subject: {
            ...l.assignments.classSubject.subject,
            category: l.assignments.classSubject.subject
              .category as SubjectCategory,
          },
          group: {
            ...l.assignments.classSubject.group,
            type: l.assignments.classSubject.group.type as GroupType,
          },
          room: l.room,
          teacherId: l.assignments.teacherId,
        })),
      },
      meta: {
        total: totalCount,
        limit: input.limit,
        page: input.page,
        totalPages: Math.ceil(totalCount / input.limit),
      },
    };
  }

  async getByClassResource(
    input: GetLessonsInput,
    schoolId: string,
  ): Promise<LessonsList> {
    const where: Prisma.GroupWhereInput = {
      schoolId,
    };

    const [groups, totalCount] = await Promise.all([
      this.prisma.group.findMany({
        where,
        skip: input.page * input.limit,
        take: input.limit,
      }),
      this.prisma.group.count({ where }),
    ]);

    const lessons = await this.prisma.lesson.findMany({
      where: {
        schoolId,
        deletedAt: null,
        assignments: {
          classSubject: { groupId: { in: groups.map((g) => g.id) } },
        },
      },
      include: {
        assignments: {
          select: {
            teacherId: true,
            classSubject: {
              select: {
                groupId: true,
                group: {
                  include: {
                    classes: true,
                  },
                },
                subject: true,
              },
            },
          },
        },
        room: true,
      },
    });

    return {
      data: {
        resources: groups.map((g) => ({
          id: g.id,
          title: g.name,
          weeklyHours: 10,
        })),
        events: lessons.map((l) => ({
          id: l.id,
          resourceId: l.assignments.classSubject.groupId,
          title: l.title ?? l.assignments.classSubject.subject.name,
          startTime: format(l.startTime, 'HH:mm'),
          endTime: format(l.endTime, 'HH:mm'),
          day: l.day as Day,
          status: l.status as LessonStatus,
          subject: l.assignments.classSubject.subject,
          group: l.assignments.classSubject.group,
          room: l.room,
          teacherId: l.assignments.teacherId,
        })),
      },
      meta: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / input.limit),
        page: input.page,
        limit: input.limit,
      },
    };
  }

  private async checkLessonConflict(input: {
    schoolId: string;
    day: Day;
    startTime: Date;
    endTime: Date;
    teacherAssignmentId: string;
    groupId: string;
    roomId?: string;
    excludeLessonId?: string; // utile en cas d'édition d'une leçon existante
    teacherId?: string; // utile pour vérifier les conflits de prof
  }) {
    const {
      schoolId,
      day,
      startTime,
      endTime,
      groupId,
      roomId,
      excludeLessonId,
      teacherId,
    } = input;
    const conflicts = await this.prisma.lesson.findMany({
      where: {
        schoolId,
        day,
        ...(excludeLessonId ? { id: { not: excludeLessonId } } : {}),

        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }], // Vérifie le chevauchement des horaires

        // Conflit si : même groupe (classe déjà occupée) OU même prof OU même salle
        assignments: {
          OR: [{ classSubject: { groupId } }, { teacherId }],
        },
      },
      include: {
        assignments: {
          include: {
            classSubject: {
              include: { subject: true, group: true },
            },
          },
        },
        room: true,
      },
    });

    return conflicts;
  }

  private async findTeachersPaginated(
    input: FindTeachersPaginatedInput,
  ): Promise<FindTeachersPaginatedResponse | null> {
    const result = await sendRmqRequest<FindTeachersPaginatedResponse>(
      this.coreClient,
      CORE_PATTERNS.TEACHER.FIND_PAGINATED,
      input,
      undefined,
      4000,
    );
    return result || null;
  }
}
