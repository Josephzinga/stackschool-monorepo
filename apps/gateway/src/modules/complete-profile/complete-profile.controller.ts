import {
  Controller,
  Post,
  UseGuards,
  Body,
  UsePipes,
  Inject,
  Res,
  Get,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import {
  completeProfileDataSchema,
  type CompleteProfileDataType,
} from '@stackschool/contracts';
import { ZodValidationPipe } from '../../utils/zod-validation-pipe';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { Request, Response } from 'express';
import { CompleteProfileService } from './complete-profile.service';

@Controller('api/complete-profile')
@UseGuards(AuthenticatedGuard)
export class CompleteProfileController {
  constructor(
    private readonly completeProfileService: CompleteProfileService,
  ) {}

  @Post('save-progress')
  async saveProgress(
    @CurrentUser() user: NonNullable<Request['user']>,
    @Body(new ZodValidationPipe(completeProfileDataSchema))
    dto: CompleteProfileDataType,
    @Res() res: Response,
  ) {
    console.log('Data', dto);
    return await this.completeProfileService.saveProgress(user.id, dto, res);
  }

  @Get('load-progress')
  async loadProgress(
    @CurrentUser() user: NonNullable<Request['user']>,
    @Res() res: Response,
  ) {
    return this.completeProfileService.loadProgress(user.id, res);
  }
}
