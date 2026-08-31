import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { ClassSubject, TeacherAssignment } from '../../graphql';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Resolver('TeacherAssignment')
export class TeacherAssignmentResolver {
  constructor(
    private readonly teacherAssignmentService: TeacherAssignmentService,
  ) {}

  @ResolveField('classSubject')
  async getClassSubject(
    @Parent() parent: TeacherAssignment,
    @Loaders() loaders: DataLoaders,
  ): Promise<ClassSubject | null> {
    if (!parent.classSubjectId) return null;
    return loaders.classSubjectLoader.load(parent.classSubjectId);
  }
}
