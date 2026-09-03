import React, { useState } from 'react';
import { AppTableMeta } from '@/types/tanstack-table';
import DataTableSkeleton from '@/components/skeleton';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import {
  ColumnDef,
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  PaginationState,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoomForm } from '@/components/lists/room/form/room-form';
import { RoomData } from '@/components/lists/room/table/columns';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useDeleteRoomsMutation } from '@stackschool/ui';
import { toast } from '@/components/ui/toast';

const roomFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  tableMeta: {} as AppTableMeta<RoomData>,
});
export type RoomFeatures = typeof roomFeatures;

interface DataTableProps {
  columns: ColumnDef<RoomFeatures, RoomData>[];
  data: RoomData[];
  isLoading: boolean;
  meta?: { total: number; limit: number; totalPages: number };
}
export function RoomDataTable({
  columns,
  isLoading,
  data,
  meta,
}: DataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<NonNullable<RoomData>>();
  const selectedCount = 1;

  const { mutateAsync } = useDeleteRoomsMutation();

  const table = useTable({
    features: roomFeatures,
    columns,
    data,
    onPaginationChange: setPagination,
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

  const onDeleteConfirm = async (ids: string | string[]) => {
    const promise = mutateAsync({
      ids,
    });

    await toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        return data?.deleteRooms?.message || 'Suppression réussie avec succès.';
      },
      error: (err) => {
        return err?.errors?.message || 'Erreur lors de la suppression.';
      },
    });
  };

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

      <AppAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Voulez-vous vraiment supprimer ${selectedCount >= 1 ? selectedRow?.name : selectedCount}`}
        description="Cette action est irréversible il supprimera cette salle de l'etablissement"
        onConfirm={async () => await onDeleteConfirm(selectedRow?.id!)}
        cancelLabel="Annuler"
        confirmLabel="Supprimer"
      />
    </div>
  );
}
