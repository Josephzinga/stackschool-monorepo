import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '../../graphql/context';
import { AuthRpcException } from '@stackschool/messaging';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    if (ctx.getType<GqlContextType>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(ctx).getContext<GqlContext>();
      if (!gqlCtx.user || !gqlCtx.user.id) {
        throw new AuthRpcException(
          'UNAUTHORIZED',
          'Utilisateur non authentifier veillez vous connecter.',
        );
      }
      return true;
    } else {
      throw new AuthRpcException(
        'INTERNAL_ERROR',
        'AuthenticatedGuard must be used in graphql context',
      );
    }
  }
}
