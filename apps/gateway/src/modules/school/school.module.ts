import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';

@Module({
  imports: [],
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
