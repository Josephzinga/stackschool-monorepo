import { Controller, Post, UseGuards, Body, UsePipes } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { ZodValidationPipe } from '../../utils/zod-validation-pipe';
import {
  profileSchema,
  schoolDataSchema,
  roleDataSchema,
  completeProfileDataSchema,
} from '@stackschool/shared';
import {
  ProfileData,
  RoleData,
  SchoolData,
  Step,
} from './decorators/profile.decorator';
import type {
  SaveProfileDto,
  SaveRoleDto,
  SaveSchoolDto,
} from './dto/progres.dto';

@Controller('api/complete-profile')
export class CompleteProfileController {
  @Post('save-progress')
  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ZodValidationPipe(completeProfileDataSchema))
  async saveProgress(@Body() completeProfileDto: any) {
    console.log('Profile', completeProfileDto);
  }
}
