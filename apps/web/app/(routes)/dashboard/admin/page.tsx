'use client';

import {SectionCards} from '@/components/section-cards';
import AttendanceChart from '@/components/attendance-chart';
import {useGetAdminDashboardStatsQuery, useUserStore} from '@stackschool/ui';
import {Spinner} from '@/components/ui/spinner';
import {ChartRadialGender} from '@/components/student-gender-chart';
import {ChartAreaInteractive} from '@/components/chart-area-interactive';
import EventSection from '@/components/event-section';
import {useSocket} from '@/components/providers/socket-context';
import {useEffect} from 'react';

export default function AdminDashboard() {
  const { currentSchool } = useUserStore();
  const schoolId = currentSchool?.id;
  const socket = useSocket();

  useEffect(() => {
    console.log('joseph', socket);
    if (!socket) return;

    console.log('Socket avaliable', socket.active);
    socket.on('ENROLLMENT_COMPLETED', (data) => {
      console.log('Data Socket: ', data);
    });

    return () => {
      socket.off('ENROLLMENT_COMPLETED')
    };

  }, [socket]);

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

  const stats = data?.school?.stats;

  return (
    <div className="flex h-screnn flex-col lg:flex-row">
      <div className="flex flex-col w-full lg:w-[65%] xl:w-[70%] overflow-y-auto">
        <div className="flex flex-col gap-4 p-4 md:p-5">
          <SectionCards stats={stats} />

          <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1.3fr] w-full gap-4">
            <div className="w-full h-100 min-w-80">
              <AttendanceChart data={stats?.attendance?.history} />
            </div>
            <div className="w-full h-100 min-w-60">
              {stats?.studentGender && (
                <ChartRadialGender
                  stats={stats.studentGender}
                  attendance={stats?.attendance}
                />
              )}
            </div>
          </div>

          <ChartAreaInteractive />
        </div>
      </div>

      <EventSection />
    </div>
  );
}
