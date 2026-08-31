import { Module } from '@nestjs/common';
import { ClassModule } from './class/class.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [ClassModule, LessonModule],
})
export class ExternalModule {}
