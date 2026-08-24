import {
  Args,
  Context,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { ClassService } from './class.service';
import { ClassList, GetSchoolClassesInput } from '../../graphql';
import { AcademicRpcException } from '@stackschool/messaging';

@Resolver('Class')
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @Query('getSchoolClasses')
  async getSchoolClasses(
    @Args('input') input: GetSchoolClassesInput,
    @Context() ctx: any,
  ): Promise<ClassList> {
    if (!ctx.schoolId && !input.schoolId)
      throw new AcademicRpcException(
        'SCHOOL_ID_NOT_FOUND',
        "Aucun identifiant de de l'établissement définie.",
      );

    return this.classService.getSchoolClasses(
      input,
      input.schoolId || ctx.schoolId,
    );
  }

  @ResolveReference()
  async resolveReference() {}
}
