'use client';

import { TrendingUp } from 'lucide-react';
import { RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Définition locale si non importée
interface GenderStats {
  male: number;
  female: number;
  other?: number;
}

interface AttendanceStats {
  rate: number;
  presentCount: number;
  totalExpected: number;
}

const chartConfig = {
  total: {
    label: 'Total',
  },
  male: {
    label: 'Garçons',
    color: 'var(--chart-1)',
  },
  female: {
    label: 'Filles',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function ChartRadialGender({
  stats,
  attendance,
}: {
  stats: GenderStats;
  attendance?: AttendanceStats | null;
}) {
  const total = stats.male + stats.female + (stats.other || 0);
  const hasAttendance = !!attendance && attendance.totalExpected > 0;
  const attendanceRate = hasAttendance ? attendance.rate : 0;
  const attendancePresent = hasAttendance ? attendance.presentCount : 0;
  const attendanceExpected = hasAttendance ? attendance.totalExpected : 0;

  const chartData = [
    {
      count: total,
      fill: 'transparent',
      display: 'none',
    },
    {
      gender: 'female',
      count: stats.female,
      fill: '#e538c4',
    },
    {
      gender: 'male',
      count: stats.male,
      fill: 'var(--chart-1)',
    },
  ];
  const style = {
    top: '100%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
    backgroundColor: '',
  };
  return (
    <Card className="flex flex-col py-4 gap-2! w-full h-full drop-shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition Élèves</CardTitle>
        <CardDescription>Année Scolaire 2023-2024</CardDescription>
      </CardHeader>
      <CardContent className="h-60 w-full pb-0">
        <ChartContainer
          config={chartConfig}
          style={{ color: 'blue' }}
          className="mx-auto aspect-squar min-h-50 w-full h-full"
        >
          <RadialBarChart
            startAngle={90}
            endAngle={-270}
            innerRadius="20%"
            outerRadius="100%"
            data={chartData}
            barSize={30}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="gender" />}
            />

            <RadialBar dataKey="count" background cornerRadius={10} />
          </RadialBarChart>
          {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center leading-tight">
              <p className="text-2xl font-bold">
                {attendanceRate.toFixed(1)}
                <span className="text-sm">%</span>
              </p>
              <p className="text-xs text-muted-foreground">Présence du jour</p>
              <p className="text-sm font-medium">
                {attendancePresent}/{attendanceExpected}
              </p>
            </div>
          </div>*/}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          {total} élèves inscrits{' '}
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground flex gap-3 font-jost font-Bold text-sm">
          <div className="flex gap-1 items-center">
            <span className="h-3 w-3 rounded-full bg-chart-1"></span>
            <p className="">{stats.male} Garçons</p>
          </div>
          <div className="flex gap-1 items-center">
            <span className="h-3 w-3 rounded-full bg-[#e538c4]" />
            <p>{stats.female} Filles</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
