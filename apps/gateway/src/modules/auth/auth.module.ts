import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionSerializer } from './serializers/session.serializer';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'auth_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    LocalAuthGuard,
    SessionSerializer,
  ],
  exports: [ClientsModule],
  controllers: [AuthController],
})
export class AuthModule {}
