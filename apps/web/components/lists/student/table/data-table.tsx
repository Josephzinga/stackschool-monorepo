'use client';
import {
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
import { useStudentTable } from './table-provider';
import { useWindowSize } from 'react-use';
import AppDataTable from '@/components/table/app-data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import { AppDataTableProps, AppTableMeta } from '@/types/tanstack-table';
import DataTableSkeleton from '@/components/skeleton';
import { StudentsData } from '@/components/lists/student/table/columns';
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
import { StudentDialog } from './student-dialog';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useDeleteStudentsMutation } from '@stackschool/ui';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseAxiosError } from '@stackschool/contracts';

const studentFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  tableMeta: {} as AppTableMeta<StudentsData>,
});
export type StudentFeatures = typeof studentFeatures;
export function DataTable({
  columns,
  data,
  isLoading,
  meta,
}: AppDataTableProps<StudentFeatures, StudentsData>) {
  const {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
  } = useStudentTable();

  const [rowData, setRowData] = useState<StudentsData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    if (width < 540) {
      setColumnVisibility({
        section: false,
        enrollmentYear: false,
        level: false,
        className: false,
        matricule: false,
        select: false,
        status: false,
      });
    } else if (width < 1024) {
      setColumnVisibility({
        select: true,
        section: false,
        enrollmentYear: false,
        level: false,
        matricule: false,
        status: true,
      });
    } else if (width < 1400) {
      setColumnVisibility({
        select: true,
        section: false,
        matricule: true,
        status: true,
        enrollmentYear: false,
        level: false,
      });
    } else {
      setColumnVisibility({});
    }
  }, [width, setColumnVisibility]);

  const table = useTable({
    features: studentFeatures,
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
        setRowData(data);
        setOpenDialog(true);
      },
      openDelete: (data) => {
        setRowData(data);
        setOpenDeleteDialog(true);
      },
    },
    state: {
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useDeleteStudentsMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['GetSchoolStudents'] });
    },
  });

  const handleDelete = async () => {
    const promise = mutateAsync({
      studentIds: rowData?.id,
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        return data.deleteStudents?.ok
          ? data.deleteStudents?.message || 'Eleve supprimé avec succès'
          : 'Erreur lors de la suppression';
      },
      error: (error) => {
        const { message } = parseAxiosError(error);
        return message || 'Erreur lors de la suppression';
      },
      toasterId: 'dashboard',
    });
  };
  const renderTotalCount = () => (
    <div>
      <p className="opacity-80 font-sans ">
        Nombre total des élèves:{' '}
        <span className="text-primary font-sans font-semibold text-lg">
          {meta?.total}
        </span>{' '}
      </p>
    </div>
  );
  return (
    <div className="w-full h-full font-poppins z-10 flex flex-col gap-4">
      <>
        <div className="rounded-md mb-2 border relative min-h-75 overflow-x-auto">
          {isLoading ? (
            <DataTableSkeleton />
          ) : (
            <AppDataTable
              table={table}
              columns={columns}
              isLoading={isLoading}
              emptyComponent={<StudentEmpty setDialogOpen={setOpenDialog} />}
            />
          )}
        </div>
        <DataTablePagination
          table={table}
          isLoading={isLoading}
          renderTotalCount={renderTotalCount()}
        />
      </>

      {openDialog && (
        <StudentDialog
          open={openDialog}
          setOpen={setOpenDialog}
          defaultValues={rowData}
        />
      )}
      {openDeleteDialog && (
        <AppAlertDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title={'Êtes-vous absolument sûr ?'}
          description="Cette action est irréversible. Elle supprimera définitivement cet élève et toutes les données associées de l'école."
          onConfirm={handleDelete}
          isLoading={isPending}
          confirmLabel="Supprimer"
          variant="destructive"
        />
      )}
    </div>
  );
}
export function StudentEmpty({
  setDialogOpen,
}: {
  setDialogOpen: (open: boolean) => void;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserIcon />
        </EmptyMedia>
        <EmptyTitle>Aucun élève trouvé.</EmptyTitle>
        <EmptyDescription>
          Vous n'avez pas encore créé un élève.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button className="cursor-pointer" onClick={() => setDialogOpen(true)}>
          Cree un élève
        </Button>
        <Button variant="outline">Importer les données</Button>
      </EmptyContent>
    </Empty>
  );
}
