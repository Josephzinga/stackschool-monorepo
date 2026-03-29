'use client';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect } from 'react';
import { useTable } from './table-provider';
import { useWindowSize } from 'react-use';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import { DataTableProps } from '@/types/tanstack-table';
import DataTableSkeleton from '@/components/skeleton';

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
  const renderTotalCount = () => (
    <div>
      <p className="opacity-80 font-sans ">
        Nombre total des élèves:{' '}
        <span className="text-primary font-sans font-semibold text-lg">
          {meta?.total}
        </span>{' '}
      </p>
    </div>
  );
  return (
    <div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <>
        <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
          {isLoading ? (
            <DataTableSkeleton />
          ) : (
            <AppDataTable
              table={table}
              columns={columns}
              isLoading={isLoading}
            />
          )}
        </div>
        <DataTablePagination
          table={table}
          isLoading={isLoading}
          renderTotalCount={renderTotalCount()}
        />
      </>
    </div>
  );
}
