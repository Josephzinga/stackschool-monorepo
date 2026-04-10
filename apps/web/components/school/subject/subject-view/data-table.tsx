'use client';

import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';

import { DataTableProps } from '@/types/tanstack-table';
import { SubjectColumns } from './columns';
import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateClassSubjectForm } from '@/components/school/create-classSubject-form';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteClassSubjectsMutation } from '@stackschool/ui';
import { toast } from 'sonner';

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [selectedRow, setSelectedRow] = useState<SubjectColumns>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row: any) => row.id,
    state: {
      pagination,
    },
    meta: {
      openEdit: (data: SubjectColumns) => {
        setSelectedRow(data);
        setIsEditDialogOpen(true);
      },
      openDelete: (data: SubjectColumns) => {
        setSelectedRow(data);
        setIsDeleteDialogOpen(true);
      },
    },
  });
  const queryClient = useQueryClient();

  const { mutateAsync } = useDeleteClassSubjectsMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['GetClassSubjectTable'],
      });
      await queryClient.invalidateQueries({ queryKey: ['GetClassDetails'] });
    },
  });
  const handleDelete = async () => {
    const promise = mutateAsync({
      ids: selectedRow?.id!,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        return (
          data?.deleteClassSubjects?.message || 'Suppression reussi avec succès'
        );
      },
      error: 'Erreur lors de la suppression',
      toasterId: 'dashboard',
    });
    setIsDeleteDialogOpen(false);
  };
  return (
    <div>
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
      <DataTablePagination table={table} />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la matière</DialogTitle>
          </DialogHeader>
          <CreateClassSubjectForm
            initialValues={selectedRow ?? undefined}
            onSuccess={() => {
              setIsEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <AppAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        descriptionClassName="text-[14px]!"
        title={'Êtes-vous absolument sûr ?'}
        description="Cette action est irréversible. Elle supprimera définitivement cette matière dans cette classe et tous les leçons associé."
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        variant="destructive"
      />
    </div>
  );
}
