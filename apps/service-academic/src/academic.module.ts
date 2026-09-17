import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClassModule } from './modules/class/class.module';
import { DataLoaderModule } from './modules/dataloader/dataloader.module';
import { RabbitMQClientsModule } from './modules/rabbitmq/rabbitmq-clients.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import {
  AuthenticatedGuard,
  CaslAbilityGuard,
  RolesGuard,
  SchoolAccessGuard,
} from '@stackschool/messaging';
import { SubjectModule } from './modules/subject/subject.module';
import { GroupModule } from './modules/group/group.module';
import { ClassSubjectModule } from './modules/class-subject/class-subject.module';
import { TeacherModule } from './modules/externals/teacher/teacher.module';
import { SchoolModule } from './modules/externals/school/school.module';
import { StudentModule } from './modules/externals/student/student.module';
import { TeacherAssignmentModule } from './modules/teacher-assignment/teacher-assignment.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { RoomModule } from './modules/room/room.module';
import { APP_GUARD } from '@nestjs/core';
import { AppGraphQLModule } from './modules/graphql/graphql.module';

@Module({
  imports: [
    AuthModule,
    SchoolModule,
    PrismaModule,
    ClassModule,
    DataLoaderModule,
    TeacherModule,
    RabbitMQClientsModule,
    AppGraphQLModule,
    SubjectModule,
    GroupModule,
    ClassSubjectModule,
    StudentModule,
    TeacherAssignmentModule,
    LessonModule,
    RoomModule,
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
            new KeyvRedis(configService.get('REDIS_URL')),
          ],
        };
      },
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CaslAbilityGuard },
  ],
})
export class AcademicModule {}
