import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TrustedSchoolContextGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      SCHOOL_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = GqlExecutionContext.create(context).getContext().req;

    // Vérifie d'abord que la requête vient bien du gateway (secret déjà validé par InternalGatewayGuard, exécuté avant)
    req.userContext = {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'],
    };

    if (!requiredRoles) return true;

    const schoolRole = req.headers['x-school-role'];
    if (!schoolRole || !requiredRoles.includes(schoolRole)) {
      throw new ForbiddenException('Rôle insuffisant pour cette ressource.');
    }
    req.schoolContext = {
      schoolId: req.headers['x-school-id'],
      role: schoolRole,
    };
    return true;
  }
}
