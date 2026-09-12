import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherResolver } from './teacher.resolver';
import { TeacherController } from './teacher.controller';
import { TeacherAssignmentResolver } from './teacher-assignment.resolver';
import { APP_GUARD } from '@nestjs/core';
import { SchoolAccessGuard } from '@stackschool/messaging';

@Module({
  providers: [
    TeacherResolver,
    TeacherService,
    TeacherAssignmentResolver,
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
  ],
  controllers: [TeacherController],
})
export class TeacherModule {}
