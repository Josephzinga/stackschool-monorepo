import { Args, Query, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import {
  AcademicRpcException,
  CreateLessonSchema,
  Roles,
  SchoolAccessGuard,
  UpdateLessonSchema,
  ZodValidationPipe,
} from '@stackschool/messaging';
import {
  CreateLessonInput,
  GetLessonsInput,
  LessonsList,
  UpdateLessonInput,
  Lesson,
} from '../../graphql';
import { UseGuards } from '@nestjs/common';
import type { GqlContext } from '../../graphql/context';
import { RolesGuard } from '../../common/guards/role.guard';
import { AcademicModule } from '../../academic.module';

@Resolver('Lesson')
@UseGuards(SchoolAccessGuard, RolesGuard)
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

  @Mutation('createLesson')
  @Roles('ADMIN', 'TEACHER')
  async create(
    @Args('input', new ZodValidationPipe(CreateLessonSchema))
    dto: CreateLessonInput,
    @Context() ctx: GqlContext,
  ) {
    return this.lessonService.create(dto, ctx.schoolId!, ctx.schoolUser!);
  }

  @Roles('ADMIN', 'TEACHER')
  @Mutation('updateLesson')
  async update(
    @Args('input', new ZodValidationPipe(UpdateLessonSchema))
    dto: UpdateLessonInput,
    @Context() ctx: GqlContext,
  ): Promise<Lesson> {
    if (!dto.id)
      throw new AcademicRpcException(
        'BAD_REQUEST',
        "L'identifiant du leçon est manquant.",
      );
    return this.lessonService.update(dto, ctx.schoolId!, ctx.schoolUser!);
  }

  @Roles('ADMIN', 'STAFF')
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
}
