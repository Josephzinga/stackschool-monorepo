'use client';
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect } from 'react';
import { useStudentTable } from './table-provider';
import { useWindowSize } from 'react-use';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import { AppDataTableProps, AppTableMeta } from '@/types/tanstack-table';
import DataTableSkeleton from '@/components/skeleton';
import { ClassData } from '@/components/lists/class/table/columns';
import { StudentsData } from '@/components/lists/student/table/columns';

const studentFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  tableMeta: metaHelper<AppTableMeta<ClassData>>(),
});
export type StudentFeatures = typeof studentFeatures;
export function DataTable({
  columns,
  data,
  isLoading,
  meta,
}: AppDataTableProps<StudentFeatures, StudentsData>) {
  const {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
  } = useStudentTable();

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

  const table = useTable({
    features: studentFeatures,
    columns,
    data,
    onPaginationChange: setPagination,
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
