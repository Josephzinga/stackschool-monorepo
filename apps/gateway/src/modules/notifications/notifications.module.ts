import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { SessionSocketAuthService } from './session-socket-auth.service';
import { SessionModule } from '../session/session.module';
import { MembershipService } from '../membership/membership.service';
import { SchoolService } from '../school/school.service';

@Module({
  imports: [SessionModule],
  providers: [
    NotificationsGateway,
    NotificationsService,
    SessionSocketAuthService,
    MembershipService,
    SchoolService,
  ],
  exports: [
    NotificationsGateway,
    SessionSocketAuthService,
    MembershipService,
    SchoolService,
  ],
})
export class NotificationsModule {}
