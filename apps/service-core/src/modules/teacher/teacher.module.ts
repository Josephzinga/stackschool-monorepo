import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherResolver } from './teacher.resolver';
import { TeacherController } from './teacher.controller';
import { TeacherAssignmentResolver } from './teacher-assignment.resolver';

@Module({
  providers: [TeacherResolver, TeacherService, TeacherAssignmentResolver],
  controllers: [TeacherController],
})
export class TeacherModule {}
