import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceResolver } from './attendance.resolver';

@Module({
  providers: [AttendanceResolver, AttendanceService],
})
export class AttendanceModule {}
