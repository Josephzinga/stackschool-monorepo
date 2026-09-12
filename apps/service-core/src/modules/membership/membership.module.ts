import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MembershipResolver } from './membership.resolver';
import { SchoolService } from '../school/school.service';
import { APP_GUARD } from '@nestjs/core';
import { SchoolAccessGuard } from '@stackschool/messaging';

@Module({
  controllers: [MembershipController],
  providers: [
    MembershipService,
    MembershipResolver,
    SchoolService,
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
  ],
})
export class MembershipModule {}
