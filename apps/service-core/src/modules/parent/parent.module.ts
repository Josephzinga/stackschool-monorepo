import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentResolver } from './parent.resolver';
import { APP_GUARD } from '@nestjs/core';
import { SchoolAccessGuard } from '@stackschool/messaging';

@Module({
  providers: [
    ParentResolver,
    ParentService,
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
  ],
})
export class ParentModule {}
