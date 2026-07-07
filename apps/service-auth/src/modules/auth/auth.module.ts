import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthUserService } from './services/auth-user.service';
import { TokenService } from './services/token.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordService } from './services/forgot-password/forgot-password.service';
import { ResetPasswordService } from './services/reset-password/reset-password.service';
import { ResendCodeService } from './services/resend-code/resend-code.service';
import { VerifyCodeService } from './services/verify-code/verify-code.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [PrismaModule, UserModule, JwtModule],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    AuthUserService,
    TokenService,
    LocalStrategy,
    GoogleStrategy,
    LocalAuthGuard,
    GoogleAuthGuard,
    FacebookAuthGuard,
    UserService,
    ForgotPasswordService,
    ResetPasswordService,
    ResendCodeService,
    VerifyCodeService,
  ],
  exports: [UserModule],
})
export class AuthModule {}
