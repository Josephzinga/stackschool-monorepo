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

const chartConfig = {
  total: {
    label: 'Total',
  },
  male: {
    label: 'Garçons',
    color: 'var(--chart-1)', // Assurez-vous que ces variables CSS existent (ex: hsl(220 70% 50%))
  },
  female: {
    label: 'Filles',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function ChartRadialGender({ stats }: { stats: GenderStats }) {
  const total = stats.male + stats.female + (stats.other || 0);

  const chartData = [
    {
      name: 'total',
      count: total,
      fill: 'transparent',
      display: 'none',
    },
    {
      name: 'female',
      count: stats.female,
      fill: 'var(--chart-2)', // Rose/Violet
    },
    {
      name: 'male',
      count: stats.male,
      fill: 'var(--chart-1)', // Bleu
    },
  ];
  const style = {
    top: '45%',
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
      <CardContent className="flex-1 pb-0   min-h-50">
        <ChartContainer
          config={chartConfig}
          style={{ color: 'blue' }}
          className="mx-auto aspect-square max-h-65 w-full"
        >
          <RadialBarChart
            startAngle={90}
            endAngle={-270}
            innerRadius="40%"
            outerRadius="100%"
            dataKey="count"
            barSize={25}
            style={style}
            data={chartData}
          >
            {/*  <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270} // Cercle complet
            innerRadius={60}
            outerRadius={110}
            barSize={50}
            style={style}
          > */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, key) => [
                    value,
                    chartConfig[key as keyof typeof chartConfig]?.label || key,
                  ]}
                  hideLabel
                  nameKey="name"
                />
              }
            />

            <RadialBar dataKey="count" background cornerRadius={10} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          {total} élèves inscrits{' '}
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground text-center text-xs">
          {stats.male} Garçons • {stats.female} Filles
        </div>
      </CardFooter>
    </Card>
  );
}
