'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
  ColumnVisibilityState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';
import { useQueryState } from 'nuqs';

interface RoomFilterState {
  type?: string;
}

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: RoomFilterState;
  setFilters: React.Dispatch<React.SetStateAction<RoomFilterState>>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
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
  const [searchTerm, setSearchTerm] = useQueryState('search', {
    defaultValue: '',
  });
  const [filters, setFilters] = useState<RoomFilterState>({});
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

export const useRoomTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
