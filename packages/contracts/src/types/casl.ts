import { Ability, AbilityClass } from '@casl/ability';
import {
  CaslPermissionAction,
  CaslPermissionSubject,
} from '../casl/actions-subjects.ts';

// A tuple-typed ability: TypeScript will now reject
// ability.can('flurb', 'Grade') at compile time.
export type AppAbility = Ability<[CaslPermissionAction, CaslPermissionSubject]>;

// PureAbility as a class reference, needed by AbilityBuilder's generic.
export const AppAbility = Ability as AbilityClass<AppAbility>;
