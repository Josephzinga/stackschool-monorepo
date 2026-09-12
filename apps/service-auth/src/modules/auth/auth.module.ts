import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthUserService } from './services/auth-user.service';
import { TokenService } from './services/token.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetPasswordService } from './services/reset-password.service';
import { ResendCodeService } from './services/resend-code.service';
import { VerifyCodeService } from './services/verify-code.service';
import { JwtModule } from '@nestjs/jwt';
import { OPERATIONS_SERVICE } from '@stackschool/messaging';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'mdldlddodldldlddliei'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: OPERATIONS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'operations_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthUserService,
    TokenService,
    UserService,
    ForgotPasswordService,
    ResetPasswordService,
    ResendCodeService,
    VerifyCodeService,
  ],
  exports: [UserModule],
})
export class AuthModule {}
