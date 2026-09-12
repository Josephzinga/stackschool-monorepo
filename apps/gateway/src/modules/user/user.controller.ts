import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../utils/zod-validation-pipe';
import { z } from 'zod';
import { UserService } from './user.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('api')
@UseGuards(AuthenticatedGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('validate/user-field')
  @HttpCode(HttpStatus.OK)
  async validateUserField(
    @Query('phoneNumber', new ZodValidationPipe(z.string().optional()))
    phoneNumber: string | undefined,
    @Query('email', new ZodValidationPipe(z.email().optional()))
    email: string | undefined,
    @Query('userId') userId: string | undefined,
  ) {
    if (!phoneNumber && !email)
      throw new BadRequestException("l'email ou le numéro est requis.");
    if (email && email.includes('invalid')) {
      throw new BadRequestException('Email invalide.');
    }
    return this.userService.validateField(userId, phoneNumber, email);
  }
}
