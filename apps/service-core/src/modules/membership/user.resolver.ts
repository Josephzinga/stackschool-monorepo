import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { SchoolMembership, User } from '../../graphql';
import { MembershipService } from './membership.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberService: MembershipService,
  ) {}

  @ResolveField('memberships')
  async resolveMemberships(@Parent() user: User): Promise<SchoolMembership[]> {
    return this.memberService.findManyByUserId([user.id]);
  }
}
