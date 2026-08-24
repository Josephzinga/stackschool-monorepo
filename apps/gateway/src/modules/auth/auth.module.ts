import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionSerializer } from './serializers/session.serializer';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Module({
  imports: [UserModule, ClientsModule],
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
  exports: [ClientsModule, ClientsModule],
  controllers: [AuthController],
})
export class AuthModule {}
