import {
  Resolver,
  ResolveField,
  Parent,
  Query,
  Context,
  ResolveReference,
} from '@nestjs/graphql';
import { MembershipService } from './membership.service';
import { School, SchoolMembership } from '../../graphql';
import { SchoolService } from '../school/school.service';
import { Loaders } from '../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../dataloader/dataloader.service';

@Resolver('SchoolMembership')
export class MembershipResolver {
  constructor(
    private readonly memberService: MembershipService,
    private readonly schoolService: SchoolService,
  ) {}

  @ResolveField('school')
  async resolveUser(
    @Parent() parent: SchoolMembership,
  ): Promise<School | null> {
    if (!parent.schoolId) return null;
    return this.schoolService.findOne(parent.schoolId);
  }

  @ResolveField('permissions')
  async resolvePermission(
    @Parent() parent: SchoolMembership,
    @Loaders() loaders: DataLoaders,
  ) {
    return loaders.permissionsLoader.load(parent.id);
  }
}
