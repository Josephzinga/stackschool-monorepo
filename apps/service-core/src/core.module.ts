import 'dotenv/config';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SchoolModule } from './modules/school/school.module';
import { MembershipModule } from './modules/membership/membership.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'node:path';
import { Request, Response } from 'express';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AUTH_SERVICE, CoreRpcException } from '@stackschool/messaging';
import { EnrolmentModule } from './modules/enrolment/enrolment.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { PrismaService } from './prisma/prisma.service';
import { DataLoaderModule } from './modules/dataloader/dataLoaderModule';
import { DataLoaderService } from './modules/dataloader/dataloader.service';
import { createContext } from './graphql/context';
import { StudentModule } from './modules/student/student.module';
import { RabbitMQClientsModule } from './modules/rabbitmq/rabbitmq-clients.module';
import { ExternalModule } from './modules/external/external.module';
import { ParentModule } from './modules/parent/parent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SchoolModule,
    MembershipModule,
    EnrolmentModule,
    DataLoaderModule,
    TeacherModule,
    RabbitMQClientsModule,
    ExternalModule,
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
            new KeyvRedis(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [DataLoaderModule, ConfigModule, PrismaModule],
      inject: [DataLoaderService, AUTH_SERVICE, PrismaService, CACHE_MANAGER],
      useFactory: (
        dataLoaderService: DataLoaderService,
        authClient: ClientProxy,
        prisma: PrismaService,
        cacheManager: Cache,
      ) => ({
        typePaths: [
          join(process.cwd(), '/src/graphql/schemas/**/*.graphql'),
          join(
            process.cwd(),
            '../../packages/contracts/src/graphql/common/**/*.graphql',
          ),
        ],
        context: async ({ req, res }: { req: Request; res: Response }) => {
          const gqlContext = await createContext({
            req,
            res,
            authClient,
            prisma,
            cacheManager,
          });
          return {
            ...gqlContext,
            loaders: dataLoaderService.createLoaders(),
          };
        },
        formatError: (formattedError, error: any) => {
          // 1. On extrait l'erreur d'origine cachée par Apollo
          const originalError =
            error.originalError || error.extensions?.originalError || error;
          console.log('Original Error', originalError, '\t Error: ', error);
          // 2. On vérifie l'instance sur l'erreur d'origine
          if (originalError instanceof CoreRpcException) {
            return {
              message: originalError.message, // Requis par GraphQL
              extensions: {
                code: originalError.code,
                details: originalError.meta, // Tes métadonnées
              },
            };
          } else if (originalError instanceof RpcException) {
            return {
              message: originalError.message,
              extensions: {
                code: 'FORBIDDEN',
                details: originalError.cause,
              },
            };
          }

          // 3. Fallback pour les erreurs non gérées (ex: erreurs de syntaxe GraphQL)
          return {
            message: 'Erreur interne du serveur.',
            extensions: {
              code: 'INTERNAL_ERROR',
            },
          };
        },
        buildSchemaOptions: {
          dateScalarMode: 'timestamp',
        },
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'class',
          enumsAsTypes: true,
        },
      }),
    }),
    StudentModule,
    ParentModule,
  ],
  exports: [MembershipModule, CacheModule],
})
export class CoreModule {}
