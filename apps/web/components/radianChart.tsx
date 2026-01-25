'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { GenderStats } from '@stackschool/ui';
import { TrendingUp } from 'lucide-react';

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

interface SimpleRadialBarChartProps {
  data?: GenderStats | null;
}

const SimpleRadialBarChart = ({ data }: SimpleRadialBarChartProps) => {
  // Transformation des données pour Recharts
  // On trie pour que le plus grand cercle soit à l'extérieur (ou l'inverse selon le design)
  const chartData = [
    {
      name: 'Total',
      count: data?.male && data?.female ? data.female + data.male : 0,
      display: 'none',
      fill: 'var(--foreground)',
    },

    {
      name: 'Filles',
      count: data?.female || 0,
      fill: 'var(--chart-3)', // pink-500
    },
    {
      name: 'Garçons',
      count: data?.male || 0,
      fill: 'var(--primary)', // blue-500
    },
  ];
  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };

  // Si pas de données, on affiche un placeholder ou rien
  if (!data || (data.male === 0 && data.female === 0)) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Aucune donnée
      </div>
    );
  }

  return (
    <div className=" h-72 items-center justify-center w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          dataKey="count"
          barSize={15}
          style={style}
          data={chartData}
        >
          <RadialBar
            label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
            background
            dataKey="count"
            cornerRadius={10} // Bords arrondis
          />
          <Legend
            iconSize={12}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
          <Tooltip
            formatter={(value: number, key) => [value, 'Eléve']}
            contentStyle={{
              borderRadius: '8px',
              border: '',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute bottom-10">
        <div className="flex items-center justify-center w-full">
          <div>
            <span className="h-4 w-4 bg-rose-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRadialBarChart;
('use client');

export const description = 'A multiple bar chart';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function ChartBarMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
