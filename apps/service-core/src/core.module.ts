import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SchoolModule } from './modules/school/school.module';
import { MembershipModule } from './modules/membership/membership.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'node:path';
import { Request, Response } from 'express';
import { DataLoaderService } from './modules/dataloader/dataloader.service';
import { DataloaderModule } from './modules/dataloader/dataloader.module';

@Module({
  imports: [
    PrismaModule,
    SchoolModule,
    MembershipModule,
    TeacherModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [DataloaderModule],
      inject: [DataLoaderService],
      useFactory: (dataLoaderService: DataLoaderService) => ({
        typePaths: [join(process.cwd(), '/src/graphql/**/*.graphql')],
        context: ({ req, res }: { req: Request; res: Response }) => {
          const userId = req.headers['x-user-id'];
          const schoolId = req.headers['x-school-id'];
          console.log('userId', userId, 'SchoolId', schoolId);
          return {
            req,
            res,
            loaders: dataLoaderService.createLoaders(),
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
export class CoreModule {}
