import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { MembershipModule } from '../membership/membership.module';
import { Cache } from '@nestjs/cache-manager';
import { Request, Response } from 'express';
import { createContext } from '../../graphql/context';
import { gqlFormatError } from '../../graphql/graphql-format-error';
import { join } from 'node:path';
import { IntrospectAndCompose } from '@apollo/gateway';
import { AuthenticatedDataSource } from '../../graphql/autentificated-datasource';
import { MembershipService } from '../membership/membership.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [MembershipModule],
      inject: [Cache, MembershipService],
      useFactory: (
        cacheManager: Cache,
        membershipService: MembershipService,
      ) => ({
        server: {
          context: async ({ req, res }: { req: Request; res: Response }) => {
            return await createContext({
              req,
              res,
              membershipService,
              cacheManager,
            });
          },
          //  plugins: [ApolloServerPluginLandingPageLocalDefault()],
          playground: true,
          injectRequest: true,
          includeStacktraceInErrorResponses: true,
          formatError: (formattedError, error) =>
            gqlFormatError(formattedError, error),
        },
        typePaths: [join(process.cwd(), '/src/graphql/schemas/**/*.graphql')],
        definitions: {
          path: join(process.cwd(), '/src/graphql.ts'),
          outputAs: 'class',
        },

        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'auth', url: 'http://localhost:4001/graphql' },
              { name: 'core', url: 'http://localhost:4002/graphql' },
              { name: 'academic', url: 'http://localhost:4003/graphql' },
              { name: 'operations', url: 'http://localhost:4004/graphql' },
            ],
          }),
          buildService: ({ url }) => new AuthenticatedDataSource({ url }),
        },
      }),
    }),
  ],
})
export class AppGraphqlModule {}
