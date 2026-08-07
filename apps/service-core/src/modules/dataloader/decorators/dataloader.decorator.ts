import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataLoaders } from '../dataloader.service';
import { GraphqlContextWithLoaders } from '../interceptors/dataloader.interceptor';

export const Loaders = createParamDecorator(
  (_: unknown, context: ExecutionContext): DataLoaders => {
    const gqlCtx =
      GqlExecutionContext.create(
        context,
      ).getContext<GraphqlContextWithLoaders>();

    return gqlCtx.loaders;
  },
);
