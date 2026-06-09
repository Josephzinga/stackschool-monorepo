import { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
    meta?: {
        total: number;
        limit: number;
        totalPages: number;
    };
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
}
export declare function DataTable<TData, TValue>({ columns, data, isLoading, meta, pagination, setPagination, }: DataTableProps<TData, TValue>): import("react").JSX.Element;
export {};
//# sourceMappingURL=data-table.d.ts.map