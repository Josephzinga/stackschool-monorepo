import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver],
  controllers: [UserController],
})
export class UserModule {}
