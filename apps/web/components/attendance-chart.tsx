'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Définition locale du type si non importé
interface DailyAttendance {
  date: string;
  present: number;
  absent: number;
  late: number;
}

const chartConfig = {
  present: {
    label: 'Présent',
    color: 'var(--chart-2)', // Vert/Bleu
  },
  absent: {
    label: 'Absent',
    color: 'var(--chart-4)', // Rouge/Orange
  },
  late: {
    label: 'Retard',
    color: 'var(--chart-1)', // Jaune
  },
} satisfies ChartConfig;

export default function AttendanceChart({
  data,
}: {
  data?: DailyAttendance[] | null;
}) {
  // Transformation des données pour l'affichage
  const chartData =
    data?.map((item) => ({
      ...item,
      // Formatage de la date : "Lundi", "Mardi"...
      day: format(parseISO(item.date), 'EEEE', { locale: fr }),
      // On peut combiner absent + late si on veut simplifier, ou afficher les 3
    })) || [];

  console.log('ChartData', chartData);

  if (!data || data.length === 0) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Aucune donnée d'assiduité</p>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col drop-shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Assiduité Hebdomadaire
        </CardTitle>
        <CardDescription>
          Présences vs Absences (7 derniers jours)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px]">
        <ChartContainer className="w-full h-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            barSize={20}
            // margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Lun, Mar...
            />
            <YAxis dataKey="present" />
            <ChartTooltip
              cursor={{ fill: 'transparent' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="present"
              fill="var(--color-present)"
              radius={[4, 4, 0, 0]}
              stackId="b"
            />
            <Bar
              dataKey="late"
              fill="var(--color-late)"
              radius={[0, 0, 0, 0]}
              stackId="b"
            />
            <Bar
              dataKey="absent"
              fill="var(--color-absent)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
