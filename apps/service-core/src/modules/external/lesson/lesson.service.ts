import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ACADEMIC_PATTERNS,
  ACADEMIC_SERVICE,
  RawLessonEvent,
  sendRmqRequest,
} from '@stackschool/messaging';
import { ClientProxy } from '@nestjs/microservices';
import { GetLessonsInput, LessonsList } from '../../../graphql';
import { Prisma } from '../../../prisma/db/generated/client';

@Injectable()
export class LessonService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ACADEMIC_SERVICE) private readonly academicClient: ClientProxy,
  ) {}

  async getLessons(
    input: GetLessonsInput,
    schoolId: string,
  ): Promise<LessonsList> {
    if (input.mode === 'CLASS') {
      return this.getLessonsByTeacherResource(input, schoolId);
    }
    return this.getLessonsByClassResource(input, schoolId); // délègue entièrement à academic
  }

  private async getLessonsByTeacherResource(
    input: GetLessonsInput,
    schoolId: string,
  ): Promise<LessonsList> {
    const where: Prisma.TeacherWhereInput = {
      schoolUser: {
        schoolId,
      },
      ...(input.department ? { department: input.department } : {}),
      // ...(input.hasLessonOnly ? { classesCount: { gt: 0 } } : {}), // classesCount déjà dénormalisé (vu en Federation)
    };

    const [teachers, totalCount] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        include: { schoolUser: { select: { schoolProfile: true } } },
        skip: input.page * input.limit,
        take: input.limit,
      }),
      this.prisma.teacher.count({ where }),
    ]);

    if (teachers.length === 0) {
      return {
        data: { events: [], resources: [] },
        meta: { total: 0, limit: input.limit, totalPages: 0, page: input.page },
      };
    }

    // UN SEUL appel RabbitMQ, borné aux IDs déjà paginés — pas de pagination côté academic
    const events = await sendRmqRequest<RawLessonEvent[]>(
      this.academicClient,
      ACADEMIC_PATTERNS.FIND_LESSONS_BY_TEACHER_IDS,
      { schoolId, teacherIds: teachers.map((t) => t.id), status: input.status },
    );

    return {
      data: {
        resources: teachers.map((t) => ({
          id: t.id,
          title: `${t.schoolUser?.schoolProfile?.firstName} ${t.schoolUser?.schoolProfile?.lastName}`,
          weeklyHours: 10,
        })),
        events: events?.map((e) => ({
          ...e,
          status: e.status,
          day: e.day,
          resourceId: e.teacherId,
          teacherId: e.teacherId,
        })),
      },
      meta: {
        total: totalCount,
        page: input.page,
        limit: input.limit,
        totalPages: Math.ceil(totalCount / input.limit),
      },
    };
  }
  private async getLessonsByClassResource(
    input: GetLessonsInput,
    schoolId: string,
  ) {}
}
