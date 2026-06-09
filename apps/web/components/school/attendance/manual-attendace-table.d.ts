import { type ColumnDef } from '@tanstack/react-table';
interface AttendanceTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
}
export declare function AttendanceTable<T>({ columns, data, isLoading, }: AttendanceTableProps<T>): import("react").JSX.Element;
export {};
//# sourceMappingURL=manual-attendace-table.d.ts.map