import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolResolver } from './school.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CORE_SERVICE } from '@stackschool/messaging';
import { MembershipModule } from '../membership/membership.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CORE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'core_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [SchoolResolver, SchoolService],
  exports: [ClientsModule],
})
export class SchoolModule {}
