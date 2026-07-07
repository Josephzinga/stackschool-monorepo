import { Controller, Get, Req, Res, Query, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';
import { ZodValidationPipe } from './utils/zod-validation-pipe';
import { z } from 'zod';
import { profileSchema, type UserInMe } from '@stackschool/shared';
import { CurrentUser } from './common/decorators/current-user.decorator';
import { AuthenticatedGuard } from './modules/auth/guards/authenticated.guard';
interface CsrfRequest extends Request {
  csrfToken?: (options?: Record<string, unknown>) => string;
}

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/validate/user-field')
  @UseGuards(AuthenticatedGuard)
  async validateUserField(
    @Query('email', new ZodValidationPipe(z.email().optional())) email: string,
    @Query(
      'phoneNumber',
      new ZodValidationPipe(profileSchema.shape.phoneNumber.optional()),
    )
    phoneNumber: string,
    @Res() res: Response,
    @CurrentUser() user: UserInMe,
  ) {
    return await this.appService.validateUserField(
      res,
      { phoneNumber, email, selfCheck: true },
      user,
    );
  }

  @Get('csrf-token')
  getCsrfToken(@Req() req: CsrfRequest) {
    return {
      csrfToken: req.csrfToken?.(),
    };
  }
}
