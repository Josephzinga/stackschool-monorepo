import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParentService } from './parent.service';
import {
  CreateParentInput,
  Gender,
  GetSchoolParentsInput,
  Parent as SchoolParent,
  ParentList,
  ParentStudent,
  SchoolMembership,
  SchoolProfile,
} from '../../graphql';
import { UseGuards } from '@nestjs/common';
import {
  Roles,
  RolesGuard,
  SchoolAccessGuard,
  UpdateParentSchema,
  ZodValidationPipe,
} from '@stackschool/messaging';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';

@Resolver('Parent')
@UseGuards(SchoolAccessGuard)
export class ParentResolver {
  constructor(private readonly parentService: ParentService) {}

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation('createParent')
  async create(
    @Args('input') dto: CreateParentInput,
    @Context('schoolId') schoolId: string,
  ): Promise<SchoolParent> {
    return this.parentService.create(dto, schoolId);
  }

  @Roles('ADMIN', 'STAFF')
  @UseGuards(RolesGuard)
  @Query('getSchoolParents')
  async getSchool(
    @Args('filter') dto: GetSchoolParentsInput,
    @Context('schoolId') schoolId: string,
  ): Promise<ParentList> {
    return this.parentService.getSchool(dto, schoolId);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Mutation('updateParent')
  async update(
    @Args('input', new ZodValidationPipe(UpdateParentSchema))
    dto: UpdateParentSchema,
    @Context('schoolId') schoolId: string,
  ): Promise<SchoolParent> {
    return this.parentService.update(dto, schoolId);
  }

  @ResolveField('parentStudent')
  async getParentStudent(
    @Parent() parent: SchoolParent,
    @Loaders() loaders: DataLoaders,
  ): Promise<ParentStudent[]> {
    return loaders.parentStudentByParentLoader.load(parent.id);
  }

  @ResolveField('member')
  async getMember(
    @Parent() parent: SchoolParent,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolMembership | null> {
    if (!parent.schoolUserId) return null;
    return (await loaders.membershipLoader.load(parent.schoolUserId)) || null;
  }

  @ResolveField('schoolProfile')
  async getSchoolProfile(
    @Parent() parent: SchoolParent,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolProfile | null> {
    if (!parent.schoolUserId) return null;
    const profile =
      (await loaders.schoolProfileLoader.load(parent.schoolUserId)) || null;
    return {
      ...profile,
      id: profile?.id ?? '',
      gender: profile?.gender as Gender,
    };
  }
}
