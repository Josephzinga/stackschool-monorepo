import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataLoaders } from '../dataloader.service';
import { GraphQLContext } from '@stackschool/messaging';

export const Loaders = createParamDecorator(
  (_: unknown, context: ExecutionContext): DataLoaders => {
    const context =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
  },
);
