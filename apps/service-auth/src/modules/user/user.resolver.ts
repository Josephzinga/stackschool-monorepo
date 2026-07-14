import {
  Resolver,
  ResolveField,
  Parent,
  Query,
  Context,
  ResolveReference,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { Profile, User } from '../../graphql';
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
  async resolveProfile(@Parent() user: User): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });
  }

  @ResolveReference()
  async resolveReference(reference: {
    _typename: string;
    id: string;
  }): Promise<User | null> {
    return this.userService.findOne({
      where: {
        id: reference.id,
      },
    });
  }
}
