'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import {
  OnChangeFn,
  PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';

interface TeacherFiltersState {
  classId?: string;
  specialization?: string;
  isActive?: boolean;
  isSupervisor?: boolean;
}

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: TeacherFiltersState;
  setFilters: OnChangeFn<TeacherFiltersState>;
  meta?: Omit<PaginationMeta, 'page'>;
  isLoading?: boolean;
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TeacherFiltersState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const value = {
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sorting,
    setSorting,
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
