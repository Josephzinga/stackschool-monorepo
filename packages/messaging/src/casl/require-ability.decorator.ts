import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionSubject } from '@stackschool/contracts';

export interface RequiredRule {
  action: PermissionAction;
  subject: PermissionSubject;
}
export type RequireAbilityMatch = 'every' | 'some';

export const REQUIRE_ABILITY_KEY = 'require_ability';
export const REQUIRE_ABILITY_MATCH_KEY = 'require_ability_match';

export function RequireAbility(
  rules: RequiredRule | RequiredRule[],
  match: RequireAbilityMatch = 'some',
) {
  const list = Array.isArray(rules) ? rules : [rules];
  return applyDecorators(
    SetMetadata(REQUIRE_ABILITY_KEY, list),
    SetMetadata(REQUIRE_ABILITY_MATCH_KEY, match),
  );
}
