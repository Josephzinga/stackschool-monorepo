import { Table } from '@tanstack/react-table';
interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    isLoading?: boolean;
    renderTotalCount?: React.ReactNode;
}
export declare function DataTablePagination<TData>({ table, isLoading, renderTotalCount, }: DataTablePaginationProps<TData>): import("react").JSX.Element;
export {};
//# sourceMappingURL=data-table-pagination.d.ts.map