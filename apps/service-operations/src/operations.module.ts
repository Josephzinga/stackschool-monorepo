import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CacheModule } from '@nestjs/cache-manager';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { Keyv, KeyvCacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { OperationsRpcException } from '@stackschool/messaging';
import { RpcException } from '@nestjs/microservices';

@Module({
  imports: [
    NotificationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
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
      imports: [],
      inject: [],
      useFactory: () => ({
        typePaths: [
          join(process.cwd(), '/src/graphql/schemas/**/*.graphql'),
          join(
            process.cwd(),
            '../../packages/contracts/src/graphql/common/**/*.graphql',
          ),
        ],
        context: async ({ req, res }: { req: Request; res: Response }) => {
          return {
            req,
            res,
          };
        },
        formatError: (formattedError, error: any) => {
          // 1. On extrait l'erreur d'origine cachée par Apollo
          const originalError =
            error.originalError || error.extensions?.originalError || error;
          console.log('Original Error', originalError, '\t Error: ', error);
          // 2. On vérifie l'instance sur l'erreur d'origine
          if (originalError instanceof OperationsRpcException) {
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
          enumsAsTypes: false,
        },
      }),
    }),
  ],
})
export class OperationsModule {}
