import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SCHOOL_ROLES_KEY } from '../decorators/role.decorator';
import { GraphQLContext } from '../../graphql/context';
import { SchoolRole } from '../../graphql/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<SchoolRole[] | undefined>(
      SCHOOL_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!required?.length) return true; // pas de @Permissions → on laisse passer

    const gqlCtx = GqlExecutionContext.create(ctx).getContext<GraphQLContext>();
    const schoolUser = gqlCtx.schoolUser;

    if (!schoolUser) {
      // Pas connecté, ou pas membre de cette école.
      throw new UnauthorizedException(
        'Aucun SchoolUser actif pour cette école.',
      );
    }
    if (!required.includes(schoolUser.role)) {
      throw new ForbiddenException(`Rôle requis : ${required.join(' ou ')}.`);
    }
    return true;
  }
}
