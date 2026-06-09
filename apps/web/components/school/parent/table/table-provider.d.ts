import { ReactNode } from 'react';
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
export declare function TableProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useTable: () => TableContextType;
export {};
//# sourceMappingURL=table-provider.d.ts.map