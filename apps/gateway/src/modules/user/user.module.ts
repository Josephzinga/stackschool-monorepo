import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@stackschool/messaging';
import { MembershipModule } from '../membership/membership.module';
import { MembershipService } from '../membership/membership.service';
import { SchoolService } from '../school/school.service';
import { SchoolModule } from '../school/school.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    MembershipModule,
    SchoolModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'auth_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, MembershipService, SchoolService],
  exports: [MembershipModule, SchoolModule],
})
export class UserModule {}
