import {
  Resolver,
  Query,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import type { GraphQLContext } from '../../graphql/context';
import { User, Profile, SchoolMembership } from '../../graphql/graphql';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';
import type { UserInMe } from '@stackschool/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('me')
  findOne(@CurrentUser() user: UserInMe) {
    return user;
  }

  @ResolveField('memberships')
  async memberships(
    @Parent() parent: User,
    @Loaders() loaders: DataLoaders,
    @Context() ctx: GraphQLContext,
  ): Promise<SchoolMembership[]> {
    if (!ctx?.schoolUser?.id) return [];

    return (await loaders.membershipLoader.load(ctx?.schoolUser.id)) ?? [];
  }

  @ResolveField('schoolContext')
  async schoolContext(
    @Parent() parent: User,
    @Context() ctx: GraphQLContext,
    @Args('schoolId')
    schoolId: string,
  ): Promise<SchoolMembership | null> {
    if (!schoolId || !ctx?.schoolUser?.id)
      throw new UnauthorizedException(
        "L'Id de l'école est requis pour accéder au contexte de l'école.",
      );

    if (schoolId !== ctx?.schoolUser?.schoolId) {
      throw new UnauthorizedException(
        "Vous n'avez pas accès au contexte de cette école.",
      );
    }
    let memberships: SchoolMembership | null = null;
    if (schoolId) {
      memberships = await this.userService.getMembershipById(
        ctx?.schoolUser?.id,
      );
    } else {
      memberships = await this.userService.getMembership(schoolId, parent.id);
    }
    return memberships;
  }
}
