'use client';
import { useEffect } from 'react';
import { GetMeQuery, useUserStore } from '@stackschool/ui';
import { toUserWithRelationsContract } from '@stackschool/contracts';

export function useSessionSync(me: GetMeQuery['me']) {
  const { setUser, currentSchool, setCurrentSchool, setCurrentMemberShip } =
    useUserStore();

  useEffect(() => {
    if (!me) return;

    setUser(toUserWithRelationsContract(me));

    const memberships = me.memberships ?? [];
    if (memberships.length === 0) return;

    // Keep the current selection if it's still among this user's
    // memberships (fixes the original bug: a later non-matching membership
    // in the loop no longer overwrites an already-correct selection).
    const currentIsStillValid =
      currentSchool != null &&
      memberships.some((m) => m?.school?.id === currentSchool.id);

    if (currentIsStillValid) return;

    if (memberships.length === 1) {
      const membership = memberships[0];
      if (membership?.school) {
        setCurrentSchool({
          ...membership.school,
          logo: membership.school.logo ?? undefined,
        });
        setCurrentMemberShip(membership);
      }
    }
  }, [me, currentSchool, setUser, setCurrentSchool, setCurrentMemberShip]);
}
