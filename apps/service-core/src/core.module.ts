import 'dotenv/config';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SchoolModule } from './modules/school/school.module';
import { MembershipModule } from './modules/membership/membership.module';
import {
  AuthenticatedGuard,
  CaslAbilityGuard,
  RolesGuard,
  SchoolAccessGuard,
} from '@stackschool/messaging';
import { EnrolmentModule } from './modules/enrolment/enrolment.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DataLoaderModule } from './modules/dataloader/dataLoaderModule';
import { StudentModule } from './modules/student/student.module';
import { RabbitMQClientsModule } from './modules/rabbitmq/rabbitmq-clients.module';
import { ExternalModule } from './modules/external/external.module';
import { ParentModule } from './modules/parent/parent.module';
import { ParentStudentModule } from './modules/parent-student/parent-student.module';
import { StaffModule } from './modules/staff/staff.module';
import { PermissionModule } from './modules/permission/permission.module';
import { APP_GUARD } from '@nestjs/core';
import { AppGraphqlModule } from './modules/graphql/graphql.module';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SchoolModule,
    MembershipModule,
    EnrolmentModule,
    DataLoaderModule,
    TeacherModule,
    RabbitMQClientsModule,
    ExternalModule,
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
    AppGraphqlModule,
    StudentModule,
    ParentModule,
    ParentStudentModule,
    StaffModule,
    PermissionModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
    { provide: APP_GUARD, useClass: CaslAbilityGuard },
  ],
  exports: [MembershipModule, CacheModule],
})
export class CoreModule {}
