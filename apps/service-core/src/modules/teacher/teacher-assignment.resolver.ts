import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Teacher, TeacherAssignment } from '../../graphql';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Resolver('TeacherAssignment')
export class TeacherAssignmentResolver {
  @ResolveField('teacher')
  async getAssignments(
    @Parent() parent: TeacherAssignment,
    @Loaders() loaders: DataLoaders,
  ): Promise<Teacher | null> {
    return (await loaders.teacherLoader.load(parent.teacherId)) || null;
  }
}
