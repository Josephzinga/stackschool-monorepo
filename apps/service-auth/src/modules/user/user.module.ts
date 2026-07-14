import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserResolver } from './user.resolver';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       stores: [
    //         new Keyv({
    //           store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
    //         }),
    //         new KeyvRedis(configService.get('REDIS_URL')),
    //       ],
    //     };
    //   },
    // }),
  ],
  providers: [UserService, UserResolver],
})
export class UserModule {}
