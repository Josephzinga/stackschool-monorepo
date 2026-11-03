import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv, KeyvCacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AppGraphqlModule } from './modules/graphql/graphql.module';
import { RabbitMQClientsModule } from './modules/rabbitmq/rabbitmq-clients.module';
import { ExternalModule } from './modules/externals/external.module';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthenticatedGuard,
  CaslAbilityGuard,
  RolesGuard,
  SchoolAccessGuard,
} from '@stackschool/messaging';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    NotificationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AppGraphqlModule,
    RabbitMQClientsModule,
    ExternalModule,
    PrismaModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({
                ttl: 60000,
                lruSize: 5000,
                maxTtl: 1000 * 60 * 60 * 24,
              }),
            }),
            new KeyvRedis(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),

    AttendanceModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CaslAbilityGuard },
  ],
})
export class OperationsModule {}
