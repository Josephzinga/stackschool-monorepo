import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

const PORT = process.env.RABBITMQ_URL ?? 3001;
console.log('PORT', PORT);

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL!],
        queue: 'auth_queue',
        queueOptions: { durable: true },
      },
    },
  );

  await app.listen();
}
void bootstrap();
