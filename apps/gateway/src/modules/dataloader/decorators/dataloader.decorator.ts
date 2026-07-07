import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataLoaders } from '../dataloader.service';
import { GraphQLContext } from '../../../graphql/context';

export const Loaders = createParamDecorator(
  (_: unknown, context: ExecutionContext): DataLoaders => {
    return GqlExecutionContext.create(context).getContext<GraphQLContext>()
      .loaders!;
  },
);
