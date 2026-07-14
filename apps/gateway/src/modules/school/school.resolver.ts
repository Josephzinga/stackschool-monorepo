import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { SchoolService } from './school.service';
import { CreateSchoolInput } from './dto/create-school.input';
import { SchoolSearchInput, IQuery, School } from '../../graphql/graphql';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from '../../utils/zod-validation-pipe';
import { searchSchoolSchema } from './dto/search.input';

@Resolver('School')
export class SchoolResolver {
  constructor(private readonly schoolService: SchoolService) {}

  @Query('searchSchool')
  async searchSchool(
    @Args('filter', new ZodValidationPipe(searchSchoolSchema))
    filter: SchoolSearchInput,
  ) {
    const search = filter.searchTerm?.trim();
    if (!search || search.length < 2)
      throw new BadRequestException(
        'Le terme de recherche dois contenir au moins deux càractère.',
      );
    return await this.schoolService.search(search);
  }

  @Query('school')
  async school(@Args() schoolId: string): Promise<School> {
    return this.schoolService.findById(schoolId);
  }

  @ResolveField('stats')
  async stats() {
    return this.schoolService.getStats();
  }
}
