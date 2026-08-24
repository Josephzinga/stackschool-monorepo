import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '../../graphql/context';
import { CoreRpcException } from '@stackschool/messaging';

export interface CurrentUserOptions {
  /** true = endpoint public mais pouvant être authentifié (user peut être undefined). */
  optional?: boolean;
}

export type CurrentUser = Pick<GqlContext, 'user'>;

export const CurrentUser = createParamDecorator(
  (data: CurrentUserOptions | undefined, ctx: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(ctx).getContext<GqlContext>();
    const user = gqlCtx.user;

    if (!user && !data?.optional) {
      throw new CoreRpcException(
        'INTERNAL_ERROR',
        'CurrentUser utilisé sans guard : ajoute @UseGuards(AuthenticatedGuard).',
      );
    }

    return user;
  },
);
