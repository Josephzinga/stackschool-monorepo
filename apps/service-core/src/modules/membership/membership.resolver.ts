import {
  Resolver,
  ResolveField,
  Parent,
  Query,
  Context,
  ResolveReference,
} from '@nestjs/graphql';
import { MembershipService } from './membership.service';

@Resolver()
export class MembershipResolver {
  constructor(private readonly memberService: MembershipService) {}

  @ResolveField('user')
  async resolveUser(@Parent() parent: any) {
    console.log('Parent', parent);
  }
}
