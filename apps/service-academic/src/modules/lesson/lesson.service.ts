import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonInput } from '../../graphql';
import {
  AcademicRpcException,
  Day,
  LessonStatusEnum,
  RawLessonEvent,
  SchoolUserContract,
  parseTimeString,
} from '@stackschool/messaging';
import { format } from 'date-fns';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

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
    });

    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      const isTeacherConflict = conflict.teacherAssignmentId === assignment.id;
      const isRoomConflict = roomId && conflict.roomId === roomId;

      if (isTeacherConflict) {
        throw new AcademicRpcException(
          'CONFLICT',
          `Le professeur a déjà un cours de ${conflict.assignments.classSubject.subject.name} à ce créneau.`,
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
        `La classe a déjà un cours de ${conflict.assignments.classSubject.subject.name} à ce créneau.`,
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
  private async checkLessonConflict(input: {
    schoolId: string;
    day: Day;
    startTime: Date;
    endTime: Date;
    teacherAssignmentId: string;
    groupId: string;
    roomId?: string;
    excludeLessonId?: string; // utile en cas d'édition d'une leçon existante
  }) {
    const {
      schoolId,
      day,
      startTime,
      endTime,
      teacherAssignmentId,
      groupId,
      roomId,
      excludeLessonId,
    } = input;

    const conflicts = await this.prisma.lesson.findMany({
      where: {
        schoolId,
        day,
        deletedAt: null,
        ...(excludeLessonId ? { id: { not: excludeLessonId } } : {}),

        // Chevauchement horaire réel — filtré directement en SQL
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],

        // Conflit si : même groupe (classe déjà occupée) OU même prof OU même salle
        OR: [
          { assignments: { classSubject: { groupId } } },
          { teacherAssignmentId },
          ...(roomId ? [{ roomId }] : []),
        ],
      },
      include: {
        assignments: {
          include: {
            classSubject: {
              include: { subject: true, group: { include: { classes: true } } },
            },
            teacher: { include: { schoolProfile: true } },
          },
        },
        room: true,
      },
    });

    return conflicts;
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

  // service-academic : tout est local, sauf le nom du prof
  async getLessonsByClassResource(input: GetLessonsInput, schoolId: string) {
    const where = {
      schoolId,
      ...(input.department ? { department: input.department } : {}), // si applicable au niveau Group
      ...(input.hasLessonOnly ? { lessonsCount: { gt: 0 } } : {}), // dénormalisé, même principe que classesCount
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
          include: {
            classSubject: true,
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
          /* ... */
          resourceId: l.assignments.classSubject.groupId,
          teacherId: l.assignments.teacherId,
        })),
      },
      meta: {
        totalCount,
        hasNextPage: (input.page + 1) * input.limit < totalCount,
      },
    };
  }
}
