'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { Spinner } from './ui/spinner';

export interface SearchInputProps extends React.ComponentProps<'input'> {
  onClear?: () => void;
  isLoading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, value, onChange, onClear, isLoading = false, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value && String(value).length > 0;

    return (
      <div
        className={cn(
          'relative flex items-center w-full transition-transform duration-300 ease-in-out',
          isFocused ? 'scale-[1.01]' : 'scale-100',
          className,
        )}
      >
        {/* Icône de recherche */}
        <div
          className={cn(
            'absolute left-4 transition-colors duration-300 z-10',
            isFocused ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <Search className="h-6 w-6" />
        </div>

        {/* Input principal */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'h-14 w-full rounded-full dark:shadow-gray-700/50 shadow-slate-300' +
              ' shadow-[2px_1px_4px_2px_rgba(0,0,0,0.1)]! bg-linear-to-br from-blue-100/80 to-blue-20' +
              ' dark:bg-linear-to-tl dark:from-gray-900 dark:to-gray-800 pl-14 pr-14 text-lg transition-all' +
              ' duration-300',
            'placeholder:text-muted-foreground/60',
            'focus:border-primary focus:outline-none',
            'hover:border-primary/30',
            isLoading ? 'border-primary/50' : 'border-muted',
            className,
          )}
          {...props}
        />

        {/* Animation de bordure pendant le chargement */}
        {isLoading && (
          <span className="absolute inset-0 rounded-full border-2 border-primary/30 " />
        )}

        {/* Spinner ou Bouton Clear */}
        <div className="absolute right-4 z-10">
          {isLoading ? (
            <Spinner className="h-5 w-5 text-primary" />
          ) : (
            hasValue &&
            onClear && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="h-5 w-5" />
              </button>
            )
          )}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
