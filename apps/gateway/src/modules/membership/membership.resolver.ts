import { Mutation, Resolver } from '@nestjs/graphql';
import { MembershipService } from './membership.service';
import { ResolveField, Parent } from '@nestjs/graphql';
import { SchoolMembership } from '../../graphql/graphql';

import { SchoolService } from '../school/school.service';

@Resolver('SchoolMembership')
export class MembershipResolver {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly schoolService: SchoolService,
  ) {}

  @ResolveField('school')
  async school(@Parent() parent: SchoolMembership) {
    const schoolId = parent.schoolId;
    if (!schoolId) return null;
    return this.membershipService.getSchool(schoolId);
  }
  @Mutation('completeProfile')
  completeProfile() {
    console.log('complete-profile');
  }
}
