'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { OnChangeFn, PaginationState, RowSelectionState, VisibilityState } from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';

interface ParentFiltersState {
  searchTerm?: string;
  profession?: string;
}

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: ParentFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<ParentFiltersState>>;
  
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;

  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  
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
  const [filters, setFilters] = useState<ParentFiltersState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
