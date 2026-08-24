import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'node:path';
import { Request, Response } from 'express';
import { AuthModule } from './modules/auth/auth.module';
import { ExternalModule } from './modules/external/external.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ExternalModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useFactory: () => ({
        typePaths: [
          join(process.cwd(), '/src/graphql/**/*.graphql'),
          join(
            process.cwd(),
            '../../packages/contracts/src/graphql/common/common.graphql',
          ),
        ],
        context: ({ req, res }: { req: Request; res: Response }) => {
          const userId = req.headers['x-user-id'];
          const schoolId = req.headers['x-school-id'];
          console.log('userId', userId, 'SchoolId', schoolId);
          return {
            req,
            res,
            userId,
            schoolId,
          };
        },
        buildSchemaOptions: {
          dateScalarMode: 'timestamp',
        },
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'class',
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
            new KeyvRedis(configService.getOrThrow('REDIS_URL')),
          ],
        };
      },
    }),
  ],
})
export class AppModule {}
