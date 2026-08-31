'use client';
import {
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
} from '@tanstack/react-table';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import * as React from 'react';
import { useSubjectTable } from '@/components/lists/subject/table/table-provider';
import { AppDataTableProps, AppTableMeta } from '@/types/tanstack-table';
import { SubjectColumns } from './columns';
import { useDeleteSubjectsMutation } from '@stackschool/ui';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import DataTableSkeleton from '@/components/skeleton';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import SubjectForm from '../subject-form';
import { CreateSubjectForm, SubjectCategory } from '@stackschool/contracts';
import { toast } from 'sonner';

export interface SubjectTableMeta extends AppTableMeta<SubjectColumns> {}

const subjectFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  tableMeta: {} as SubjectTableMeta,
});
export type SubjectFeatures = typeof subjectFeatures;

export function SubjectDataTable({
  columns,
  data,
  meta,
  isLoading,
}: AppDataTableProps<SubjectFeatures, SubjectColumns>) {
  const {
    pagination,
    setPagination,
    handleDelete,
    setOpenDeleteDialog,
    openDeleteDialog,
  } = useSubjectTable();
  const [selectedCount, setSelectedCount] = React.useState(0);
  const [subjectIds, setSubjectIds] = React.useState<string[] | string>([]);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editData, setEditData] = React.useState<CreateSubjectForm>();
  const table = useTable({
    features: subjectFeatures,
    columns,
    data,
    onPaginationChange: setPagination,
    getRowId: (row: any) => row.id,
    rowCount: meta?.total,
    manualPagination: true,
    meta: {
      openDelete: (data) => {
        setSubjectIds(data.id);
        setSelectedCount(1);
        setOpenDeleteDialog(true);
      },
      openEdit: (data) => {
        setEditData({
          ...data,
          code: '',
          category: data.category as SubjectCategory,
        });
        setOpenEditDialog(true);
      },
    },
    state: {
      pagination,
    },
  });
  return (
    <div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
        {isLoading && <DataTableSkeleton />}
        <AppDataTable table={table} columns={columns} isLoading={isLoading} />
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />

      {openDeleteDialog && (
        <AppAlertDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          isLoading={false}
          title={` Supprimer ${selectedCount} enseignant ${selectedCount > 1 ? 's' : ''} ?`}
          description="Cette action est irréversible. Les données associées (cours, notes) seront également supprimées."
          onConfirm={async () => {
            await handleDelete(subjectIds);
          }}
          cancelLabel="Annuler"
          confirmLabel="Supprimer"
        />
      )}

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la matière</DialogTitle>
          </DialogHeader>

          <SubjectForm initialValues={editData} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
