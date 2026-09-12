import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SCHOOL_ROLES_KEY } from '../decorators/role.decorator';
import { ROLE_LABEL_FR, SchoolRole } from '@stackschool/contracts';
import { ServiceRpcException } from '../errors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<SchoolRole[] | undefined>(
      SCHOOL_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!required?.length) return true; // pas de @Permissions → on laisse passer

    const gqlCtx = GqlExecutionContext.create(ctx).getContext<any>();
    const schoolUser = gqlCtx?.schoolUser;

    if (!schoolUser) {
      throw new ServiceRpcException(
        'FORBIDDEN',
        'Aucun SchoolUser actif pour cette école.',
      );
    }
    if (!required.includes(schoolUser.role)) {
      throw new ServiceRpcException(
        'FORBIDDEN',
        `Rôle requis : ${required.map((r) => ROLE_LABEL_FR[r]).join(' ou ')}.`,
      );
    }
    return true;
  }
}
