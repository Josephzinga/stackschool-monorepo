import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../types/graphql.contex.ts';
import { ServiceRpcException } from '../errors';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlCtx =
        GqlExecutionContext.create(context).getContext<GraphQLContext>();
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
