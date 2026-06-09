'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartRadialGender = ChartRadialGender;
const lucide_react_1 = require("lucide-react");
const recharts_1 = require("recharts");
const card_1 = require("@/components/ui/card");
const chart_1 = require("@/components/ui/chart");
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
};
function ChartRadialGender({ stats, attendance, }) {
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
    return (<card_1.Card className="flex flex-col py-4 gap-2! w-full h-full drop-shadow-lg">
      <card_1.CardHeader className="items-center pb-0">
        <card_1.CardTitle>Répartition Élèves</card_1.CardTitle>
        <card_1.CardDescription>Année Scolaire 2023-2024</card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent className="h-60 w-full pb-0">
        <chart_1.ChartContainer config={chartConfig} style={{ color: 'blue' }} className="mx-auto aspect-squar min-h-50 w-full h-full">
          <recharts_1.RadialBarChart startAngle={90} endAngle={-270} innerRadius="20%" outerRadius="100%" data={chartData} barSize={30}>
            <chart_1.ChartTooltip cursor={false} content={<chart_1.ChartTooltipContent nameKey="gender"/>}/>

            <recharts_1.RadialBar dataKey="count" background cornerRadius={10}/>
          </recharts_1.RadialBarChart>
          
        </chart_1.ChartContainer>
      </card_1.CardContent>
      <card_1.CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          {total} élèves inscrits{' '}
          <lucide_react_1.TrendingUp className="h-4 w-4 text-green-500"/>
        </div>
        <div className="text-muted-foreground flex gap-3 font-jost font-Bold text-sm">
          <div className="flex gap-1 items-center">
            <span className="h-3 w-3 rounded-full bg-chart-1"></span>
            <p className="">{stats.male} Garçons</p>
          </div>
          <div className="flex gap-1 items-center">
            <span className="h-3 w-3 rounded-full bg-[#e538c4]"/>
            <p>{stats.female} Filles</p>
          </div>
        </div>
      </card_1.CardFooter>
    </card_1.Card>);
}
//# sourceMappingURL=student-gender-chart.js.map