import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolResolver } from './school.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SchoolResolver, SchoolService],
})
export class SchoolModule {}
