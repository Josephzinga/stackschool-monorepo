'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
  ColumnVisibilityState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';
import { parseAsString, useQueryState } from 'nuqs';

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
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [searchTerm, setSearchTerm] = useQueryState(
    '',
    parseAsString.withDefault(''),
  );
  const [filters, setFilters] = useState<ParentFiltersState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});

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
    dialogOpen,
    setDialogOpen,
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

export const useParentTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
