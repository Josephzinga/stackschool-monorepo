import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentResolver } from './student.resolver';
import { ClassService } from '../../class/class.service';

@Module({
  providers: [StudentResolver, StudentService, ClassService],
})
export class StudentModule {}
