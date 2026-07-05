import { Module } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';

@Module({
  providers: [RateLimiterService]
})
export class RateLimiterModule {}
