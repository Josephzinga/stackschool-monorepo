import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { UserResolver } from './user.resolver';
import { MembershipResolver } from './membership.resolver';
import { SchoolService } from '../school/school.service';

@Module({
  controllers: [MembershipController],
  providers: [
    MembershipService,
    UserResolver,
    MembershipResolver,
    SchoolService,
  ],
})
export class MembershipModule {}
