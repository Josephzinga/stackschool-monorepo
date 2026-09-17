import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { SchoolAccessGuard } from '@stackschool/messaging';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    LessonResolver,
    LessonService,
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
  ],
})
export class LessonModule {}
