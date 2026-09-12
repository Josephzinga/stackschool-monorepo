import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { DataLoaderModule } from '../dataloader/dataLoaderModule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { DataLoaderService } from '../dataloader/dataloader.service';
import { AUTH_SERVICE, CoreRpcException } from '@stackschool/messaging';
import { PrismaService } from '../../prisma/prisma.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { join } from 'node:path';
import { Request, Response } from 'express';
import { createContext } from '../../graphql/context';
import GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
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
          customScalarTypeMapping: {},
        },
        resolvers: { JSON: GraphQLJSON },
      }),
    }),
  ],
})
export class AppGraphqlModule {}
