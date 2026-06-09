import React from 'react';
interface SearchResultsListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    onSelect: (item: T) => void;
    className?: string;
    emptyMessage?: string;
}
export declare function SearchResultsList<T extends {
    id: string | null;
}>({ items, renderItem, onSelect, className, }: SearchResultsListProps<T>): React.JSX.Element | null;
export {};
//# sourceMappingURL=search-results-list.d.ts.map