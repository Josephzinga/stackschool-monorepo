'use client';

import {
  ColumnDef,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  OnChangeFn,
  PaginationState,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import AppDataTable from '@/components/table/app-data-table';
import { useClassTable } from '@/components/lists/class/table/table-provider';
import React, { useState } from 'react';
import { ClassData, columns } from '@/components/lists/class/table/columns';
import ClassDialog from '@/components/lists/class/table/class-dialog';
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
import { CreateClassSubjectForm } from '@/components/lists/class-subject/create-classSubject-form';
import { AppTableMeta } from '@/types/tanstack-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const classFeatures = tableFeatures({
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
export type ClassFeatures = typeof classFeatures;

interface DataTableProps {
  columns: ColumnDef<ClassFeatures, ClassData>[];
  data: ClassData[];
  isLoading: boolean;
  meta?: { total: number; limit: number; totalPages: number };
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
}

export function DataTable({
  data,
  isLoading,
  meta,
  pagination,
  setPagination,
}: DataTableProps) {
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

  const table = useTable({
    features: classFeatures,
    columns,
    data,
    onPaginationChange: setPagination,
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

      <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <span>
              {table.getFilteredSelectedRowModel().rows.length} sur{' '}
              {table.getFilteredRowModel().rows.length} ligne(s)
              sélectionnée(s).
            </span>
          ) : (
            <>
              <span>{table.getFilteredRowModel().rows.length} résultat(s)</span>
            </>
          )}
        </div>

        <div>{meta?.limit}</div>

        <div className="flex items-center gap-4 lg:gap-8 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium hidden sm:block">Lignes</p>
            <Select
              value={`${table.state?.pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.state?.pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.state.pagination.pageIndex + 1} / {table.getPageCount()}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <span className="sr-only">Précédent</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <span className="sr-only">Suivant</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

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
