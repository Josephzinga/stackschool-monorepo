'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import {
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  ColumnVisibilityState,
} from '@tanstack/react-table';
import { PaginationMeta, useDeleteSubjectsMutation } from '@stackschool/ui';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { sortPageObjects } from 'next/dist/shared/lib/router/utils/sortable-routes';

interface SubjectFilterState {
  classId?: string;
  teacherId?: string;
}

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: SubjectFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SubjectFilterState>>;

  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;

  // Nouvel état pour la visibilité des colonnes
  columnVisibility: ColumnVisibilityState;
  setColumnVisibility: OnChangeFn<ColumnVisibilityState>;

  meta?: Omit<PaginationMeta, 'page'>;
  isLoading?: boolean;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: OnChangeFn<boolean>;
  handleDelete: (subjectIds: string[] | string) => Promise<void>;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function SubjectTableProvider({ children }: { children: ReactNode }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SubjectFilterState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({
      info: true,
      select: true,
      phoneNumber: true,
      classes: true,
      speciality: true,
    });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useDeleteSubjectsMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['GetSchoolSubjects'],
      });
    },
    onSettled: () => {
      setOpenDeleteDialog(false);
    },
  });

  const handleDelete = async (subjectIds: string[] | string) => {
    const promise = mutateAsync({
      input: {
        subjectIds: subjectIds,
        soft: false,
      },
    });

    toast.promise(promise, {
      loading: 'Suppression en cours...',
      success: (data) => {
        if (data?.deleteSubjects?.ok) {
          return (
            data.deleteSubjects?.message || 'Matière supprimer avec succès'
          );
        } else {
          throw new Error(
            data?.deleteSubjects?.message ||
              'Erreur lors de la suppression de la matière',
          );
        }
      },
      error: (err: any) => {
        return err?.message;
      },
      toasterId: 'dashboard',
    });
    setOpenDeleteDialog(false);
  };

  const value = {
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    handleDelete,
    setOpenDeleteDialog,
    openDeleteDialog,
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export const useSubjectTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a SubjectTableProvider');
  }
  return context;
};
