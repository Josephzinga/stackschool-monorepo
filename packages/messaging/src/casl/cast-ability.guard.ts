import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  REQUIRE_ABILITY_KEY,
  REQUIRE_ABILITY_MATCH_KEY,
  RequireAbilityMatch,
  RequiredRule,
} from './require-ability.decorator.ts';
import {
  defineAbilityFor,
  toCaslAction,
  toCaslSubject,
  toSchoolUserAbility,
} from '@stackschool/contracts';
import { CoreRpcException } from '../errors';
import { GraphQLContext } from '../types/graphql.contex.ts';

@Injectable()
export class CaslAbilityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const rules = this.reflector.get<RequiredRule[]>(
      REQUIRE_ABILITY_KEY,
      context.getHandler(),
    );
    if (!rules?.length) return true;
    if (gqlCtx.schoolUser?.isOwner) return true;
    const match =
      this.reflector.get<RequireAbilityMatch>(
        REQUIRE_ABILITY_MATCH_KEY,
        context.getHandler(),
      ) ?? 'every';

    const schoolUser = toSchoolUserAbility(gqlCtx.schoolUser!);

    const ability = defineAbilityFor(schoolUser);
    const results = rules.map((r) =>
      ability.can(toCaslAction(r.action), toCaslSubject(r.subject)),
    );
    const allowed =
      match === 'every' ? results.every(Boolean) : results.some(Boolean);
    if (!allowed) {
      const message = rules
        .map((r) => `${r.action}:${r.subject}`)
        .join(match === 'every' ? ' et ' : ' ou ');
      throw new CoreRpcException(
        'FORBIDDEN',
        `Permission non accordée. veuillez vérifier que vous avez bien ses permission ${message}`,
      );
    }
    return true;
  }
}
