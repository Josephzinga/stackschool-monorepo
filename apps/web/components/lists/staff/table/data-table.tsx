'use client';

import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import { PaginationMeta } from '@stackschool/ui';
import {
  ColumnDef,
  columnFilteringFeature,
  ColumnFiltersState,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  SortingState,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { StaffData } from './columns';
import { useStaffTable } from './table-provider';
import { AppTableMeta } from '@/types/tanstack-table';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffDialog } from '@/components/lists/staff/form/staff-dialog';

interface StaffDataTableProps {
  columns: ColumnDef<StaffFeatures, StaffData>[];
  data: StaffData[];
  isLoading: boolean;
  meta?: PaginationMeta;
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
  tableMeta: {} as AppTableMeta<StaffData>,
});

export type StaffFeatures = typeof features;

export function StaffDataTable({
  columns,
  data,
  isLoading,
  meta,
}: StaffDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowData, setRowData] = useState<StaffData>();
  const [isUpdate, setIsUpdate] = useState();
  const {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    dialogOpen,
    setDialogOpen,
  } = useStaffTable();

  useEffect(() => {
    setColumnVisibility((current) => ({
      ...current,
      salary: false,
      hireDate: false,
    }));
  }, [setColumnVisibility]);

  const table = useTable({
    features,
    columns,
    data,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getRowId: (row) => row.id,
    rowCount: meta?.total,
    manualPagination: true,
    meta: {
      openEdit: (data) => {
        setIsUpdate(true);
        setRowData(data);
        setDialogOpen(true);
      },
    },
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
  });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="relative min-h-75 overflow-x-auto rounded-md border">
        <AppDataTable
          table={table}
          isLoading={isLoading}
          columns={columns}
          emptyComponent={<StaffEmpty />}
        />
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />

      {dialogOpen && (
        <StaffDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultValues={isUpdate ? rowData : undefined}
        />
      )}
    </div>
  );
}

function StaffEmpty() {
  const { setDialogOpen } = useStaffTable();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserIcon />
        </EmptyMedia>
        <EmptyTitle>Aucun parent trouvé.</EmptyTitle>
        <EmptyDescription>
          Vous n'avez pas encore créé un membre du personnel.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button className="cursor-pointer" onClick={() => setDialogOpen(true)}>
          Crée un personnel.
        </Button>
        <Button variant="outline">Importer les données</Button>
      </EmptyContent>
    </Empty>
  );
}
