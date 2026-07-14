import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { SchoolResolver } from './school.resolver';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, SchoolResolver],
})
export class SchoolModule {}
