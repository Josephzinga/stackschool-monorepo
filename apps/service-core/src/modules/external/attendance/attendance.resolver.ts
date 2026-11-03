import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AttendanceRecord, SchoolMembership } from '../../../graphql';
import { Loaders } from '../../dataloader/decorators/dataloader.decorator';
import type { DataLoaders } from '../../dataloader/dataloader.service';
import { MembershipService } from '../../membership/membership.service';

@Resolver('AttendanceRecord')
export class AttendanceResolver {
  constructor(private readonly memberService: MembershipService) {}

  @ResolveField('recordedBy')
  async getRecordedBy(
    @Parent() parent: AttendanceRecord,
    @Loaders() loaders: DataLoaders,
  ): Promise<SchoolMembership | null> {
    return (await loaders.membershipLoader.load(parent.recordedById)) || null;
  }

  @ResolveField('member')
  async getMember(
    @Parent() parent: SchoolMembership,
    @Loaders() loaders: DataLoaders,
  ) {
    return this.memberService.getSchoolMember(parent, loaders);
  }
}
