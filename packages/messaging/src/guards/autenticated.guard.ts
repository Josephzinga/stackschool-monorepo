import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../types/graphql.contex.ts';
import { ServiceRpcException } from '../errors';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const gqlCtx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const isPublic = this.reflector.get<boolean | undefined>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (context.getType<GqlContextType>() === 'graphql') {
      if (isPublic) return true;
      if (!gqlCtx.user || !gqlCtx.user.id) {
        throw new ServiceRpcException(
          'FORBIDDEN',
          'Utilisateur non-authentifier, veuillez vous connecter.',
        );
      }
      return true;
    } else if (context.getType<GqlContextType>() === 'http') {
      const request = context
        .switchToHttp()
        .getRequest<Request & { user: any }>();
      if (!request.user) {
        throw new ServiceRpcException(
          'FORBIDDEN',
          'Utilisateur non-authentifier, veuillez vous connecter.',
        );
      }
      return true;
    }
    return false;
  }
}
