import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SCHOOL_ROLES_KEY } from '../decorators/role.decorator';
import { CoreRpcException, SchoolRole } from '@stackschool/messaging';
import { GqlContext } from '../../graphql/context';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<SchoolRole[] | undefined>(
      SCHOOL_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!required?.length) return true; // pas de @Permissions → on laisse passer

    const gqlCtx = GqlExecutionContext.create(ctx).getContext<GqlContext>();
    const schoolUser = gqlCtx.schoolUser;

    if (!schoolUser) {
      // Pas connecté, ou pas membre de cette école.
      throw new CoreRpcException(
        'MEMBERSHIP_NOT_FOUND',
        'Aucun SchoolUser actif pour cette école.',
      );
    }
    if (!required.includes(schoolUser.role)) {
      throw new CoreRpcException(
        'FORBIDDEN',
        `Rôle requis : ${required.join(' ou ')}.`,
      );
    }
    return true;
  }
}
