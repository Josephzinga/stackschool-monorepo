import { Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DataloaderModule } from './modules/dataloader/dataloader.module';
import { SchoolModule } from './modules/school/school.module';
import { CompleteProfileModule } from './modules/complete-profile/complete-profile.module';
import { createContext } from './graphql/context';
import { PrismaService } from './prisma/prisma.service';
import { ProfileModule } from './modules/profile/profile.module';
import { MembershipModule } from './modules/membership/membership.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Request } from 'express';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterModule } from './modules/rate-limiter/rate-limiter.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [PrismaService],
      imports: [PrismaModule],
      useFactory: (prisma: PrismaService) => ({
        driver: ApolloDriver,
        typePaths: [join('../../packages/shared/src/graphql/**/*.graphql')],
        context: async ({ req }: { req: Request }) => {
          if (req.isUnauthenticated())
            throw new UnauthorizedException({
              statusCode: 401,
              message: 'Utilisateur non authentifier.',
            });

          await createContext(req, prisma);
        },
        definitions: { path: join(process.cwd(), 'src/graphql.ts') },
        playground: true,
      }),
    }),

    PrismaModule,
    DataloaderModule,
    NotificationsModule,
    SchoolModule,
    CompleteProfileModule,
    ProfileModule,
    MembershipModule,
    RateLimiterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
