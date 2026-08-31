import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GatewayGuard, RABBITMQ_QUEUES } from '@stackschool/messaging';
import { OperationsModule } from './operations.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(OperationsModule);
  const config = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBITMQ_URL')],
      queue: RABBITMQ_QUEUES.CORE,
      queueOptions: { durable: true },
    },
  });
  app.useGlobalGuards(new GatewayGuard());
  await app.startAllMicroservices();
  await app.listen(4004, () => {
    console.log('Service is running on port 4002');
  });
}
bootstrap();
