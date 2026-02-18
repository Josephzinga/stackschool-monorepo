'use client';

import { createContext, ReactNode, useContext } from 'react';
import {
  GetDashboardContextQuery,
  useGetDashboardContextQuery,
  useUserStore,
} from '@stackschool/ui';
import { parseAxiosError } from '@stackschool/shared';
import { LoaderCircleIcon } from 'lucide-react';

interface DashboardContextType {
  role: string;
  school: {
    id: string;
    name: string;
    logo?: string | null;
  };
  teacherProfile?: any;
  studentProfile?: any;
  parentProfile?: any;
  isLoading: boolean;
}

const DashboardContext = createContext<GetDashboardContextQuery | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { currentSchool } = useUserStore();

  const schoolId = currentSchool?.id;

  const { data, isLoading, error } = useGetDashboardContextQuery(
    { input: schoolId },
    {
      enabled: !!schoolId,
      staleTime: 1000 * 60 * 5,
    },
  );

  const contextData = data?.me?.schoolContext;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center bg-gray-50 dark:bg-gray-900 animate-pulse justify-center">
        <LoaderCircleIcon className="h-15 w-15 animate-spin text-primary" />
      </div>
    );
  }
  const { message } = parseAxiosError(error);
  console.log('Error', message);

  if (error || !contextData) {
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
