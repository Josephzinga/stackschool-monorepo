import { ReactNode } from 'react';
import { OnChangeFn, PaginationState, RowSelectionState, VisibilityState } from '@tanstack/react-table';
import { PaginationMeta, StudentSortInput } from '@stackschool/ui';
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
export declare function TableProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useTable: () => TableContextType;
export {};
//# sourceMappingURL=table-provider.d.ts.map