import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AcademicModule } from './academic.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GatewayGuard } from '@stackschool/messaging';

async function bootstrap() {
  const app = await NestFactory.create(AcademicModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'academic-queue',
      queueOptions: { durable: true },
    },
  });

  app.useGlobalGuards(new GatewayGuard());

  await app.startAllMicroservices();
  await app.listen(4003, () => {
    console.log('Service is runnig on port 4003');
  });
}
bootstrap();
