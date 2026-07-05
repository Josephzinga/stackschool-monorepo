import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderService } from './dataloader.service';
import { DataLoaderInterceptor } from './interceptors/dataloader.interceptor';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    DataLoaderService,
    { provide: APP_INTERCEPTOR, useClass: DataLoaderInterceptor },
  ],
  exports: [DataLoaderService],
})
export class DataloaderModule {}
