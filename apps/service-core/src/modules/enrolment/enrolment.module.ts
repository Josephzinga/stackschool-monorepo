import { Module } from '@nestjs/common';
import { MembershipModule } from '../membership/membership.module';
import { EnrolmentService } from './enrolment.service';
import { SchoolModule } from '../school/school.module';
import { EnrolmentController } from './enrolment.controller';
import { MembershipService } from '../membership/membership.service';
import { SchoolService } from '../school/school.service';

@Module({
  imports: [MembershipModule, SchoolModule],
  providers: [EnrolmentService, MembershipService, SchoolService],
  controllers: [EnrolmentController],
  exports: [MembershipModule, SchoolModule],
})
export class EnrolmentModule {}
