import { Module } from '@nestjs/common';
import { ClassSubjectService } from './class-subject.service';
import { ClassSubjectResolver } from './class-subject.resolver';

@Module({
  providers: [ClassSubjectResolver, ClassSubjectService],
})
export class ClassSubjectModule {}
