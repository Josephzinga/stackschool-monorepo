import { Args, Query, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import {
  CreateLessonSchema,
  Roles,
  RolesGuard,
  ZodValidationPipe,
} from '@stackschool/messaging';
import { CreateLessonInput } from '../../graphql';
import { UseGuards } from '@nestjs/common';
import type { GqlContext } from '../../graphql/context';

@Resolver('Lesson')
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

  @Mutation('createLesson')
  async create(
    @Args('input', new ZodValidationPipe(CreateLessonSchema))
    dto: CreateLessonInput,
    @Context() ctx: GqlContext,
  ) {
    console.log('Context schoolUser', ctx.schoolUser);
    return this.lessonService.create(dto, ctx.schoolId!, ctx.schoolUser!);
  }
}
/* // apps/service-academic/src/lesson/lesson.resolver.ts
@Resolver()
export class LessonResolver {
  constructor(
    private prisma: PrismaService,
    private coreClient: CoreClientService,
  ) {}

  @Query(() => LessonsList)
  @UseGuards(GqlAuthGuard, SchoolAccessGuard) // dupliqué depuis core, cf. remarque plus bas
  async getLessons(@Args('input') input: GetLessonsInput, @Context() ctx): Promise<LessonsList> {
    const schoolId = ctx.schoolUser.schoolId;

    if (input.mode === 'TEACHER') {
      return this.getLessonsByTeacherResource(input, schoolId);
    }
    return this.getLessonsByClassResource(input, schoolId);
  }

  private async getLessonsByTeacherResource(input: GetLessonsInput, schoolId: string) {
    // UN SEUL appel RabbitMQ — vers core, pour obtenir les IDs paginés + les infos d'affichage
    const { teachers, totalCount } = await this.coreClient.findTeachersPaginated({
      schoolId,
      department: input.department,
      hasLessonOnly: input.hasLessonOnly,
      page: input.page,
      limit: input.limit,
    });

    if (teachers.length === 0) {
      return { data: { events: [], resources: [] }, meta: { totalCount: 0, hasNextPage: false } };
    }

    const teacherIds = teachers.map((t) => t.id);

    const lessons = await this.prisma.lesson.findMany({
      where: {
        schoolId,
        deletedAt: null,
        ...(input.status ? { status: input.status } : {}),
        assignments: { teacherId: { in: teacherIds } },
      },
      include: { assignments: { include: { classSubject: { include: { subject: true, group: true } } } }, room: true },
    });

    return {
      data: {
        resources: teachers.map((t) => ({ id: t.id, title: t.fullName, weeklyHours: t.weeklyHours })),
        events: lessons.map((l) => ({
          id: l.id,
          resourceId: l.assignments.teacherId,
          title: l.title ?? l.assignments.classSubject.subject.name,
          startTime: formatTime(l.startTime),
          endTime: formatTime(l.endTime),
          day: l.day,
          status: l.status,
          subject: l.assignments.classSubject.subject,
          group: l.assignments.classSubject.group,
          room: l.room,
          teacher: { __typename: 'Teacher', id: l.assignments.teacherId }, // stub, résolu par Federation à la demande
        })),
      },
      meta: { totalCount, hasNextPage: (input.page + 1) * input.limit < totalCount },
    };
  }

  private async getLessonsByClassResource(input: GetLessonsInput, schoolId: string) {
    // ENTIÈREMENT local — aucun appel RabbitMQ nécessaire, même pour les noms de profs
    const where = { schoolId, ...(input.hasLessonOnly ? { lessonsCount: { gt: 0 } } : {}) };

    const [groups, totalCount] = await Promise.all([
      this.prisma.group.findMany({ where, skip: input.page * input.limit, take: input.limit }),
      this.prisma.group.count({ where }),
    ]);

    const lessons = await this.prisma.lesson.findMany({
      where: { schoolId, deletedAt: null, assignments: { classSubject: { groupId: { in: groups.map((g) => g.id) } } } },
      include: { assignments: true, room: true },
    });

    return {
      data: {
        resources: groups.map((g) => ({ id: g.id, title: g.name, weeklyHours: g.weeklyLessonsCount })),
        events: lessons.map((l) => ({
          id: l.id,
          resourceId: l.assignments.classSubject.groupId,
          teacher: { __typename: 'Teacher', id: l.assignments.teacherId }, // résolu par Federation, PAS d'appel manuel
          // ... reste des champs
        })),
      },
      meta: { totalCount, hasNextPage: (input.page + 1) * input.limit < totalCount },
    };
  }
} */
