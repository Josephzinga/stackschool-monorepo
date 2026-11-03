import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ACADEMIC_SERVICE,
  AUTH_SERVICE,
  CORE_SERVICE,
  RABBITMQ_QUEUES,
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
      { name: AUTH_SERVICE, ...buildRmqClient(RABBITMQ_QUEUES.AUTH) },
      { name: ACADEMIC_SERVICE, ...buildRmqClient(RABBITMQ_QUEUES.ACADEMIC) },
      { name: CORE_SERVICE, ...buildRmqClient(RABBITMQ_QUEUES.CORE) },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQClientsModule {}
