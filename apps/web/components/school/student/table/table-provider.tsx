'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import {
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';
import { PaginationMeta, StudentSortInput } from '@stackschool/ui';
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'nuqs';

export interface StudentFilterState {
  classId?: string;
  level?: string;
  isActive?: boolean;
  section?: string;
  sort?: StudentSortInput;
}

interface TableContextType {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filters: StudentFilterState;
  setFilters: (updates: Partial<StudentFilterState>) => void;
  clearFilters: () => void;

  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;

  meta?: Omit<PaginationMeta, 'page'>;
  isLoading?: boolean;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsInteger.withDefault(0),
      pageSize: parseAsInteger.withDefault(10),
    },
    {
      history: 'push',
    },
  );
  const [searchTerm, setSearchTerm] = useQueryState(
    'student_search',
    parseAsString.withDefault(''),
  );

  const [classId, setClassId] = useQueryState('classId', { defaultValue: '' });
  const [level, setLevel] = useQueryState('level', { defaultValue: '' });
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    info: true,
    select: true,
    phoneNumber: true,
    classes: true,
    speciality: true,
  });

  const filters = {
    classId,
    level,
  };
  const setFilters = async (updates: Partial<StudentFilterState>) => {
    if ('classId' in updates) await setClassId(updates.classId ?? null);
    if ('level' in updates) await setLevel(updates.level ?? null);
  };

  const clearFilters = async () => {
    await setClassId('');
    await setLevel('');
  };

  const value = {
    pagination,
    setPagination,
    searchTerm,
    setSearchTerm,
    filters,
    clearFilters,
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
