'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGetMeQuery, useUserStore } from '@stackschool/ui';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@stackschool/shared';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    setUser,
    currentSchool,
    currentMemberShip,
    setCurrentSchool,
    setCurrentMemberShip,
  } = useUserStore();

  const { data, isLoading, error } = useGetMeQuery({}, { retry: false });
  let currentUser = '';

  useEffect(() => {
    if (!isLoading && (!data?.me || error)) {
      if (!pathname.startsWith('/auth')) {
        router.replace('/auth/login');
      }
      return;
    }

    if (data?.me?.memberships && currentSchool) {
      for (const member of data?.me?.memberships) {
        if (member?.school?.id === currentSchool?.id) {
          setCurrentSchool(member?.school ?? undefined);

          api.defaults.headers.common['x-school-id'] = member?.school?.id;
        } else {
          setCurrentSchool(data?.me?.memberships[0]?.school ?? undefined);
        }
      }
    }

    // 2. Si utilisateur connecté
    if (data?.me) {
      setUser(data.me);

      const isProfileComplete =
        data.me.profileCompleted && data.me.hasMembership;
      const isOnCompleteProfile = pathname === '/auth/complete-profile';
      const isOnAuthPage = pathname.startsWith('/auth') && !isOnCompleteProfile;
      const isOnSelectSchool = pathname === '/dashboard/select-school';

      // Cas A : Profil incomplet
      if (!isProfileComplete && !isOnCompleteProfile && !isOnAuthPage) {
        router.replace('/auth/complete-profile');
        return;
      }
      // Cas B : Profil complet
      if (isProfileComplete) {
        // Redirection depuis les pages d'auth
        if (isOnCompleteProfile || isOnAuthPage) {
          router.replace(
            `/dashboard/${currentMemberShip?.role?.toLocaleLowerCase()}`,
          );
          return;
        }

        // Gestion Multi-Écoles
        const memberships = data.me.memberships || [];

        if (!currentSchool && !isOnSelectSchool) {
          if (memberships.length === 1) {
            setCurrentSchool(memberships[0]?.school ?? undefined);
            setCurrentMemberShip(memberships[0]!);
          } else if (memberships.length > 1) {
            // Plusieurs écoles : Redirection vers la sélection

            router.replace('/school/select-school');
            return;
          } else {
            // Aucune école (ne devrait pas arriver si hasMembership=true, mais sécurité)
            router.replace('/auth/complete-profile');
            return;
          }
        }
      }
    }
  }, [
    isLoading,
    router,
    data,
    error,
    pathname,
    setUser,
    currentSchool,
    setCurrentSchool,
    currentMemberShip,
    setCurrentMemberShip,
  ]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
