import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentResolver } from './student.resolver';
import { StudentController } from './student.controller';

@Module({
  controllers: [StudentController],
  providers: [StudentResolver, StudentService],
})
export class StudentModule {}
