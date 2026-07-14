import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [NotificationsService, ConfigService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
