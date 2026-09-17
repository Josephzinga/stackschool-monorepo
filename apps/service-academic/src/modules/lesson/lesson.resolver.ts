import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import {
  AcademicRpcException,
  CaslAbilityGuard,
  CreateLessonSchema,
  RequireAbility,
  Roles,
  SchoolAccessGuard,
  UpdateLessonSchema,
  ZodValidationPipe,
} from '@stackschool/messaging';
import {
  CreateLessonInput,
  GetLessonsInput,
  Lesson,
  LessonsList,
  LessonStatus,
  TeacherAssignment,
  UpdateLessonInput,
} from '../../graphql';
import { UseGuards } from '@nestjs/common';
import type { GqlContext } from '../../graphql/context';
import { RolesGuard } from '../../common/guards/role.guard';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';

@Resolver('Lesson')
@UseGuards(SchoolAccessGuard, RolesGuard, CaslAbilityGuard)
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

  @Mutation('createLesson')
  @RequireAbility([
    { action: 'MANAGE', subject: 'LESSON' },
    { action: 'CREATE', subject: 'LESSON' },
  ])
  @Roles('ADMIN', 'TEACHER')
  async create(
    @Args('input', new ZodValidationPipe(CreateLessonSchema))
    dto: CreateLessonInput,
    @Context() ctx: GqlContext,
  ) {
    return this.lessonService.create(dto, ctx.schoolId!, ctx.schoolUser!);
  }

  @Roles('ADMIN', 'TEACHER', 'STAFF')
  @RequireAbility([
    { action: 'MANAGE', subject: 'LESSON' },
    { action: 'UPDATE', subject: 'LESSON' },
  ])
  @Mutation('updateLessonStatus')
  async updateStatus(
    @Args()
    dto: { id: string; status: LessonStatus },
    @Context() ctx: GqlContext,
  ) {
    return this.lessonService.updateStatus(dto, ctx.schoolId!, ctx.schoolUser!);
  }

  @Roles('ADMIN', 'TEACHER', 'STAFF')
  @RequireAbility([
    { action: 'MANAGE', subject: 'LESSON' },
    { action: 'UPDATE', subject: 'LESSON' },
  ])
  @Mutation('updateLesson')
  async update(
    @Args('input', new ZodValidationPipe(UpdateLessonSchema))
    dto: UpdateLessonInput,
    @Context() ctx: GqlContext,
  ): Promise<Lesson> {
    if (!dto.id)
      throw new AcademicRpcException(
        'BAD_REQUEST',
        "L'identifiant de la leçon est manquant.",
      );
    return this.lessonService.update(dto, ctx.schoolId!, ctx.schoolUser!);
  }

  @Roles('ADMIN', 'STAFF', 'TEACHER')
  @RequireAbility([
    { action: 'MANAGE', subject: 'LESSON' },
    { action: 'DELETE', subject: 'LESSON' },
  ])
  @Mutation('deleteLesson')
  async delete(@Args('id') id: string, @Context('schoolId') schoolId: string) {
    return this.lessonService.delete(id, schoolId);
  }

  @Query('getLessons')
  @Roles('ADMIN', 'TEACHER', 'STAFF')
  async getLessons(
    @Args('input') input: GetLessonsInput,
    @Context('schoolId') schoolId: string,
  ): Promise<LessonsList> {
    if (input.mode === 'TEACHER') {
      return this.lessonService.getByTeacherResource(input, schoolId);
    }
    return this.lessonService.getByClassResource(input, schoolId);
  }

  @ResolveField('teacherAssignment')
  async getAssignment(
    @Parent() lesson: Lesson,
    @Loaders() loaders: DataLoaders,
  ): Promise<TeacherAssignment | null> {
    if (!lesson.teacherAssignmentId) return null;
    return (
      (await loaders.assignmentLoader.load(lesson.teacherAssignmentId)) ?? null
    );
  }
}
