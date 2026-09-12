import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Permission,
  SchoolMembership,
  UpdateSchoolUserPermissionsInput,
} from '../../graphql';
import { CoreRpcException } from '@stackschool/messaging';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  async update(
    dto: UpdateSchoolUserPermissionsInput,
    schoolId: string,
  ): Promise<SchoolMembership> {
    const existing = await this.prisma.schoolUser.findFirst({
      where: {
        id: dto.schoolUserId,
      },
    });
    if (!existing) {
      throw new CoreRpcException('MEMBERSHIP_NOT_FOUND', 'Membre non trouvé.');
    }

    if (dto.grantPermissionIds && dto.grantPermissionIds.length > 0) {
      for (const permissionId of dto.grantPermissionIds) {
        const existingPermission = await this.prisma.permission.findUnique({
          where: {
            id: permissionId!,
          },
        });
        if (!existingPermission) {
          throw new CoreRpcException('NOT_FOUND', 'Permission not trouvé.');
        }
        const permissions = await this.prisma.schoolUserPermission.upsert({
          where: {
            schoolUserId_permissionId: {
              schoolUserId: existing.id,
              permissionId: permissionId!,
            },
          },
          update: {},
          create: {
            permissionId: permissionId!,
            schoolUserId: existing.id,
          },
        });
        console.log(permissions);
      }
    }
    return existing;
  }
}
