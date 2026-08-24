import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CompleteProfileService } from './complete-profile.service';

@Resolver('SchoolMembership')
export class CompleteProfileResolver {
  constructor(
    private readonly completeProfileService: CompleteProfileService,
  ) {}

  @Mutation('confirmCompleteProfile')
  confirm() {
    console.log('ComfirmCompleteProfile');
  }
}
