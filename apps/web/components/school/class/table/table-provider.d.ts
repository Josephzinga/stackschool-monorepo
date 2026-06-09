import { ReactNode } from 'react';
import { OnChangeFn, PaginationState, RowSelectionState, VisibilityState } from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';
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
export declare function TableProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useClassTable: () => TableContextType;
export {};
//# sourceMappingURL=table-provider.d.ts.map