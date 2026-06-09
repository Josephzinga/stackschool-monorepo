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
export declare function ChartRadialGender({ stats, attendance, }: {
    stats: GenderStats;
    attendance?: AttendanceStats | null;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=student-gender-chart.d.ts.map