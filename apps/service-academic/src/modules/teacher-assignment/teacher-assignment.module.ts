import { Module } from '@nestjs/common';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { TeacherAssignmentResolver } from './teacher-assignment.resolver';

@Module({
  providers: [TeacherAssignmentResolver, TeacherAssignmentService],
})
export class TeacherAssignmentModule {}
