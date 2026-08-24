import { Resolver, Parent, ResolveField, Args, Context } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { SchoolMembership, User } from '../../graphql';
import { MembershipService } from './membership.service';
import type { GraphqlContextWithLoaders } from '../dataloader/interceptors/dataloader.interceptor';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memberService: MembershipService,
  ) {}

  @ResolveField('memberships')
  async resolveMemberships(
    @Parent() user: User,
    @Context() ctx: GraphqlContextWithLoaders,
  ): Promise<SchoolMembership[]> {
    return this.memberService.findManyByUserId([user.id]);
  }

  @ResolveField('schoolContext')
  async resolveContext(
    @Parent() user: User,
    @Args('schoolId') schoolId: string,
  ): Promise<SchoolMembership | null> {
    return this.memberService.findUnique({
      schoolId_userId: { schoolId, userId: user.id },
    });
  }
}
