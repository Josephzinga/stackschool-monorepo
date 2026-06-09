import { ColumnDef } from '@tanstack/react-table';
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
    meta?: {
        total: number;
        limit: number;
        totalPages: number;
    };
    classId?: string;
}
export declare function DataTable<TData, TValue>({ columns, data, isLoading, meta, classId, }: DataTableProps<TData, TValue>): import("react").JSX.Element;
export {};
//# sourceMappingURL=data-table.d.ts.map