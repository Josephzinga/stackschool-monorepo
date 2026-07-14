import { Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'node:path';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      context: ({ req }) => {
        const userId = req.headers['x-user-id'];
        const schoolId = req.headers['x-school-id'];
        const role = req.headers['x-school-role'];
        console.log('UserId', userId);
        console.log('schoolId', schoolId, 'role', role);

        return {
          userId,
        };
      },
      typePaths: [join(process.cwd(), '/src/graphql/**/*.graphql')],
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
