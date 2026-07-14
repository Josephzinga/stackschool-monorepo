import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { UserResolver } from './user.resolver';
import { MembershipResolver } from './membership.resolver';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService, UserResolver, MembershipResolver],
})
export class MembershipModule {}
