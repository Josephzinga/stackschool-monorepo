import { Module } from '@nestjs/common';
import { ClassSubjectService } from './class-subject.service';
import { ClassSubjectResolver } from './class-subject.resolver';
import { ClassSubjectController } from './class-subject.controller';

@Module({
  providers: [ClassSubjectResolver, ClassSubjectService],
  controllers: [ClassSubjectController],
})
export class ClassSubjectModule {}
