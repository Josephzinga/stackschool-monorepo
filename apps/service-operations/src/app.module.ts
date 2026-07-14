import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
