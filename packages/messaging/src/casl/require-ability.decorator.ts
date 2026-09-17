import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionSubject } from '@stackschool/contracts';

export interface RequiredRule {
  action: PermissionAction;
  subject: PermissionSubject;
}
export type RequireAbilityMatch = 'every' | 'some';
export type AbilityTuple = [PermissionAction, PermissionSubject];
type RequireAbility = AbilityTuple | RequiredRule;
export const REQUIRE_ABILITY_KEY = 'require_ability';
export const REQUIRE_ABILITY_MATCH_KEY = 'require_ability_match';

const createPolicyDecorator = (
  abilities: RequireAbility[],
  match: RequireAbilityMatch = 'some',
) => {
  const rules: RequiredRule[] = abilities.map((ability) => {
    if (Array.isArray(ability)) {
      const [action, subject] = ability;
      return { action, subject };
    }
    return ability;
  });

  return applyDecorators(
    SetMetadata(REQUIRE_ABILITY_KEY, rules),
    SetMetadata(REQUIRE_ABILITY_MATCH_KEY, match),
  );
};

export function RequireAbility(...abilities: RequireAbility[]) {
  return createPolicyDecorator(abilities);
}

RequireAbility.any = (...abilities: RequireAbility[]) => {
  return createPolicyDecorator(abilities, 'some');
};

RequireAbility.all = (...abilities: RequireAbility[]) => {
  return createPolicyDecorator(abilities, 'every');
};
