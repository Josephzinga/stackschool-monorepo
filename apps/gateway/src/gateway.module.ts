import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchoolModule } from './modules/school/school.module';
import { CompleteProfileModule } from './modules/complete-profile/complete-profile.module';
import { createContext } from './graphql/context';
import { ProfileModule } from './modules/profile/profile.module';
import { MembershipModule } from './modules/membership/membership.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Request, Response } from 'express';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterModule } from './modules/rate-limiter/rate-limiter.module';
import { Cache, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { AuthenticatedDataSource } from './graphql/autentificated-datasource';
import { SchoolContextInterceptor } from './common/interceptors/school-context.interceptor';
import { MembershipService } from './modules/membership/membership.service';
import { SchoolService } from './modules/school/school.service';
import { UploadModule } from './modules/upload/upload.module';
import { StorageModule } from './modules/storage/storage.module';
import { PassportModule } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { CORE_SERVICE } from '@stackschool/messaging';
import { UserModule } from './modules/user/user.module';
import { join } from 'node:path';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SessionModule } from './modules/session/session.module';
import { RabbitMQClientsModule } from './modules/rabbitmq/rabbitmq-clients.module';

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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      inject: [CORE_SERVICE, Cache],
      useFactory: (coreClient: ClientProxy, cacheManager: Cache) => ({
        server: {
          context: async ({ req, res }: { req: Request; res: Response }) => {
            return await createContext(req, res, coreClient, cacheManager);
          },
          //  plugins: [ApolloServerPluginLandingPageLocalDefault()],
          playground: true,
          injectRequest: true,
          includeStacktraceInErrorResponses: true,
        },
        typePaths: [join(process.cwd(), '/src/graphql/**/*.graphql')],
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'class',
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'auth', url: 'http://localhost:4001/graphql' },
              { name: 'core', url: 'http://localhost:4002/graphql' },
              { name: 'academic', url: 'http://localhost:4003/graphql' },
            ],
          }),
          buildService: ({ url }) => new AuthenticatedDataSource({ url }),
        },
      }),
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
    SchoolContextInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: SchoolContextInterceptor,
    },
  ],
  exports: [CacheModule, MembershipModule],
})
export class GatewayModule {}
