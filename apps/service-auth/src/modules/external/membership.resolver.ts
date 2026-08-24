import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ExternalService } from './external.service';
import { UserService } from '../user/user.service';
import { SchoolMembership } from '../../graphql';

@Resolver('SchoolMembership')
export class MembershipResolver {
  constructor(
    private readonly externalService: ExternalService,
    private readonly userService: UserService,
  ) {}

  @ResolveField('user')
  async resolveUser(@Parent() parent: SchoolMembership) {
    console.log('Teacher resolve user: ', parent);
    return this.userService.findOne({
      where: {
        id: parent.userId,
      },
    });
  }
}
