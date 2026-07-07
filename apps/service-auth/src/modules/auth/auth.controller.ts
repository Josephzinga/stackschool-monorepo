import { Controller } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { LoginDto, RegisterDto } from './dto/auth-dto';
import { AUTH_PATTERNS, AppRpcException } from '@stackschool/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.VALIDATE_CREDENTIALS)
  async validateCredentials(@Payload() dto: LoginDto) {
    return this.authService.validateLocalUser(dto);
  }

  @MessagePattern(AUTH_PATTERNS.CREATE_USER)
  async register(@Payload() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return user;
  }

  @MessagePattern(AUTH_PATTERNS.FIND_FULL_USER)
  async findFullUser(@Payload() userId: string) {
    if (!userId)
      throw new AppRpcException(
        'INVALID_CREDENTIALS',
        "L'identifiant manquat.",
      );
    return this.authService.findFullUser(userId);
  }

  @MessagePattern(AUTH_PATTERNS.CREATE_USER_SESSION)
  async createUserSession(@Payload() userId: string) {
    return await this.authService.generateSession(userId);
  }
}
