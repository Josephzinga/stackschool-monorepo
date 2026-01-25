'use client';

import { SectionCards } from '@/components/section-cards';
import AttendanceChart from '@/components/attendance-chart'; // Import du nouveau composant
import { useGetAdminDashboardStatsQuery, useUserStore } from '@stackschool/ui';
import { Spinner } from '@/components/ui/spinner';
import { ChartRadialGender } from '@/components/student-gender-chart';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import EventSection from '@/components/event-section';

export default function AdminDashboard() {
  const { currentSchool } = useUserStore();
  const schoolId = currentSchool?.id;

  const { data, isLoading, error } = useGetAdminDashboardStatsQuery(
    { schoolId: schoolId! },
    { enabled: !!schoolId },
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Erreur de chargement des statistiques.
      </div>
    );
  }

  const stats = data?.schoolStats?.stats;

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col w-full lg:w-[65%] overflow-y-auto">
        <div className="flex flex-col gap-4 p-4 md:p-5">
          {/* Cartes KPI */}
          <SectionCards stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-4">
            {/* Graphique Genre (1/3) */}
            <div className="w-full h-[400px]">
              {/* Utilisation du composant ChartRadialGender corrigé */}
              {stats?.studentGender && (
                <ChartRadialGender stats={stats.studentGender} />
              )}
            </div>

            {/* Graphique Assiduité (2/3) */}
            <div className="w-full h-[400px]">
              {/* On passe l'historique au composant AttendanceChart */}
              <AttendanceChart data={stats?.attendance?.history} />
            </div>
          </div>

          {/* Le graphique est ici  */}
          <ChartAreaInteractive />
        </div>
      </div>

      {/* Calendrier Latéral */}

      <EventSection />
    </div>
  );
}
