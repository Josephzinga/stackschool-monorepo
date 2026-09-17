'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import {
  GetDashboardContextQuery,
  useGetDashboardContextQuery,
  useLoadingStore,
  useUserStore,
} from '@stackschool/ui';
import { parseAxiosError } from '@stackschool/contracts';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const DashboardContext = createContext<GetDashboardContextQuery | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { currentSchool, currentMemberShip } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const { show, hide } = useLoadingStore();

  const schoolId = currentSchool?.id;
  const { data, isPending, error, isError } = useGetDashboardContextQuery(
    { input: schoolId || '' },
    {
      enabled: !!schoolId,
      staleTime: 1000 * 60 * 5,
    },
  );

  const contextData = data?.me?.schoolContext;
  const role = currentMemberShip?.role || contextData?.role;

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }
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
