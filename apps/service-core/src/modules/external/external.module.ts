import { Module } from '@nestjs/common';
import { ClassModule } from './class/class.module';
import { LessonModule } from './lesson/lesson.module';
import { UserModule } from './user/user.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [ClassModule, LessonModule, UserModule, AttendanceModule],
})
export class ExternalModule {}
