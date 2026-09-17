import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../../graphql/context';
import type { Request } from 'express';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext<GraphQLContext>();

    return { req: ctx.req };
  }

  protected async getTracker(req: Request): Promise<string> {
    return Promise.resolve(req.ip!);
  }
}
