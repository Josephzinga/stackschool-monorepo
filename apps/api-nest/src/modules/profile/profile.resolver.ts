import { Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';

@Resolver('Profile')
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}
}
