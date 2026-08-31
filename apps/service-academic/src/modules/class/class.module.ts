import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassResolver } from './class.resolver';
import { ClassController } from './class.controller';

@Module({
  imports: [ClassModule],
  providers: [ClassService, ClassResolver],
  controllers: [ClassController],
  exports: [ClassModule],
})
export class ClassModule {}
