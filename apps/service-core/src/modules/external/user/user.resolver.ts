import { Args, Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SchoolMembership, User } from '../../../graphql';
import { Loaders } from '../../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../../dataloader/dataloader.service';
import type { GraphQLContext } from '@stackschool/messaging';

@Resolver('User')
export class UserResolver {
  @ResolveField('memberships')
  async resolveMemberships(
    @Parent() user: User,
    @Context() ctx: GraphQLContext,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolMembership[]> {
    return (await loaders.membershipsByUserLoader.load(user.id)) || [];
  }

  @ResolveField('schoolContext')
  async resolveContext(
    @Parent() user: User,
    @Args('schoolId') schoolId: string | undefined | null,
    @Context('schoolId') ctxSchoolId: string,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolMembership | null> {
    const id = ctxSchoolId || schoolId;
    const compositeKey = `${id}_${user.id}`;
    return (
      (await loaders.membershipBySchoolAndUserLoader.load(compositeKey)) || null
    );
  }
}
