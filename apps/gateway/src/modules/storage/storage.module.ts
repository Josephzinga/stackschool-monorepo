import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import storageConfig from './storage.config';
import { StorageService } from './storage.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
