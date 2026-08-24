import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GatewayGuard } from '@stackschool/messaging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'auth_queue',
      queueOptions: { durable: true },
    },
  });
  app.useGlobalGuards(new GatewayGuard());

  await app.startAllMicroservices();
  await app.listen(4001, () => {
    console.log('Service is running on port 4001');
  });
}
void bootstrap();
