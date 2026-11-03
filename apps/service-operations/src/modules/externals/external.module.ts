import { Module } from '@nestjs/common';
import { SchoolStatsResolver } from './school-stats/school-stats.resolver';

@Module({
  imports: [],
  providers: [SchoolStatsResolver],
})
export class ExternalModule {}
