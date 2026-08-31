import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataLoaderService } from '../../modules/dataloader/dataloader.service';
import {
  PERMISSIONS_KEY,
  PERMISSIONS_STRATEGY,
  PermissionStrategy,
} from '../decorators/permission.decorator';
import { CoreRpcException, PermissionCode } from '@stackschool/messaging';
import { GqlContext } from '../../graphql/context';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly loadersService: DataLoaderService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<
      PermissionCode[] | undefined
    >(PERMISSIONS_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!required?.length) return true; // pas de @Permissions → laisse passer

    const gqlCtx = GqlExecutionContext.create(ctx).getContext<GqlContext>();
    const schoolUserId = gqlCtx.schoolUser?.id;
    if (!schoolUserId) {
      throw new CoreRpcException('FORBIDDEN', 'Aucun SchoolUser actif.');
    }

    // ✅ Lazy + batché + caché pour la requête. Ne tourne QUE sur les routes
    //    décorées par @Permissions().
    const loaders = gqlCtx.loaders ?? this.loadersService.createLoaders();
    const userPermissions =
      (await loaders.permissionsLoader.load(schoolUserId)) ?? [];

    const userCodes = new Set(userPermissions.map((p) => p.code));
    const strategy =
      this.reflector.getAllAndOverride<PermissionStrategy>(
        PERMISSIONS_STRATEGY,
        [ctx.getHandler(), ctx.getClass()],
      ) ?? 'OR';

    const ok =
      strategy === 'AND'
        ? required.every((code) => userCodes.has(code))
        : required.some((code) => userCodes.has(code));

    if (!ok) {
      throw new CoreRpcException(
        'FORBIDDEN',
        `Permission(s) manquante(s) : ${required.join(', ')} (${strategy}).`,
      );
    }
    return true;
  }
}
