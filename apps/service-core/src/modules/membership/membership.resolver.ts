import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MembershipService } from './membership.service';
import {
  GetSchoolMembershipsInput,
  Permission,
  School,
  SchoolMembership,
  SchoolProfile,
} from '../../graphql';
import { SchoolService } from '../school/school.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { UseGuards } from '@nestjs/common';
import { Roles, RolesGuard, SchoolAccessGuard } from '@stackschool/messaging';

@Resolver('SchoolMembership')
@UseGuards(SchoolAccessGuard, RolesGuard)
export class MembershipResolver {
  constructor(
    private readonly memberService: MembershipService,
    private readonly schoolService: SchoolService,
  ) {}

  @Roles('ADMIN', 'STAFF', 'TEACHER')
  @Query('membership')
  async getMembership(@Args('id') id: string) {
    return this.memberService.findUnique({
      id,
    });
  }

  @ResolveField('school')
  async resolveUser(
    @Parent() parent: SchoolMembership,
  ): Promise<School | null> {
    if (!parent.schoolId) return null;
    return this.schoolService.findOne(parent.schoolId);
  }

  @Roles('ADMIN', 'TEACHER', 'STAFF')
  @Query('getMemberships')
  async getMany(
    @Args('input') dto: GetSchoolMembershipsInput,
    @Context('schoolId') schoolId: string,
  ): Promise<SchoolMembership[]> {
    return this.memberService.findSchool(dto, schoolId);
  }

  @ResolveField('permissions')
  async resolvePermission(
    @Parent() parent: SchoolMembership,
    @Loaders() loaders: DataLoaders,
  ): Promise<Permission[]> {
    return loaders.permissionsLoader.load(parent.id);
  }

  @ResolveField('schoolProfile')
  async resolveSchoolProfile(
    @Parent() parent: SchoolMembership,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolProfile | null> {
    return (await loaders.schoolProfileLoader.load(parent.id)) || null;
  }

  @ResolveField('member')
  async resolveMembership(
    @Parent() parent: SchoolMembership,
    @Loaders() loaders: DataLoaders,
  ) {
    return this.memberService.getSchoolMember(parent, loaders);
  }
}
