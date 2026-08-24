import { Module } from '@nestjs/common';
import { StatsResolver } from './stats.resolver';
import { StatsService } from './stats.service';

@Module({
  imports: [],
  providers: [StatsResolver, StatsService],
  exports: [],
})
export class SchoolModule {}
