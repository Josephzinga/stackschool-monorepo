import { Module } from '@nestjs/common';
import { ParentStudentService } from './parent-student.service';
import { ParentStudentResolver } from './parent-student.resolver';

@Module({
  providers: [ParentStudentResolver, ParentStudentService],
})
export class ParentStudentModule {}
