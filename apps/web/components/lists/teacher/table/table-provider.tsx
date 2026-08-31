'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import {
  ColumnVisibilityState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';

export interface TeacherFiltersState {
  classId?: string;
  subjectId?: string;
  isActive?: boolean;
  isSupervisor?: boolean;
}

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: TeacherFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<TeacherFiltersState>>;

  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;

  // Nouvel état pour la visibilité des colonnes
  columnVisibility: ColumnVisibilityState;
  setColumnVisibility: OnChangeFn<ColumnVisibilityState>;

  meta?: Omit<PaginationMeta, 'page'>;
  isLoading?: boolean;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TeacherFiltersState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({
      info: true,
      select: true,
      phoneNumber: true,
      classes: true,
      speciality: true,
    });

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
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export const useTeacherTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
