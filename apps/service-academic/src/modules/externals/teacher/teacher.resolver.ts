import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateTeacherAssignmentInput,
  Teacher,
  TeacherAssignment,
} from '../../../graphql';
import { Loaders } from '../../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../../dataloader/dataloader.service';
import { TeacherService } from './teacher.service';

@Resolver('Teacher')
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Mutation('syncTeacherAssignment')
  async syncAssignment(
    @Context('schoolId') schoolId: string,
    @Args('input') dto: CreateTeacherAssignmentInput,
  ) {
    return this.teacherService.syncAssignment(dto, schoolId);
  }

  @ResolveField('assignments')
  async getAssignments(
    @Parent() teacher: Teacher,
    @Loaders() loaders: DataLoaders,
  ): Promise<TeacherAssignment[]> {
    return loaders.assignmentsByTeacherLoader.load(teacher.id);
  }
}
