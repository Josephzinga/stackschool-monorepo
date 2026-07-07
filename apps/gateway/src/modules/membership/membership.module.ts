import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MembershipResolver, MembershipService],
})
export class MembershipModule {}
