import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserWithRelationsContract } from '@stackschool/messaging';
import { PrismaService } from '../../prisma/prisma.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Query('me')
  async getMe(@Context() ctx: any) {
    return this.userService.findUnique({
      where: {
        id: ctx.userId,
      },
    });
  }
  @ResolveField('profile')
  async resolveProfile(
    @Parent() user: Omit<UserWithRelationsContract, 'profile'>,
  ): Promise<UserWithRelationsContract['profile'] | null> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });
    console.log('profile', profile);
    return profile;
  }

  @ResolveReference()
  async resolveReference(reference: {
    _typename: string;
    id: string;
  }): Promise<Omit<UserWithRelationsContract, 'profile' | 'accounts'> | null> {
    return this.userService.findOne({
      where: {
        id: reference.id,
      },
    });
  }
}
