import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { DataLoaderService } from '../dataloader.service';
import { GraphQLContext } from '../../../graphql/context';

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly loadersService: DataLoaderService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();

    if (!ctx.loaders) {
      ctx.loaders = this.loadersService.createLoaders();
    }

    return next.handle();
  }
}
