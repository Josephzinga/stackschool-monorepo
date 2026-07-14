import {
  Resolver,
  Query,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { Request } from 'express';
import { UserService } from './user.service';
import { MembershipService } from '../membership/membership.service';
import { UserWithRelationsContract } from '@stackschool/messaging';
import { SchoolMembership } from '../../graphql/graphql';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly memberService: MembershipService,
  ) {}
  @Query('me')
  getMe(@CurrentUser() user: Request['user']) {
    return user;
  }

  @ResolveField('memberships')
  async getMemberShips(
    @Context() ctx: any,
    @CurrentUser() user: Request['user'],
    @Parent() parent: UserWithRelationsContract,
  ): Promise<SchoolMembership[]> {
    return this.memberService.findManyByUserId(parent.id);
  }
}
