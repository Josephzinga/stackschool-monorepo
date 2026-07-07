import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SchoolService } from './school.service';
import { CreateSchoolInput } from './dto/create-school.input';
import { SchoolSearchInput } from '../../graphql/graphql';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UseGuards } from '@nestjs/common';
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
    return await this.schoolService.search(search!);
  }
}
