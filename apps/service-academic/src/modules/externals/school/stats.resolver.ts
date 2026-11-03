import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SchoolStats } from '../../../graphql';
import { StatsService } from './stats.service';

@Resolver('SchoolStats')
export class StatsResolver {
  constructor(private readonly statsService: StatsService) {}
  @ResolveField('classesOccupancy')
  async resolveClassesOccupancy(
    @Parent() parent: SchoolStats,
  ): Promise<SchoolStats['classesOccupancy']> {
    console.log('school-stats Resolver: ', parent);
    const occupancy = await this.statsService.getClassesOccupancy(parent.id);
  }

  @ResolveField('totalClasses')
  async resolveTotalClasses(
    @Parent() parent: SchoolStats,
  ): Promise<SchoolStats['totalClasses']> {
    console.log('TotalClasses: ', parent);
    return await this.statsService.getTotalClasses(parent.id);
  }
}
