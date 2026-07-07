import { Module } from '@nestjs/common';
import { CompleteProfileService } from './complete-profile.service';
import { CompleteProfileResolver } from './complete-profile.resolver';
import { CompleteProfileController } from './complete-profile.controller';

@Module({
  providers: [CompleteProfileResolver, CompleteProfileService],
  controllers: [CompleteProfileController],
})
export class CompleteProfileModule {}
