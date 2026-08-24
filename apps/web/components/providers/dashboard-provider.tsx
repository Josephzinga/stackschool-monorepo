'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';
import {
  GetDashboardContextQuery,
  useGetDashboardContextQuery,
  useUserStore,
} from '@stackschool/ui';
import { parseAxiosError } from '@stackschool/contracts';
import { LoaderCircleIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoadingStore } from '@stackschool/ui';

const DashboardContext = createContext<GetDashboardContextQuery | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { currentSchool, currentMemberShip } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const { show, hide } = useLoadingStore();

  const schoolId = currentSchool?.id;
  const { data, isLoading, error, isError } = useGetDashboardContextQuery(
    { input: schoolId || '' },
    {
      enabled: !!schoolId,
      staleTime: 1000 * 60 * 5,
    },
  );

  const contextData = data?.me?.schoolContext;
  const role = currentMemberShip?.role || contextData?.role;

  // Logique de redirection basée sur le rôle
  useEffect(() => {
    if (isLoading || !role) return;

    // Mapping Rôle -> Route de base
    const roleRoutes: Record<string, string> = {
      ADMIN: '/dashboard/admin',
      TEACHER: '/dashboard/teacher',
      STUDENT: '/dashboard/student',
      PARENT: '/dashboard/parents',
    };

    const allowedRoute = roleRoutes[role];

    // Si on est à la racine /dashboard, on redirige vers le dashboard spécifique
    if (pathname === '/dashboard') {
      router.replace(allowedRoute || '/');
      return;
    }

    // Protection des routes spécifiques
    // Si je suis TEACHER et que j'essaie d'aller sur /dashboard/admin...
    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      router.replace(allowedRoute || '/dashboard');
    }
    if (pathname.startsWith('/dashboard/teacher') && role !== 'TEACHER') {
      router.replace(allowedRoute || '/dashboard');
    }
    // ... ajouter d'autres règles si besoin
  }, [role, pathname, isLoading, router]);

  useEffect(() => {
    if (isLoading) {
      show();
    } else {
      hide();
    }
  }, [isLoading, show, hide]);

  if (isError) {
    const { message } = parseAxiosError(error);
    console.log('Error', message);
    return <div>Erreur de chargement du contexte école.</div>;
  }

  const value: GetDashboardContextQuery = {
    me: {
      schoolContext: contextData || null,
    },
  };

  return <DashboardContext value={value}>{children}</DashboardContext>;
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
