import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { SchoolModule } from './modules/school/school.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClassModule } from './modules/class/class.module';

@Module({
  imports: [
    AuthModule,
    SchoolModule,
    PrismaModule,
    ClassModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useFactory: () => ({
        typePaths: [
          join(process.cwd(), '/src/graphql/**/*.graphql'),
          join(
            process.cwd(),
            '../../packages/contracts/src/graphql/common/**/*.graphql',
          ),
        ],
        context: ({ req, res }: { req: Request; res: Response }) => {
          const userId = req.headers['x-user-id'];
          const schoolId = req.headers['x-school-id'];
          const role = req.headers['x-school-role'];
          console.log('UserId: ', userId, 'SchoolId: ', schoolId, 'Role', role);
          return {
            req,
            res,
            userId,
            schoolId,
            role,
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
