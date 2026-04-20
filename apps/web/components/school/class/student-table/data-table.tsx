'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { useState } from 'react';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import DataTableSkeleton from '@/components/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClassStudentTable } from '@/components/school/class/student-table/columns';
import { CreateStudentForm } from '@/components/school/student/form/create-student-form';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  meta?: { total: number; limit: number; totalPages: number };
  classId?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  meta,
  classId,
}: DataTableProps<TData, TValue>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<NonNullable<ClassStudentTable>>();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
  });
  const queryClient = useQueryClient();

  const handleDelete = async () => {};
  return (
    <div className="space-y-4">
      <div className="rounded-md border relative min-h-75">
        {isLoading && <DataTableSkeleton />}
        <AppDataTable table={table} columns={columns} isLoading={isLoading} />
      </div>

      <DataTablePagination table={table} isLoading={isLoading} />

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

            <CreateStudentForm
              initialValues={{
                schoolClass: { id: classId },
                id: selectedRow?.id!,
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
