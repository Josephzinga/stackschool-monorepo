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
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { createContext } from './graphql/context';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ExternalModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      inject: [CACHE_MANAGER, PrismaService],
      useFactory: (cacheManager: Cache, prisma: PrismaService) => ({
        typePaths: [
          join(process.cwd(), '/src/graphql/**/*.graphql'),
          join(
            process.cwd(),
            '../../packages/contracts/src/graphql/common/common.graphql',
          ),
        ],
        context: ({ req, res }: { req: Request; res: Response }) =>
          createContext({
            req,
            res,
            cacheManager,
            prisma,
          }),
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
