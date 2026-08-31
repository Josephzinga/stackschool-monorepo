import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AcademicModule } from './academic.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RABBITMQ_QUEUES } from '@stackschool/messaging';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AcademicModule);
  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBITMQ_URL')],
      queue: RABBITMQ_QUEUES.ACADEMIC,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(4003, () => {
    console.log('Service is running on port 4003');
  });
}
void bootstrap();
