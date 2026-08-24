import { Module } from '@nestjs/common';
import { CompleteProfileService } from './complete-profile.service';
import { CompleteProfileResolver } from './complete-profile.resolver';
import { CompleteProfileController } from './complete-profile.controller';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationsModule } from '../notifications/notifications.module';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [NotificationsModule, ClientsModule],
  providers: [
    CompleteProfileResolver,
    CompleteProfileService,
    NotificationsService,
    NotificationsGateway,
  ],
  controllers: [CompleteProfileController],
  exports: [NotificationsService],
})
export class CompleteProfileModule {}
