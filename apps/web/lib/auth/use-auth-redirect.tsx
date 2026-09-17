import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useGetMeQuery, useUserStore } from '@stackschool/ui';
import { resolveGuardRedirect } from './route-guard';
import { useSessionSync } from '@/hooks/use-session-sync';

export function useAuthRedirectDecision() {
  const pathname = usePathname();
  const { currentSchool, currentMemberShip } = useUserStore();

  const { data, isLoading, error } = useGetMeQuery({}, { retry: false });
  const me = data?.me;

  useSessionSync(me);

  const redirectTo = useMemo(() => {
    if (isLoading) return null;

    if (!me || error) {
      return pathname.startsWith('/auth') ? null : '/auth/login';
    }

    return resolveGuardRedirect({
      pathname,
      isAuthenticated: true,
      isProfileComplete: Boolean(me.profileCompleted && me.hasMembership),
      hasCurrentSchool: Boolean(currentSchool),
      membershipCount: me.memberships?.length ?? 0,
      currentRole: currentMemberShip?.role,
    });
  }, [isLoading, me, error, pathname, currentSchool, currentMemberShip]);

  return { me, isLoading, error, redirectTo };
}
