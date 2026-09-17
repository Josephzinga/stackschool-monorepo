'use client';
import {
  type ColumnDef,
  columnFilteringFeature,
  type ColumnFiltersState,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTeacherTable } from './table-provider';
import { PaginationMeta } from '@stackschool/ui';
import { useWindowSize } from 'react-use';
import { DataTablePagination } from '@/components/table/data-table-pagination';
import AppDataTable from '@/components/table/app-data-table';
import { AppTableMeta } from '@/types/tanstack-table';
import { TeachersData } from '@/components/lists/teacher/table/columns';
import { TeacherAssignmentForm } from '@/components/lists/teacher/form/assignment-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { TeacherDialog } from '@/components/lists/teacher/table/teacher-dialog';

interface DataTableProps {
  columns: ColumnDef<TeacherFeatures, TeachersData>[];
  data: TeachersData[];
  isLoading: boolean;
  meta?: Omit<PaginationMeta, 'page'>;
}

export interface TeacherMeta extends AppTableMeta<TeachersData> {
  onAddAssignment: (data: TeachersData) => void;
}
const teacherFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  tableMeta: {} as TeacherMeta,
});

export type TeacherFeatures = typeof teacherFeatures;

export function DataTable({ columns, data, isLoading, meta }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState<TeachersData>();

  const {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    setDialogOpen,
    dialogOpen,
  } = useTeacherTable();

  const { width } = useWindowSize();

  useEffect(() => {
    if (width < 640) {
      setColumnVisibility({
        phoneNumber: false,
        classes: false,
        specialization: false,
        status: false,
      });
    } else if (width < 1200) {
      setColumnVisibility({
        select: true,
        phoneNumber: false,
        classes: false,
        specialization: true,
        status: false,
      });
    } else if (width < 1500) {
      setColumnVisibility({
        phoneNumber: true,
        status: true,
        classes: true,
      });
    } else {
      setColumnVisibility({});
    }
  }, [width, setColumnVisibility]);

  const table = useTable({
    features: teacherFeatures,
    columns,
    data,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row: any) => row.id,
    rowCount: meta?.total,
    manualPagination: true,
    meta: {
      onAddAssignment: (data) => {
        setAssignmentData(data);
        setAssignmentOpen(true);
      },
    } as TeacherMeta,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  return (
    <div className="w-full h-full font-poppins flex flex-col gap-4">
      <div className="rounded-md border relative min-h-75 overflow-x-auto">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/70 z-50 flex flex-col backdrop-blur-sm">
            {Array.from({ length: 5 }).map((_, i) => (
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

        <AppDataTable
          table={table}
          isLoading={isLoading}
          columns={columns}
          emptyComponent={<TeacherEmpty />}
        />
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />

      {/* Dialog d'ajout d'enseignant */}
      {dialogOpen && (
        <TeacherDialog open={dialogOpen} setOpen={setDialogOpen} />
      )}

      {/* Dialog d'assignation aux classes */}
      {assignmentOpen && (
        <Dialog
          open={assignmentOpen}
          onOpenChange={setAssignmentOpen}
          modal={false}
        >
          <DialogContent className="sm:max-w-lg rounded-xl!">
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>Ajouter un enseignant à la classe</DialogTitle>
              </DialogHeader>

              <TeacherAssignmentForm
                initialValues={{ teacherId: assignmentData?.id }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function TeacherEmpty() {
  const { setDialogOpen } = useTeacherTable();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserIcon />
        </EmptyMedia>
        <EmptyTitle>Aucun enseignant trouvé.</EmptyTitle>
        <EmptyDescription>
          Vous n'avez pas encore créé un enseignant.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button className="cursor-pointer" onClick={() => setDialogOpen(true)}>
          Cree un enseignant
        </Button>
        <Button variant="outline">Importer les données</Button>
      </EmptyContent>
    </Empty>
  );
}
