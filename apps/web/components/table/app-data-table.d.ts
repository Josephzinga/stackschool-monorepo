import { ColumnDef, Table as TableType } from '@tanstack/react-table';
import * as React from 'react';
interface AppDataTableProps<TData> {
    table: TableType<TData>;
    isLoading?: boolean;
    columns: ColumnDef<TData>[];
}
export default function AppDataTable<TData>({ table, columns, isLoading, }: AppDataTableProps<TData>): React.JSX.Element;
export {};
//# sourceMappingURL=app-data-table.d.ts.map