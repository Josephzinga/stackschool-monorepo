import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../types/graphql.contex.ts';
import { ServiceRpcException } from '../errors';

export interface CurrentUserOptions {
  /** true = endpoint public mais pouvant être authentifié (user peut être undefined). */
  optional?: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: CurrentUserOptions | undefined, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx).getContext<GraphQLContext>();
    const user = gqlCtx.user;
    if (!user && !data?.optional) {
      throw new ServiceRpcException(
        'INTERNAL_ERROR',
        'CurrentUser utilisé sans guard : ajoute @UseGuards(AuthenticatedGuard).',
      );
    }

    return user;
  },
);
