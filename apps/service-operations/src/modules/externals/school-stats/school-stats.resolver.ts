import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import type { GraphQLContext } from '@stackschool/messaging';

@Resolver('SchoolStats')
export class SchoolStatsResolver {
  constructor() {}

  @ResolveField('attendance')
  async getAttendance(
    @Context() ctx: GraphQLContext,
    @Args('date') date: Date,
  ) {
    console.log('SchoolUser', ctx.schoolUser, ctx.user);
  }
}
