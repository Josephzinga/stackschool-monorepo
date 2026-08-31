import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GatewayGuard, RABBITMQ_QUEUES } from '@stackschool/messaging';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const config = app.get(ConfigService);
  console.log('URL: ', config.getOrThrow<string>('RABBITMQ_URL'));
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
  await app.listen(4002, () => {
    console.log('Service is running on port 4002');
  });
}
void bootstrap();
