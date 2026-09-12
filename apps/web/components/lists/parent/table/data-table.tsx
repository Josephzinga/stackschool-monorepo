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
import { ParentEmpty } from '@/components/lists/parent/table/table-empty';
import { ParentDialog } from '@/components/lists/parent/form/parent-dialog';
import { ParentStudentDialog } from '../form/parent-student-dialog';
import { RelationTypeEnum } from '@stackschool/contracts';
import { useQueryClient } from '@tanstack/react-query';

export interface ParentTableMeta extends AppTableMeta<ParentData> {
  onAssignStudent: (data: ParentData) => void;
}

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  tableMeta: {} as ParentTableMeta,
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
    isUpdate,
    setIsUpdate,
  } = useParentTable();

  const { width } = useWindowSize();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [rowData, setRowData] = useState<ParentData | null>(null);
  const [openAssignment, setOpenAssignment] = useState(false);
  const queryClient = useQueryClient();

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
      openEdit: (data) => {
        setRowData(data);
        setIsUpdate(true);
        setDialogOpen(true);
      },
      onAssignStudent: (data) => {
        setRowData(data);
        setOpenAssignment(true);
      },
    },
    state: {
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  const handleSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['GetSchoolParents'] });
  };

  const handleDelete = async () => {
    // Sera implémenté avec la mutation correspondante
    toast.add({
      title: 'La suppression des parents sera bientôt disponible',
    });
    setShowDeleteAlert(false);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
  };
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

      {showDeleteAlert && (
        <AppAlertDialog
          open={showDeleteAlert}
          onOpenChange={setShowDeleteAlert}
          title="Supprimer ce parent ?"
          description="Cette action est irréversible. Les liens avec les élèves seront également supprimés."
          onConfirm={handleDelete}
          confirmLabel="Supprimer"
          variant="destructive"
        />
      )}

      {dialogOpen && (
        <ParentDialog
          onSuccess={handleSuccess}
          open={dialogOpen}
          onConfirm={handleConfirm}
          onOpenChange={setDialogOpen}
          defaultValues={isUpdate ? rowData : null}
        />
      )}
      {openAssignment && rowData && (
        <ParentStudentDialog
          open={openAssignment}
          parentId={rowData.id}
          defaultValues={rowData.students?.map((s) => ({
            parentId: rowData.id,
            studentId: s.id,
            relationType: s.relationType as RelationTypeEnum,
            firstName: s.firstName,
            lastName: s.lastName,
            class: {
              name: s.classe.name,
            },
          }))}
          onOpenChange={setOpenAssignment}
        />
      )}
    </div>
  );
}
