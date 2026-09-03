import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';

@Module({
  providers: [LessonResolver, LessonService],
})
export class LessonModule {}
