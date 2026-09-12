import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {
  CreateStaffInput,
  GetSchoolStaffInput,
  SchoolMembership,
  SchoolProfile,
  Staff,
  StaffList,
} from '../../graphql';
import { Roles, RolesGuard, SchoolAccessGuard } from '@stackschool/messaging';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import { StaffService } from './staff.service';

@Resolver('Staff')
@UseGuards(SchoolAccessGuard, RolesGuard)
export class StaffResolver {
  constructor(private readonly staffService: StaffService) {}

  @Query('getSchoolStaff')
  @Roles('ADMIN', 'STAFF')
  async getSchoolStaff(
    @Args('input') input: GetSchoolStaffInput,
    @Context('schoolId') schoolId: string,
  ): Promise<StaffList> {
    return this.staffService.getSchool(input, schoolId);
  }

  @Roles('ADMIN')
  @Mutation('createStaff')
  async create(
    @Args('input') dto: CreateStaffInput,
    @Context('schoolId') schoolId: string,
  ): Promise<Staff> {
    return this.staffService.create(dto, schoolId);
  }

  @ResolveField('schoolProfile')
  async resolveSchoolProfile(
    @Parent() staff: Staff,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolProfile | null> {
    if (!staff.schoolUserId) return null;
    return (await loaders.schoolProfileLoader.load(staff.schoolUserId)) ?? null;
  }

  @ResolveField('schoolUser')
  async resolveSchoolUser(
    @Parent() staff: Staff,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolMembership | null> {
    return (await loaders.membershipLoader.load(staff.schoolUserId)) || null;
  }
}
