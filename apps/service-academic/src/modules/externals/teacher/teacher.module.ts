import { Module } from '@nestjs/common';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';

@Module({
  providers: [TeacherResolver, TeacherService],
  controllers: [TeacherController],
})
export class TeacherModule {}
