import { Global, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';
import { SchoolModule } from '../school/school.module';
import { SchoolService } from '../school/school.service';

@Global()
@Module({
  imports: [SchoolModule],
  providers: [MembershipResolver, MembershipService, SchoolService],
  exports: [SchoolModule],
})
export class MembershipModule {}
