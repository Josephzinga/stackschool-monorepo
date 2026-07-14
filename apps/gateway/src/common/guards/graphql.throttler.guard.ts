import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../../graphql/context';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext<GraphQLContext>();

    return { req: ctx.req };
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ip;
  }
}
