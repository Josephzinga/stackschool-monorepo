'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { Spinner } from '@/components/ui/spinner';
import { DataTablePagination } from '@/components/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { useClassTable } from '@/components/school/class/table/table-provider';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  meta?: { total: number; limit: number; totalPages: number };
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  meta,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const {
    setRowSelection,
    setColumnVisibility,
    columnVisibility,
    rowSelection,
  } = useClassTable();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row.id,
    rowCount: meta?.total,
    manualPagination: true,
    manualFiltering: true,
    state: {
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border relative min-h-75">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        )}
        <AppDataTable table={table} columns={columns} isLoading={isLoading} />
      </div>

      <DataTablePagination table={table} isLoading={isLoading} />
    </div>
  );
}
