import { Global, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';
import { SchoolModule } from '../school/school.module';

@Global()
@Module({
  imports: [SchoolModule],
  providers: [MembershipResolver, MembershipService],
  exports: [MembershipService, SchoolModule],
})
export class MembershipModule {}
