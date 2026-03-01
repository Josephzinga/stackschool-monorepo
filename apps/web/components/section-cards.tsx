'use client';

import React from 'react';
import { IconSchool } from '@tabler/icons-react';
import { ArrowDown, ArrowUp, Minus, UserIcon, Users2Icon } from 'lucide-react';
import UserCard from '@/components/user-card';
import { SchoolStats } from '@stackschool/ui';

type Trend = 'UP' | 'DOWN' | 'STABLE';

function getTrend(current: number, previous: number) {
  const diff = current - previous;
  let trend: Trend = 'STABLE';

  if (diff > 0) trend = 'UP';
  else if (diff < 0) trend = 'DOWN';

  const percent = previous > 0 ? (diff / previous) * 100 : null;
  return { trend, diff, percent };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(value));
}

export function SectionCards({ stats }: { stats?: SchoolStats | null }) {
  const currentRevenue = Number(stats?.monthlyRevenue?.currentMonth ?? 0);
  const previousRevenue = Number(stats?.monthlyRevenue?.previousMonth ?? 0);

  const revenueTrend = getTrend(currentRevenue, previousRevenue);

  // Préparer badge pour la carte revenus
  let revenueBadgeTitle = '';
  if (revenueTrend.percent !== null) {
    revenueBadgeTitle = `${revenueTrend.percent > 0 ? '+' : ''}${revenueTrend.percent.toFixed(1)}%`;
  } else {
    // previous === 0
    revenueBadgeTitle = currentRevenue > 0 ? 'Nouveau' : '0%';
  }

  const badgeMap: Record<
    typeof revenueTrend.trend,
    { className: string; Icon: React.ComponentType<any> }
  > = {
    UP: {
      className: 'bg-green-50 text-green-700 border-green-200',
      Icon: ArrowUp,
    },
    DOWN: {
      className: 'bg-red-50 text-red-700 border-red-200',
      Icon: ArrowDown,
    },
    STABLE: {
      className: 'bg-slate-50 text-slate-700 border-slate-200',
      Icon: Minus,
    },
  };

  const revenueBadge = badgeMap[revenueTrend.trend];

  return (
    <div className="flex flex-col justify-between md:flex-row gap-2 w-full flex-wrap">
      {/* Carte Élèves */}
      <UserCard
        DescriptionIcon={Users2Icon}
        info="Inscrits pour l'année en cours"
        title={stats?.totalStudents || 0}
        description="Total Élèves"
        badgeTitle="Actifs"
        badgeClassName="bg-green-50 text-green-700 border-green-200"
      />

      {/* Carte Professeurs */}
      <UserCard
        DescriptionIcon={UserIcon}
        title={stats?.totalTeachers || 0}
        description="Enseignants"
        badgeTitle="Actifs"
        info="Corps professoral actif"
        badgeClassName="bg-green-50 text-green-700 border-green-200"
      />

      {/* Carte Classes */}
      <UserCard
        description="Classes"
        title={stats?.totalClasses || 0}
        badgeTitle="+2"
        info="Salles de classe ouvertes"
        DescriptionIcon={IconSchool}
        badgeClassName="bg-amber-50 text-amber-700 border-amber-200"
      />

      {/* Carte Revenus — icône + couleur conditionnelle selon trend */}
      <UserCard
        title={`${formatCurrency(currentRevenue)} FCA`}
        description="Revenus Mensuels"
        badgeTitle={revenueBadgeTitle}
        badgeClassName={revenueBadge.className}
        info={
          previousRevenue > 0
            ? `Par rapport à ${new Intl.NumberFormat('fr-FR').format(previousRevenue)} FCA`
            : 'Pas de revenus le mois précédent'
        }
        DescriptionIcon={undefined}
        badgeIcon={revenueBadge.Icon}
      />
    </div>
  );
}

export default SectionCards;
