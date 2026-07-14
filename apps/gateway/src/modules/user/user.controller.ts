import {
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Controller,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../utils/zod-validation-pipe';
import { z } from 'zod';
import { UserService } from './user.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller()
@UseGuards(AuthenticatedGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('api/validate/user-filed')
  @HttpCode(HttpStatus.OK)
  async validateUserField(
    @Query('phoneNumber') phoneNumber: string,
    @Query('email', new ZodValidationPipe(z.email())) email: string,
  ) {
    if (!phoneNumber && !email)
      throw new BadRequestException("l'email ou le numéro est requis.");
    return this.userService.validateField(phoneNumber, email);
  }
}
