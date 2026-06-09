'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.ChartRadialPerformance = ChartRadialPerformance;
const lucide_react_1 = require("lucide-react");
const recharts_1 = require("recharts");
const card_1 = require("@/components/ui/card");
const chart_1 = require("@/components/ui/chart");
exports.description = 'A radial chart with stacked sections';
const chartData = [{ month: 'january', desktop: 1260, mobile: 570 }];
const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'var(--chart-1)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--chart-3)',
    },
};
function ChartRadialPerformance() {
    const totalVisitors = chartData[0].desktop + chartData[0].mobile;
    return (<div className="flex h-80  flex-col">
      <div className="flex flex-1 w-full justify-start items-center pb-0">
        <chart_1.ChartContainer config={chartConfig} className="mx-auto aspect-square w-full h-70 ">
          <recharts_1.RadialBarChart data={chartData} endAngle={180} innerRadius={90} outerRadius={140}>
            <chart_1.ChartTooltip cursor={false} content={<chart_1.ChartTooltipContent hideLabel/>}/>
            <recharts_1.PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <recharts_1.Label content={({ viewBox }) => {
            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          Visitors
                        </tspan>
                      </text>);
            }
        }}/>
            </recharts_1.PolarRadiusAxis>
            <recharts_1.RadialBar dataKey="mobile" fill="var(--color-mobile)" stackId="a" cornerRadius={5} className="stroke-transparent stroke-2"/>
            <recharts_1.RadialBar dataKey="desktop" stackId="a" cornerRadius={5} fill="var(--color-desktop)" className="stroke-transparent stroke-2"/>
          </recharts_1.RadialBarChart>
        </chart_1.ChartContainer>
      </div>
      <card_1.CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <lucide_react_1.TrendingUp className="h-4 w-4"/>
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </card_1.CardFooter>
    </div>);
}
//# sourceMappingURL=chart-performance.js.map