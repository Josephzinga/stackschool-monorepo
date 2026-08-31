import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GroupService } from './group.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { Class, ClassSubject, Group } from '../../graphql';

@Resolver('Group')
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}

  @ResolveField('classSubjects')
  async getClassSubjects(
    @Parent() group: Group,
    @Loaders() loaders: DataLoaders,
  ): Promise<ClassSubject[]> {
    return loaders.classSubjectByGroupLoader.load(group.id);
  }

  @ResolveField('classes')
  async getClasses(
    @Parent() group: Group,
    @Loaders() loaders: DataLoaders,
  ): Promise<Class[]> {
    return loaders.classByGroupLoader.load(group.id);
  }
}
