import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { LessonController } from './lesson.controller';

@Module({
  providers: [LessonResolver, LessonService],
  controllers: [LessonController],
})
export class LessonModule {}
