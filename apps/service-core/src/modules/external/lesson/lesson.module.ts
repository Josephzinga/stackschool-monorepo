import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';

@Module({
  providers: [LessonService, LessonResolver],
})
export class LessonModule {}
