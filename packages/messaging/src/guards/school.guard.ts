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
import { SchoolRole } from '..';

@Injectable()
export class RequiredMember implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(ctx).getContext<any>();
    const schoolUser = gqlCtx.schoolUser;
    const schoolId = gqlCtx.schoolId;

    if (!schoolUser) {
      throw new UnauthorizedException(
        'Aucun SchoolUser actif pour cette école.',
      );
    }

    return true;
  }
}
