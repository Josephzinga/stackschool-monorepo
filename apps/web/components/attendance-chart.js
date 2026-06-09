'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttendanceChart;
const recharts_1 = require("recharts");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const card_1 = require("@/components/ui/card");
const chart_1 = require("@/components/ui/chart");
const chartConfig = {
    present: {
        label: 'Présent',
        color: 'var(--chart-4)',
    },
    absent: {
        label: 'Absent',
        color: '#f12a2a',
    },
    late: {
        label: 'Retard',
        color: '#f2ac32',
    },
};
function AttendanceChart({ data, }) {
    const chartData = data?.map((item) => ({
        ...item,
        day: (0, date_fns_1.format)((0, date_fns_1.parseISO)(item.date), 'EEEE', { locale: locale_1.fr }),
    })) || [];
    if (!data || data.length === 0) {
        return (<card_1.Card className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Aucune donnée d'assiduité</p>
      </card_1.Card>);
    }
    return (<card_1.Card className="w-full h-full flex flex-col drop-shadow-lg">
      <card_1.CardHeader className="pb-2">
        <card_1.CardTitle className="text-lg font-medium">
          Assiduité Hebdomadaire
        </card_1.CardTitle>
        <card_1.CardDescription>
          Présences vs Absences (7 derniers jours)
        </card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent className="flex-1 min-h-62.5">
        <chart_1.ChartContainer className="w-full h-full" config={chartConfig}>
          <recharts_1.BarChart accessibilityLayer data={chartData}>
            <recharts_1.CartesianGrid vertical={false} strokeDasharray="3 3"/>
            <recharts_1.XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)}/>

            <chart_1.ChartTooltip cursor={{ fill: 'transparent' }} content={<chart_1.ChartTooltipContent indicator="dot"/>}/>
            <recharts_1.Bar dataKey="present" fill="var(--color-present)" radius={[0, 0, 5, 5]} stackId="a"/>
            <recharts_1.Bar dataKey="late" fill="var(--color-late)" radius={[0, 0, 0, 0]} stackId="a"/>
            <recharts_1.Bar dataKey="absent" fill="var(--color-absent)" radius={[5, 5, 0, 0]} stackId="a"/>
          </recharts_1.BarChart>
        </chart_1.ChartContainer>
      </card_1.CardContent>
    </card_1.Card>);
}
//# sourceMappingURL=attendance-chart.js.map