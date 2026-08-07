import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderService } from './dataloader.service';
import { DataLoaderInterceptor } from './interceptors/dataloader.interceptor';

@Module({
  imports: [],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataloaderModule {}
