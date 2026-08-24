import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ACADEMIC_SERVICE,
  AUTH_SERVICE,
  CORE_SERVICE,
  OPERATIONS_SERVICE,
} from '@stackschool/messaging';

const buildRmqClient = (queue: string) => ({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    transport: Transport.RMQ as const,
    options: {
      urls: [config.getOrThrow('RABBITMQ_URL')],
      queue,
      queueOptions: { durable: true },
    },
  }),
  inject: [ConfigService],
});

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      { name: CORE_SERVICE, ...buildRmqClient('core_queue') },
      { name: AUTH_SERVICE, ...buildRmqClient('auth_queue') },
      { name: ACADEMIC_SERVICE, ...buildRmqClient('academic_queue') },
      { name: OPERATIONS_SERVICE, ...buildRmqClient('operations_queue') },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQClientsModule {}
