'use client';

import { DataTableProps } from '@/types/tanstack-table';
import { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import DataTableSkeleton from '@/components/skeleton';

export function GroupDataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  meta,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row: any) => row.id,
    rowCount: meta?.total,
    manualPagination: true,
    manualFiltering: true,
    state: {
      pagination,
    },
  });

  return (
    <div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
        <DataTableSkeleton isLoading={isLoading} />
        <AppDataTable table={table} columns={columns} isLoading={isLoading} />
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />
    </div>
  );
}
