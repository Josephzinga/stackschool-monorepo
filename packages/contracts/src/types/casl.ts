import { Ability, AbilityClass } from '@casl/ability';
import {
  CaslPermissionAction,
  CaslPermissionSubject,
} from '../casl/actions-subjects.ts';

export type AppAbility = Ability<[CaslPermissionAction, CaslPermissionSubject]>;

export const AppAbility = Ability as AbilityClass<AppAbility>;
