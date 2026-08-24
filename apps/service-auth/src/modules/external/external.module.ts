import { Module } from '@nestjs/common';
import { MembershipResolver } from './membership.resolver';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ExternalService } from './external.service';

@Module({
  imports: [UserModule],
  providers: [MembershipResolver, UserService, ExternalService],
  exports: [],
})
export class ExternalModule {}
