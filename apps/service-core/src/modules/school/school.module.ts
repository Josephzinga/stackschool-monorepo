import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { SchoolResolver } from './school.resolver';
import { MembershipModule } from '../membership/membership.module';
import { MembershipService } from '../membership/membership.service';

@Module({
  imports: [MembershipModule],
  controllers: [SchoolController],
  providers: [SchoolService, SchoolResolver, MembershipService],
  exports: [MembershipModule],
})
export class SchoolModule {}
