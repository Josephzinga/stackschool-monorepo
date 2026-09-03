import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentResolver } from './parent.resolver';

@Module({
  providers: [ParentResolver, ParentService],
})
export class ParentModule {}
