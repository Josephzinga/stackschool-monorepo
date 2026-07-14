// apps/gateway/src/school/school-context.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { MembershipService } from '../../modules/membership/membership.service';
import { GraphQLContext } from '../../graphql/context';

@Injectable()
export class SchoolContextInterceptor implements NestInterceptor {
  constructor(private memberService: MembershipService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<GraphQLContext>> {
    const gqlCtx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const req = gqlCtx.req;
    const schoolId = req.headers['x-school-id'] as string | undefined;

    if (schoolId && gqlCtx.user) {
      gqlCtx.schoolUser = await this.memberService.findBySchoolIdAndUserId({
        schoolId,
        userId: gqlCtx.user.id,
      });
      gqlCtx.schoolId = schoolId;
    }

    return next.handle();
  }
}
