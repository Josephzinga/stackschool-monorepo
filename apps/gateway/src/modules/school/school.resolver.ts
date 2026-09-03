import { Args, Query, Resolver } from '@nestjs/graphql';
import { SchoolService } from './school.service';
import { School, SchoolSearchInput } from '../../graphql/graphql';
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
        'Le terme de recherche doit contenir au moins deux caractère.',
      );
    return await this.schoolService.search(search);
  }

  @Query('school')
  async school(@Args() schoolId: string): Promise<School> {
    return this.schoolService.findById(schoolId);
  }
}
