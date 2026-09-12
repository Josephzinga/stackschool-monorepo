import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PermissionService } from './permission.service';
import {
  CaslAbilityGuard,
  Roles,
  RolesGuard,
  SchoolAccessGuard,
  ZodValidationPipe,
} from '@stackschool/messaging';
import { UseGuards } from '@nestjs/common';
import {
  SchoolMembership,
  UpdateSchoolUserPermissionsInput,
} from '../../graphql';
import z from 'zod';

@Resolver('Permission')
@UseGuards(SchoolAccessGuard, RolesGuard, CaslAbilityGuard)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Roles('ADMIN', 'TEACHER', 'STAFF')
  @Query('permissions')
  async findAll() {
    return this.permissionService.findAll();
  }

  @Mutation('updateSchoolUserPermissions')
  async updateSchoolUserPermissions(
    @Args(
      'input',
      new ZodValidationPipe(
        z.object({
          schoolUserId: z.uuid(),
          grantPermissionIds: z.array(z.string()).optional(),
          revokePermissionIds: z.array(z.string()).optional(),
        }),
      ),
    )
    dto: UpdateSchoolUserPermissionsInput,
    @Context('schoolId') schoolId: string,
  ): Promise<SchoolMembership> {
    return this.permissionService.update(dto, schoolId);
  }
}
