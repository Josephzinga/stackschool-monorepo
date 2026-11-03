import { Global, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { SchoolModule } from '../school/school.module';

@Global()
@Module({
  imports: [SchoolModule],
  providers: [MembershipService],
  exports: [MembershipService, SchoolModule],
})
export class MembershipModule {}
