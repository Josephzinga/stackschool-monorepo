import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SCHOOL_ROLES_KEY, SchoolRole } from '@stackschool/messaging';
import { RpcException } from '@nestjs/microservices';

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
    const schoolUser = gqlCtx.schoolUser;

    if (!schoolUser) {
      // Pas connecté, ou pas membre de cette école.
      throw new RpcException('Aucun SchoolUser actif pour cette école.');
    }
    if (!required.includes(schoolUser.role)) {
      throw new RpcException(`Rôle requis : ${required.join(' ou ')}.`);
    }
    return true;
  }
}
