import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ServiceRpcException } from '../errors/service-rpc.error';
import { SchoolUserContract } from '@stackschool/contracts';

@Injectable()
export class SchoolAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(ctx).getContext<{
      schoolUser: SchoolUserContract;
      schoolId: string;
      userId: string;
    }>();
    const schoolUser = gqlCtx.schoolUser;
    const schoolId = gqlCtx.schoolId;
    const userId = gqlCtx.userId;

    if (!schoolUser || (!schoolId && !userId)) {
      throw new ServiceRpcException(
        'FORBIDDEN',
        "vous n'êtes pas autorisé à accéder à cette établissement. Veuillez vous assurer que vous êtes connecté et que vous avez sélectionné un établissement.",
      );
    }
    if (!schoolUser.isActive) {
      throw new ServiceRpcException(
        'FORBIDDEN',
        "Vous n'êtes pas autorisé à accéder à cette établissement",
      );
    }
    return true;
  }
}
