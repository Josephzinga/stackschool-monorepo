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
import { DataTablePagination } from '@/components/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { useClassTable } from '@/components/school/class/table/table-provider';
import { useState } from 'react';
import { ClassData } from '@/components/school/class/table/columns';
import ClassDialog from '@/components/school/class/table/class-dialog';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useDeleteClassesMutation, useUserStore } from '@stackschool/ui';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import DataTableSkeleton from '@/components/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateClassSubjectForm } from '@/components/school/class-subject/create-classSubject-form';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<NonNullable<ClassData>>();
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
    meta: {
      openEdit: (data) => {
        setSelectedRow(data);
        setEditDialogOpen(true);
      },
      openDelete: (data) => {
        setSelectedRow(data);
        setDeleteDialogOpen(true);
      },
      openAdd: (data1) => {
        setSelectedRow(data1);
        setAddOpen(true);
      },
    },
    state: {
      columnVisibility,
      pagination,
      rowSelection,
    },
  });
  const queryClient = useQueryClient();

  const { mutateAsync } = useDeleteClassesMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolClasses'] });
    },
  });

  const { currentSchool } = useUserStore();

  const handleDelete = async () => {
    if (!selectedRow?.id) return;
    const promise = mutateAsync({
      classIds: selectedRow?.id,
      schoolId: currentSchool?.id!,
    });
    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        if (data.deleteClasses?.ok) {
          return data.deleteClasses.message || 'Suppression réussi avec succès';
        }
        throw new Error(
          data.deleteClasses?.message || 'Erreur lors de la suppression',
        );
      },
      error: (err) => {
        return err?.message;
      },
      toasterId: 'dashboard',
    });
    setDeleteDialogOpen(false);
  };
  return (
    <div className="space-y-4">
      <div className="rounded-md border relative min-h-75">
        {isLoading && <DataTableSkeleton />}
        <AppDataTable table={table} columns={columns} isLoading={isLoading} />
      </div>

      <DataTablePagination table={table} isLoading={isLoading} />

      {editDialogOpen && (
        <ClassDialog
          initialValues={selectedRow}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}

      {deleteDialogOpen && (
        <AppAlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          description="Cette action vas supprimer cette classe et tous le donnée correspondente"
          title="Etes vous sur de cette action ?"
        />
      )}

      {addOpen && (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>

            <CreateClassSubjectForm classId={selectedRow?.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
