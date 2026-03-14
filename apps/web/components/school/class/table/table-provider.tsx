'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';
import { useWindowSize } from 'react-use';

export interface ClassFiltersState {
  section?: string;
  level?: string;
}

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: ClassFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<ClassFiltersState>>;
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
  const [filters, setFilters] = useState<ClassFiltersState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { width } = useWindowSize();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
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

  useEffect(() => {}, []);

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export const useClassTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
