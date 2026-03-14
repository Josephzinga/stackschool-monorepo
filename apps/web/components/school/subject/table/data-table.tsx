'use client';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTableProps } from '@/components/school/student/table/data-table';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import * as React from 'react';
import { useSubjectTable } from '@/components/school/subject/table/table-provider';

export function SubjectDataTable<TData, TValue>({
  columns,
  data,
  meta,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const { pagination, setPagination } = useSubjectTable();
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
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/70 z-50 flex flex-col backdrop-blur-sm">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center flex-row animate-pulse px-4 w-full h-14 even:bg-slate-50 dark:even:bg-slate-950"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-5 w-25 bg-slate-700 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        )}
        <AppDataTable table={table} columns={columns} isLoading={isLoading} />
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />
    </div>
  );
}
