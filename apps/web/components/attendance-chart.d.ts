interface DailyAttendance {
    date: string;
    present: number;
    absent: number;
    late: number;
}
export default function AttendanceChart({ data, }: {
    data?: DailyAttendance[] | null;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=attendance-chart.d.ts.map