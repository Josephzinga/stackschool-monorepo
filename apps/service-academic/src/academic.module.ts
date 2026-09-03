import { Module } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { ClassModule } from './modules/class/class.module';
import { DataLoaderModule } from './modules/dataloader/dataloader.module';
import { RabbitMQClientsModule } from './modules/rabbitmq/rabbitmq-clients.module';
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { createContext, GqlContext } from './graphql/context';
import {
  AcademicRpcException,
  AUTH_SERVICE,
  CORE_SERVICE,
} from '@stackschool/messaging';
import { DataLoaderService } from './modules/dataloader/dataloader.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SubjectModule } from './modules/subject/subject.module';
import { GroupModule } from './modules/group/group.module';
import { ClassSubjectModule } from './modules/class-subject/class-subject.module';
import { TeacherModule } from './modules/externals/teacher/teacher.module';
import { SchoolModule } from './modules/externals/school/school.module';
import { StudentModule } from './modules/externals/student/student.module';
import { TeacherAssignmentModule } from './modules/teacher-assignment/teacher-assignment.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { RoomModule } from './modules/room/room.module';
@Module({
  imports: [
    AuthModule,
    SchoolModule,
    PrismaModule,
    ClassModule,
    DataLoaderModule,
    TeacherModule,
    RabbitMQClientsModule,
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
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [DataLoaderModule],
      inject: [CACHE_MANAGER, CORE_SERVICE, AUTH_SERVICE, DataLoaderService],
      useFactory: (
        cacheManager: Cache,
        coreClient: ClientProxy,
        authClient: ClientProxy,
        dataLoader: DataLoaderService,
      ) => ({
        typePaths: [
          join(process.cwd(), '/src/graphql/**/*.graphql'),
          join(
            process.cwd(),
            '../../packages/contracts/src/graphql/common/**/*.graphql',
          ),
        ],
        context: async ({ req, res }: { req: Request; res: Response }) => {
          const gqlContext = await createContext({
            req,
            res,
            cacheManager,
            authClient,
            coreClient,
          });
          return {
            ...gqlContext,
            loaders: dataLoader.createLoaders(),
          } as GqlContext;
        },
        formatError: (formattedError, error: any) => {
          // 1. On extrait l'erreur d'origine cachée par Apollo
          const originalError =
            error.originalError || error.extensions?.originalError || error;
          console.log('Original Error', originalError);
          // 2. On vérifie l'instance sur l'erreur d'origine
          if (originalError instanceof AcademicRpcException) {
            return {
              message: originalError.message as string, // Requis par GraphQL
              extensions: {
                code: originalError.code,
                meta: originalError.meta, // Tes métadonnées
              },
            };
          } else if (originalError instanceof RpcException) {
            return {
              message: originalError.message,
              extensions: {
                code: 'FORBIDDEN',
                meta: originalError?.meta,
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
        },
      }),
    }),
    SubjectModule,
    GroupModule,
    ClassSubjectModule,
    StudentModule,
    TeacherAssignmentModule,
    LessonModule,
    RoomModule,
  ],
})
export class AcademicModule {}
