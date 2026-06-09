import { ReactNode } from 'react';
import { OnChangeFn, PaginationState, RowSelectionState, VisibilityState } from '@tanstack/react-table';
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