import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchoolModule } from './modules/school/school.module';
import { CompleteProfileModule } from './modules/complete-profile/complete-profile.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MembershipModule } from './modules/membership/membership.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterModule } from './modules/rate-limiter/rate-limiter.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { MembershipService } from './modules/membership/membership.service';
import { SchoolService } from './modules/school/school.service';
import { UploadModule } from './modules/upload/upload.module';
import { StorageModule } from './modules/storage/storage.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './modules/user/user.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SessionModule } from './modules/session/session.module';
import { RabbitMQClientsModule } from './modules/rabbitmq/rabbitmq-clients.module';
import { AppGraphqlModule } from './modules/graphql/graphql.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './modules/auth/guards/authenticated.guard';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UploadModule,
    StorageModule,
    SchoolModule,
    CompleteProfileModule,
    ProfileModule,
    MembershipModule,
    RateLimiterModule,
    UserModule,
    SessionModule,
    RabbitMQClientsModule,
    AppGraphqlModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(configService.get('REDIS_URL')),
          ],
        };
      },
    }),
    NotificationsModule,
  ],
  providers: [
    MembershipService,
    SchoolService,
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
  ],
  exports: [CacheModule, MembershipModule],
})
export class GatewayModule {}
