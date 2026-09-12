import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../../../graphql/context';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlCtx =
        GqlExecutionContext.create(context).getContext<GraphQLContext>();
      if (!gqlCtx.user || !gqlCtx.user.id) {
        throw new UnauthorizedException(
          'Utilisateur non-authentifier, veuillez vous connecter.',
        );
      }
    } else if (context.getType<GqlContextType>() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      if (!request.isAuthenticated?.() || !request.user) {
        throw new UnauthorizedException(
          'Utilisateur non-authentifier, veuillez vous connecter.',
        );
      }
      return request.isAuthenticated?.() === true;
    }
    return false;
  }
}
