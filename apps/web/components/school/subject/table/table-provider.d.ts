import { ReactNode } from 'react';
import { OnChangeFn, PaginationState, RowSelectionState, VisibilityState } from '@tanstack/react-table';
import { PaginationMeta } from '@stackschool/ui';
interface SubjectFilterState {
    classId?: string;
    teacherId?: string;
}
interface TableContextType {
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filters: SubjectFilterState;
    setFilters: React.Dispatch<React.SetStateAction<SubjectFilterState>>;
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState>;
    columnVisibility: VisibilityState;
    setColumnVisibility: OnChangeFn<VisibilityState>;
    meta?: Omit<PaginationMeta, 'page'>;
    isLoading?: boolean;
}
export declare function SubjectTableProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useSubjectTable: () => TableContextType;
export {};
//# sourceMappingURL=table-provider.d.ts.map