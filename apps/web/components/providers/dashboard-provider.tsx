'use client';

import { createContext, ReactNode, useContext, useEffect } from 'react';
import {
  GetDashboardContextQuery,
  useGetDashboardContextQuery,
  useUserStore,
} from '@stackschool/ui';
import { parseAxiosError } from '@stackschool/shared';
import { LoaderCircleIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const DashboardContext = createContext<GetDashboardContextQuery | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { currentSchool } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  const schoolId = currentSchool?.id;
  console.log('SchoolId', schoolId);
  const { data, isLoading, error } = useGetDashboardContextQuery(
    { input: schoolId },
    {
      enabled: !!schoolId,
      staleTime: 1000 * 60 * 5,
    },
  );

  const contextData = data?.me?.schoolContext;
  const role = contextData?.role;

  // Logique de redirection basée sur le rôle
  useEffect(() => {
    if (isLoading || !role) return;

    // Mapping Rôle -> Route de base
    const roleRoutes: Record<string, string> = {
      ADMIN: '/dashboard/admin',
      TEACHER: '/dashboard/teacher',
      STUDENT: '/dashboard/student',
      PARENT: '/dashboard/parent',
    };

    const allowedRoute = roleRoutes[role];
    console.log('AllowedRoute', allowedRoute);

    // Si on est à la racine /dashboard, on redirige vers le dashboard spécifique
    if (pathname === '/dashboard') {
      router.replace(allowedRoute || '/dashboard');
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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center bg-gray-50 dark:bg-gray-900 animate-pulse justify-center">
        <LoaderCircleIcon className="h-15 w-15 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contextData) {
    const { message } = parseAxiosError(error);
    console.log('Error', message);
    return <div>Erreur de chargement du contexte école.</div>;
  }

  const value: GetDashboardContextQuery = {
    me: {
      schoolContext: contextData,
    },
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
