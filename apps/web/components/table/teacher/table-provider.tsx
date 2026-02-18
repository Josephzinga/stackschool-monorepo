'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { OnChangeFn, PaginationState } from '@tanstack/react-table';
import { PaginationMeta, useUserStore } from '@stackschool/ui';

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  meta?: Omit<PaginationMeta, 'page'>;
  isLoading?: boolean;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const { currentSchool } = useUserStore();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const value = {
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
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
