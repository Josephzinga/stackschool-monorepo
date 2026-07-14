import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { SchoolModule } from './modules/school/school.module';
import { CompleteProfileModule } from './modules/complete-profile/complete-profile.module';
import { createContext } from './graphql/context';
import { ProfileModule } from './modules/profile/profile.module';
import { MembershipModule } from './modules/membership/membership.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Request } from 'express';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterModule } from './modules/rate-limiter/rate-limiter.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { AuthenticatedDataSource } from './graphql/autentificated-datasource';
import { SchoolContextInterceptor } from './common/interceptors/school-context.interceptor';
import { MembershipService } from './modules/membership/membership.service';
import { SchoolService } from './modules/school/school.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: async ({ req }: { req: Request }) => createContext(req),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        playground: false,
        allowBatchedHttpRequests: true,
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: 'http://localhost:4001/graphql' },
            { name: 'core', url: 'http://localhost:4002/graphql' },
          ],
        }),
        buildService: ({ url }) => new AuthenticatedDataSource({ url }),
      },
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

    SchoolModule,
    CompleteProfileModule,
    ProfileModule,
    MembershipModule,
    RateLimiterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MembershipService,
    SchoolService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SchoolContextInterceptor,
    },
  ],
  exports: [CacheModule],
})
export class AppModule {}
