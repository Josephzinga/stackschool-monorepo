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
  const { setUser } = useUserStore();

  // On utilise useGetMeQuery pour vérifier la session
  // retry: false pour ne pas insister si 401
  const { data, isLoading, error } = useGetMeQuery({}, { retry: false });

  useEffect(() => {
    // 1. Si chargement terminé et pas d'utilisateur (ou erreur)
    if (!isLoading && (!data?.me || error)) {
      // Si on n'est pas déjà sur une page publique (auth), on redirige
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

      // Cas A : Profil incomplet mais l'utilisateur essaie d'accéder à l'app
      if (!isProfileComplete && !isOnCompleteProfile && !isOnAuthPage) {
        router.replace('/auth/complete-profile');
        return;
      }

      // Cas B : Profil complet mais l'utilisateur est sur complete-profile ou login
      if (isProfileComplete && (isOnCompleteProfile || isOnAuthPage)) {
        router.replace('/dashboard');
        return;
      }
    }
  }, [isLoading, router, data, error, pathname, setUser]);

  // Pendant le chargement ou la redirection, on affiche un loader
  // pour éviter le "flash" de contenu protégé ou de la page de login
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <Spinner className="h-10 w-10 text-primary font-bold" />
      </div>
    );
  }

  // Si on est connecté (ou sur une page publique autorisée), on affiche le contenu
  // Note: Pour une sécurité maximale, on pourrait retourner null si !data?.me && !isPublicPage
  return <>{children}</>;
}
