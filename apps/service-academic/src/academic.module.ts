import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useFactory: () => ({
        typePaths: [join(process.cwd(), '/src/graphql/**/*.graphql')],
        context: ({ req, res }: { req: Request; res: Response }) => {
          const userId = req.headers['x-user-id'];
          const schoolId = req.headers['x-school-id'];
          console.log('userId', userId, 'SchoolId', schoolId);
          return {
            req,
            res,
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
export class AcademicModule {}
