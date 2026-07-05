import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CompleteProfileService } from './complete-profile.service';
import { CreateCompleteProfileInput } from './dto/create-complete-profile.input';
import { UpdateCompleteProfileInput } from './dto/update-complete-profile.input';

@Resolver('CompleteProfile')
export class CompleteProfileResolver {
  constructor(
    private readonly completeProfileService: CompleteProfileService,
  ) {}
}
