import { Args, Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SchoolMembership, User } from '../../../graphql';
import type { GraphqlContextWithLoaders } from '../../dataloader/interceptors/dataloader.interceptor';
import { Loaders } from '../../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../../dataloader/dataloader.service';

@Resolver('User')
export class UserResolver {
  @ResolveField('memberships')
  async resolveMemberships(
    @Parent() user: User,
    @Context() ctx: GraphqlContextWithLoaders,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolMembership[]> {
    return (await loaders.membershipsByUserLoader.load(user.id)) || [];
  }

  @ResolveField('schoolContext')
  async resolveContext(
    @Parent() user: User,
    @Args('schoolId') schoolId: string,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolMembership | null> {
    const compositeKey = `${schoolId}_${user.id}`;
    return (
      (await loaders.membershipBySchoolAndUserLoader.load(compositeKey)) || null
    );
  }
}
