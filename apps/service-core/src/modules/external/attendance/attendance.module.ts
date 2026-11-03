import { Module } from '@nestjs/common';
import { AttendanceResolver } from './attendance.resolver';
import { MembershipService } from '../../membership/membership.service';

@Module({
  imports: [],
  providers: [AttendanceResolver, MembershipService],
})
export class AttendanceModule {}
