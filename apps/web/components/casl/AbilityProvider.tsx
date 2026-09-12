// apps/frontend/src/casl/AbilityProvider.tsx

import React, { createContext, useContext, useMemo } from 'react';
import { createContextualCan } from '@casl/react';
import {
  AppAbility,
  defineAbilityFor,
  SchoolUserForAbility,
} from '@stackschool/shared/casl';

const AbilityContext = createContext<AppAbility | null>(null);

export function AbilityProvider({
  schoolUser,
  children,
}: {
  schoolUser: SchoolUserForAbility;
  children: React.ReactNode;
}) {
  // Recomputed only when the school context.ts changes (e.g. switching schools
  // in a multi-school session) — not on every render.
  const ability = useMemo(() => defineAbilityFor(schoolUser), [schoolUser]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility(): AppAbility {
  const ability = useContext(AbilityContext);
  if (!ability)
    throw new Error('useAbility must be used within <AbilityProvider>');
  return ability;
}

// <Can I="update" a="Grade"> ... </Can> — same rules as the backend guard,
// same defineAbilityFor, zero duplicated logic.
export const Can = createContextualCan(AbilityContext.Consumer);
