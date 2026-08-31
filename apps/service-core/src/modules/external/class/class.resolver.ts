import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ClassService } from './class.service';
import { Class, Student, StudentCount } from '../../../graphql';
import { Loaders } from '../../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../../dataloader/dataloader.service';

@Resolver('Class')
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @ResolveField('studentCount')
  async count(
    @Parent() parent: Class,
    @Loaders() loaders: DataLoaders,
  ): Promise<StudentCount> {
    return loaders.studentCountLoaderByClass.load(parent.id);
  }

  @ResolveField('students')
  async getStudents(
    @Parent() parent: Class,
    @Loaders() loaders: DataLoaders,
  ): Promise<Student[]> {
    return loaders.studentsByClassLoader.load(parent.id);
  }

  @ResolveField('supervisor')
  async getSupervisor(
    @Parent() parent: Class,
    @Loaders() loaders: DataLoaders,
  ) {}
}
