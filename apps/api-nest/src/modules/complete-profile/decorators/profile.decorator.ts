import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../../../graphql/context';
import type { Request } from 'express';
import {
  ProfileFormDataType,
  RoleDataType,
  School,
  SchoolDataType,
} from '@stackschool/shared';

function getRequest(context: ExecutionContext) {
  if (context.getType<GqlContextType>() === 'graphql') {
    const gqlCtx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    return gqlCtx.req ?? gqlCtx;
  }
  return context.switchToHttp().getRequest<Request>();
}

export const ProfileData = createParamDecorator(
  (_: any, ctx: ExecutionContext) => {
    const body = getRequest(ctx).body as Record<string, any>;
    const profile = body.profile as ProfileFormDataType;
    return profile ? profile : null;
  },
);

export const RoleData = createParamDecorator(
  (_: any, ctx: ExecutionContext) => {
    const body = getRequest(ctx).body as Record<string, any> & {
      role: RoleDataType;
    };
    return body.role ? body.role : null;
  },
);

export const SchoolData = createParamDecorator(
  (_: any, ctx: ExecutionContext) => {
    const body = getRequest(ctx).body as Record<string, any> & {
      school: SchoolDataType;
    };
    return body.school ? body.school : null;
  },
);

export const Step = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const body = getRequest(ctx).body as Record<string, any>;
  return body.step as number;
});
