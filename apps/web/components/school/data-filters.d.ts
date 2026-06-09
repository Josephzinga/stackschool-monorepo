import React from 'react';
import { VisibilityState } from '@tanstack/react-table';
interface DataFiltersProps {
    search?: string;
    onSearchChange?: (search: string) => void;
    onToggleColumn?: (columnId: string, isVisible: boolean) => void;
    showFilters?: boolean;
    hasActiveFilters?: boolean;
    onShowFilterChange?: (showFilters: boolean) => void;
    columnVisibility?: VisibilityState;
    columns?: Array<{
        id: string;
        label: string;
    }>;
    inputPlaceholder?: string;
}
export default function DataHeaderInput({ search, onSearchChange, inputPlaceholder, onToggleColumn, columnVisibility, columns, showFilters, hasActiveFilters, onShowFilterChange, }: DataFiltersProps): React.JSX.Element;
export {};
//# sourceMappingURL=data-filters.d.ts.map