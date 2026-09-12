import { Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { Request } from 'express';
import { UserService } from './user.service';
import { MembershipService } from '../membership/membership.service';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly memberService: MembershipService,
  ) {}

  @Query('me')
  @UseGuards(AuthenticatedGuard)
  getMe(@CurrentUser() user: Request['user']) {
    console.log('Current user', user);
    return user;
  }
}
