'use client';

import { PaginationMeta } from '@stackschool/ui';
import {
  ColumnVisibilityState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table';
import { createContext, ReactNode, useContext, useState } from 'react';

interface StaffTableContextValue {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  columnVisibility: ColumnVisibilityState;
  setColumnVisibility: OnChangeFn<ColumnVisibilityState>;
  meta?: Omit<PaginationMeta, 'page'>;
  isLoading?: boolean;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

const StaffTableContext = createContext<StaffTableContextValue | undefined>(
  undefined,
);

export function StaffTableProvider({ children }: { children: ReactNode }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <StaffTableContext.Provider
      value={{
        pagination,
        setPagination,
        searchTerm,
        setSearchTerm,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        dialogOpen,
        setDialogOpen,
      }}
    >
      {children}
    </StaffTableContext.Provider>
  );
}

export function useStaffTable() {
  const context = useContext(StaffTableContext);
  if (!context) {
    throw new Error('useStaffTable must be used within a StaffTableProvider');
  }
  return context;
}
