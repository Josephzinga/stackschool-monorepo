import { Module } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import {
  AUTH_SERVICE,
  CORE_SERVICE,
  OperationsRpcException,
} from '@stackschool/messaging';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { createContext } from '../../graphql/context';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [],
      inject: [CACHE_MANAGER, CORE_SERVICE, AUTH_SERVICE],
      useFactory: (
        cacheManager: Cache,
        coreClient: ClientProxy,
        authClient: ClientProxy,
      ) => ({
        typePaths: [
          join(process.cwd(), '/src/graphql/schemas/**/*.graphql'),
          join(
            process.cwd(),
            '../../packages/contracts/src/graphql/common/**/*.graphql',
          ),
        ],
        context: async ({ req, res }: { req: Request; res: Response }) =>
          createContext({
            req,
            res,
            cacheManager,
            authClient,
            coreClient,
          }),
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
          enumsAsTypes: true,
          customScalarTypeMapping: {
            DateTime: 'Date',
          },
        },
      }),
    }),
  ],
})
export class AppGraphqlModule {}
