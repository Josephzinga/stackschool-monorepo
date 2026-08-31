import { Module } from '@nestjs/common';
import { ClassResolver } from './class.resolver';
import { ClassService } from './class.service';

@Module({
  imports: [],
  providers: [ClassResolver, ClassService],
})
export class ClassModule {}
