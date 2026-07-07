import { Resolver } from '@nestjs/graphql';
import { MembershipService } from './membership.service';
import { ResolveField, Parent } from '@nestjs/graphql';
import { SchoolMembership } from '../../graphql/graphql';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Resolver('SchoolMembership')
export class MembershipResolver {
  constructor(private readonly membershipService: MembershipService) {}

  @ResolveField('school')
  async school(@Parent() parent: SchoolMembership) {
    const schoolId = parent.schoolId;
    if (!schoolId) return null;
    return await this.membershipService.getSchoolById(schoolId);
  }
}
