import { Module } from '@nestjs/common';
import { DataLoaderService } from './dataloader.service';

@Module({
  imports: [],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
