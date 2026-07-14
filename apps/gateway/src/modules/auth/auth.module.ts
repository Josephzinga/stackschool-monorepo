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
import { AUTH_SERVICE } from '@stackschool/messaging';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { MembershipService } from '../membership/membership.service';

@Module({
  imports: [
    UserModule,
    ClientsModule,
    PassportModule.register({ session: true }),
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
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
    GoogleStrategy,
    FacebookStrategy,
    FacebookAuthGuard,
    GoogleAuthGuard,
  ],
  exports: [ClientsModule],
  controllers: [AuthController],
})
export class AuthModule {}
