'use client';

import { AbilityProvider } from '@casl/react';
import { defineAbilityFor, SchoolUserForAbility } from '@stackschool/contracts';
import { useUserStore } from '@stackschool/ui';
import React, { useMemo } from 'react';

export const AppAbilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentMemberShip } = useUserStore();
  const schoolUser: SchoolUserForAbility = {
    id: currentMemberShip?.id!,
    schoolId: currentMemberShip?.schoolId!,
    role: currentMemberShip?.role!,
    grantedPermissions: currentMemberShip?.permissions ?? [],
  };
  const ability = useMemo(() => defineAbilityFor(schoolUser), [schoolUser]);
  return <AbilityProvider value={ability}>{children}</AbilityProvider>;
};
