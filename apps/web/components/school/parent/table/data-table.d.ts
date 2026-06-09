import { type ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { PaginationMeta } from '@stackschool/ui';
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean;
    meta?: Omit<PaginationMeta, 'page'>;
}
export declare function DataTable<TData, TValue>({ columns, data, isLoading, meta, }: DataTableProps<TData, TValue>): React.JSX.Element;
export {};
//# sourceMappingURL=data-table.d.ts.map