import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';

@Module({
  imports: [],
  providers: [ClassService, ClassResolver],
  exports: [],
})
export class ClassModule {}
