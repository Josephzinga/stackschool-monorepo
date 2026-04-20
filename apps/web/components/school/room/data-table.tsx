import React, { useState } from 'react';
import { DataTableProps } from '@/types/tanstack-table';
import DataTableSkeleton from '@/components/skeleton';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoomForm } from '@/components/school/room/room-form';
import { RoomColumns } from '@/components/school/room/columns';

export function RoomDataTable<TData, TValue>({
  columns,
  isLoading,
  data,
  meta,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<NonNullable<RoomColumns>>();
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row: any) => row.id,
    rowCount: meta?.total,
    state: {
      pagination,
    },
    meta: {
      openEdit: (data) => {
        setSelectedRow(data);
        setEditDialogOpen(true);
      },
      openDelete: (data) => {
        setSelectedRow(data);
        setDeleteDialogOpen(true);
      },
    },
  });

  const initialValues: any = {
    ...selectedRow,
    defaultClassId: selectedRow?.defaultForClass?.id,
  };
  return (
    <div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
        {isLoading ? (
          <DataTableSkeleton />
        ) : (
          <AppDataTable table={table} columns={columns} />
        )}
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier cette salle</DialogTitle>
          </DialogHeader>
          <RoomForm
            initialValues={initialValues}
            onSucces={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
