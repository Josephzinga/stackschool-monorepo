import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { DataloaderModule } from './modules/dataloader/dataloader.module';

@Module({
  imports: [
    PrismaModule,
    SchoolModule,
    MembershipModule,
    TeacherModule,
    DataloaderModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useFactory: () => ({
        typePaths: [join(process.cwd(), '/src/graphql/**/*.graphql')],
        context: ({ req }) => {
          console.log('Headers', req?.headers);
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
