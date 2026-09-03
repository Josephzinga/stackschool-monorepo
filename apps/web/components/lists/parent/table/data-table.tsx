'use client';

import {
  type ColumnDef,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useParentTable } from './table-provider';
import { PaginationMeta } from '@stackschool/ui';
import { useWindowSize } from 'react-use';
import { DataTablePagination } from '@/components/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { ParentData } from '@/components/lists/parent/table/column';
import { AppTableMeta } from '@/types/tanstack-table';
import { toast } from '@/components/ui/toast';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { ParentEmpty } from '@/components/lists/class/table/table-empty';
import { ParentDialog } from '@/components/lists/parent/parent-dialog';

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  tableMeta: {} as AppTableMeta<ParentData>,
});

export type ParentFeatures = typeof features;

interface DataTableProps {
  columns: ColumnDef<ParentFeatures, ParentData>[];
  data: ParentData[];
  isLoading: boolean;
  meta?: Omit<PaginationMeta, 'page'>;
}

export function DataTable({ columns, data, isLoading, meta }: DataTableProps) {
  const {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    dialogOpen,
    setDialogOpen,
  } = useParentTable();

  const { width } = useWindowSize();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDelete = async () => {
    // Sera implémenté avec la mutation correspondante
    toast.add({
      title: 'La suppression des parents sera bientôt disponible',
    });
    setShowDeleteAlert(false);
  };
  useEffect(() => {
    if (width < 640) {
      setColumnVisibility({
        select: false,
        phoneNumber: false,
        address: false,
        profession: false,
        students: false,
      });
    } else if (width < 1024) {
      setColumnVisibility({
        select: true,
        phoneNumber: false,
        address: false,
        profession: true,
        students: true,
      });
    } else {
      setColumnVisibility({});
    }
  }, [width, setColumnVisibility]);

  const table = useTable({
    features,
    columns,
    data,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row.id,
    rowCount: meta?.total,
    manualPagination: true,
    meta: {
      openDelete: (data) => {
        setShowDeleteAlert(true);
      },
    },
    state: {
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  return (
    <div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md border relative min-h-75 overflow-x-auto">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        )}

        <AppDataTable
          table={table}
          isLoading={isLoading}
          columns={columns}
          emptyComponent={<ParentEmpty />}
        />
      </div>

      <DataTablePagination table={table} isLoading={isLoading} />

      <AppAlertDialog
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        title="Supprimer ce parent ?"
        description="Cette action est irréversible. Les liens avec les élèves seront également supprimés."
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        variant="destructive"
      />

      {dialogOpen && (
        <ParentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  );
}
