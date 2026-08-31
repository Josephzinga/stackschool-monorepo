import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ClassSubjectService } from './class-subject.service';
import {
  Class,
  ClassSubject,
  ClassSubjectInput,
  Group,
  Subject,
} from '../../graphql';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Resolver('ClassSubject')
export class ClassSubjectResolver {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @Query('getClassSubjects')
  async getMany(
    @Args('input') dto: ClassSubjectInput,
    @Context('schoolId') schoolId: string,
  ): Promise<ClassSubject[]> {
    return this.classSubjectService.findAll(dto, schoolId);
  }

  @ResolveField('subject')
  async getSubject(
    @Parent() parent: ClassSubject,
    @Loaders() loaders: DataLoaders,
  ): Promise<Subject | null> {
    return (await loaders.subjectLoader.load(parent.subjectId)) || null;
  }

  @ResolveField('group')
  async getClass(
    @Parent() parent: ClassSubject,
    @Loaders() loaders: DataLoaders,
  ): Promise<Group | null> {
    return (await loaders.groupLoader.load(parent.groupId)) || null;
  }
}
