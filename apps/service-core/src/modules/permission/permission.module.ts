import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { APP_GUARD } from '@nestjs/core';
import { SchoolAccessGuard } from '@stackschool/messaging';

@Module({
  providers: [
    PermissionResolver,
    PermissionService,
    { provide: APP_GUARD, useClass: SchoolAccessGuard },
  ],
})
export class PermissionModule {}
