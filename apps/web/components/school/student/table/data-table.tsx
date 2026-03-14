'use client';
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect } from 'react';
import { useTable } from './table-provider';
import { PaginationMeta } from '@stackschool/ui';
import { useWindowSize } from 'react-use';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  meta?: Omit<PaginationMeta, 'page'>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  meta,
}: DataTableProps<TData, TValue>) {
  const {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
  } = useTable();

  const { width } = useWindowSize();

  useEffect(() => {
    if (width < 540) {
      setColumnVisibility({
        section: false,
        enrollmentYear: false,
        level: false,
        className: false,
        matricule: false,
        select: false,
        status: false,
      });
    } else if (width < 1024) {
      setColumnVisibility({
        select: true,
        section: false,
        enrollmentYear: false,
        level: false,
        matricule: false,
        status: true,
      });
    } else if (width < 1400) {
      setColumnVisibility({
        select: true,
        section: false,
        matricule: true,
        status: true,
        enrollmentYear: false,
        level: false,
      });
    } else {
      setColumnVisibility({});
    }
  }, [width, setColumnVisibility]);

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
