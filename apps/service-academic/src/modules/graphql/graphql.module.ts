import { Module } from '@nestjs/common';
import type { Request, Response } from 'express';
import { join } from 'path';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  AcademicRpcException,
  AUTH_SERVICE,
  CORE_SERVICE,
} from '@stackschool/messaging';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { DataLoaderModule } from '../dataloader/dataloader.module';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { DataLoaderService } from '../dataloader/dataloader.service';
import { createContext, GqlContext } from '../../graphql/context';

@Module({
  imports: [
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
  ],
})
export class AppGraphQLModule {}
