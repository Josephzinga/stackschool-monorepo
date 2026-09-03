import {
  Parent,
  ResolveField,
  Resolver,
  Query,
  Args,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { TeacherAssignmentService } from './teacher-assignment.service';
import {
  ApiResponse,
  ClassSubject,
  CreateTeacherAssignmentInput,
  GetTeacherAssignmentInput,
  Teacher,
  TeacherAssignment,
} from '../../graphql';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { UseGuards } from '@nestjs/common';
import { SchoolAccessGuard } from '@stackschool/messaging';

@Resolver('TeacherAssignment')
@UseGuards(SchoolAccessGuard)
export class TeacherAssignmentResolver {
  constructor(
    private readonly teacherAssignmentService: TeacherAssignmentService,
  ) {}

  @Query('getTeacherAssignments')
  async getAssignments(
    @Args('filter') dto: GetTeacherAssignmentInput,
  ): Promise<TeacherAssignment[]> {
    return this.teacherAssignmentService.getMany(dto);
  }

  @Mutation('syncTeacherAssignment')
  async sync(
    @Args('input') dto: CreateTeacherAssignmentInput,
    @Context('schoolId') schoolId: string,
  ): Promise<ApiResponse> {
    return this.teacherAssignmentService.sync(dto, schoolId);
  }

  @ResolveField('classSubject')
  async getClassSubject(
    @Parent() parent: TeacherAssignment,
    @Loaders() loaders: DataLoaders,
  ): Promise<ClassSubject | null> {
    if (!parent.classSubjectId) return null;
    return loaders.classSubjectLoader.load(parent.classSubjectId);
  }
}
