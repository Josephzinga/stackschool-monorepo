import * as React from 'react';
export interface SearchInputProps extends React.ComponentProps<'input'> {
    onClear?: () => void;
    isLoading?: boolean;
}
declare const SearchInput: React.ForwardRefExoticComponent<Omit<SearchInputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export { SearchInput };
//# sourceMappingURL=search-input.d.ts.map