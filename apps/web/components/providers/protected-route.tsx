'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGetMeQuery, useUserStore } from '@stackschool/ui';
import { Spinner } from '@/components/ui/spinner';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, currentSchool, user, setCurrentSchool } = useUserStore();

  const { data, isLoading, error } = useGetMeQuery({}, { retry: false });

  useEffect(() => {
    if (!isLoading && (!data?.me || error)) {
      if (!pathname.startsWith('/auth')) {
        router.replace('/auth/login');
      }
      return;
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
          router.replace(`/dashboard/${user?.schoolContext?.role}`);
          return;
        }

        // Gestion Multi-Écoles
        const memberships = data.me.memberships || [];

        // Si pas d'école choisie
        if (!currentSchool && !isOnSelectSchool) {
          if (memberships.length === 1) {
            // Une seule école : Auto-sélection
            setCurrentSchool(memberships[0]?.school);
          } else if (memberships.length > 1) {
            // Plusieurs écoles : Redirection vers la sélection
            console.log('plusieur école', memberships);
            router.replace('/dashboard/select-school');
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
