import { Module } from '@nestjs/common';
import { ClassModule } from './class/class.module';
import { LessonModule } from './lesson/lesson.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ClassModule, LessonModule, UserModule],
})
export class ExternalModule {}
