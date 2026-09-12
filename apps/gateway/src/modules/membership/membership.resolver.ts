import { Mutation, Resolver } from '@nestjs/graphql';
import { MembershipService } from './membership.service';
import { SchoolMembership } from '../../graphql/graphql';

import { SchoolService } from '../school/school.service';

@Resolver('SchoolMembership')
export class MembershipResolver {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly schoolService: SchoolService,
  ) {}

  @Mutation('completeProfile')
  completeProfile() {
    console.log('complete-profile');
  }
}
