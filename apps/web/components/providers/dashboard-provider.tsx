'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useGetDashboardContextQuery, useUserStore } from '@stackschool/ui';
import { Spinner } from '@/components/ui/spinner';
import { parseAxiosError } from '@stackschool/shared';

// Type du contexte (dérivé de la requête GraphQL)
// On pourrait utiliser ReturnType<typeof useGetDashboardContextQuery>['data'] mais c'est plus propre de définir une interface
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

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { currentSchool } = useUserStore();

  // Si pas d'école sélectionnée, on ne charge rien (ProtectedRoute ou SelectSchool s'en occupent)
  const schoolId = currentSchool?.id;

  const { data, isLoading, error } = useGetDashboardContextQuery(
    { input: schoolId },
    {
      enabled: !!schoolId,
      staleTime: 1000 * 60 * 5, // Cache 5 min
    },
  );
  console.log('currentSchool', currentSchool);
  const contextData = data?.me?.schoolContext;
  console.log('contextData', data);
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }
  const { message } = parseAxiosError(error);
  console.log('Error', message);

  if (error || !contextData) {
    // Gérer l'erreur (ex: redirection ou message)
    return <div>Erreur de chargement du contexte école.</div>;
  }

  const value: DashboardContextType = {
    role: contextData.role,
    school: currentSchool,
    teacherProfile: contextData.teacher,
    studentProfile: contextData.student,
    parentProfile: contextData.parent,
    isLoading,
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
