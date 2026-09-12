import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MembershipModule } from '../membership/membership.module';
import { MembershipService } from '../membership/membership.service';
import { SchoolResolver } from './school.resolver';

@Module({
  imports: [MembershipModule],
  controllers: [SchoolController],
  providers: [SchoolService, SchoolResolver, MembershipService],
  exports: [MembershipModule],
})
export class SchoolModule {}
