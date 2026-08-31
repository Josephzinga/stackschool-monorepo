import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { ClassService } from './class.service';
import {
  Class,
  ClassList,
  CreateClassInput,
  GetSchoolClassesInput,
} from '../../graphql';
import { AcademicRpcException } from '@stackschool/messaging';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Resolver('Class')
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @Query('getSchoolClasses')
  async getSchoolClasses(
    @Args('input') input: GetSchoolClassesInput,
    @Context('schoolId') schoolId: string | null,
  ): Promise<ClassList> {
    if (!schoolId && !input.schoolId)
      throw new AcademicRpcException(
        'SCHOOL_ID_NOT_FOUND',
        "Aucun identifiant de de l'établissement définie.",
      );

    return this.classService.getSchoolClasses(
      input,
      schoolId! || input.schoolId!,
    );
  }

  @Mutation('createClass')
  async createClass(
    @Args('data') data: CreateClassInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Class> {
    return this.classService.create(data, schoolId);
  }

  @ResolveField('group')
  async getGroup(
    @Parent() parent: Class,
    @Loaders() loaders: DataLoaders,
  ): Promise<Class['group'] | null> {
    return (await loaders.groupLoader.load(parent.groupId)) || null;
  }

  @ResolveReference()
  async resolveReference() {}
}
