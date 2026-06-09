'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.ChartBarMultiple = ChartBarMultiple;
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const chart_1 = require("@/components/ui/chart");
const SimpleRadialBarChart = ({ data }) => {
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
            fill: 'var(--chart-3)',
        },
        {
            name: 'Garçons',
            count: data?.male || 0,
            fill: 'var(--primary)',
        },
    ];
    const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
    };
    if (!data || (data.male === 0 && data.female === 0)) {
        return (<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Aucune donnée
      </div>);
    }
    return (<div className=" h-72 items-center justify-center w-full">
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" dataKey="count" barSize={15} style={style} data={chartData}>
          <recharts_1.RadialBar label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }} background dataKey="count" cornerRadius={10}/>
          <recharts_1.Legend iconSize={12} layout="horizontal" verticalAlign="bottom" align="center"/>
          <recharts_1.Tooltip formatter={(value, key) => [value, 'Eléve']} contentStyle={{
            borderRadius: '8px',
            border: '',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}/>
        </recharts_1.RadialBarChart>
      </recharts_1.ResponsiveContainer>
      <div className="absolute bottom-10">
        <div className="flex items-center justify-center w-full">
          <div>
            <span className="h-4 w-4 bg-rose-500 rounded-full"/>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = SimpleRadialBarChart;
('use client');
exports.description = 'A multiple bar chart';
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
};
function ChartBarMultiple() {
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle>Bar Chart - Multiple</card_1.CardTitle>
        <card_1.CardDescription>January - June 2024</card_1.CardDescription>
      </card_1.CardHeader>
      <card_1.CardContent>
        <chart_1.ChartContainer config={chartConfig}>
          <recharts_1.BarChart accessibilityLayer data={chartData}>
            <recharts_1.CartesianGrid vertical={false}/>
            <recharts_1.XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)}/>
            <chart_1.ChartTooltip cursor={false} content={<chart_1.ChartTooltipContent indicator="dashed"/>}/>
            <recharts_1.Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
            <recharts_1.Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
          </recharts_1.BarChart>
        </chart_1.ChartContainer>
      </card_1.CardContent>
      <card_1.CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <lucide_react_1.TrendingUp className="h-4 w-4"/>
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </card_1.CardFooter>
    </card_1.Card>);
}
//# sourceMappingURL=radianChart.js.map