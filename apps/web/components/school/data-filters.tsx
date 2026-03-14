import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Settings2, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VisibilityState } from '@tanstack/react-table';

interface DataFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  onToggleColumn: (columnId: string, isVisible: boolean) => void;
  showFilters: boolean;
  hasActiveFilters: boolean;
  onShowFilterChange: (showFilters: boolean) => void;
  columnVisibility: VisibilityState;
  columns: Array<{ id: string; label: string }>;
}

export default function DataHeaderInput({
  search,
  onSearchChange,
  onToggleColumn,
  columnVisibility,
  columns,
  showFilters,
  hasActiveFilters,
  onShowFilterChange,
}: DataFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 lg:flex-initial">
      <div className="relative flex-1 lg:w-96">
        <Input
          placeholder="Rechercher un enseignant..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pr-8 w-full"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange('')}
            className="absolute h-7 w-7 top-1/2 -translate-y-1/2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Bouton Filtres */}
        <Button
          variant={showFilters || hasActiveFilters ? 'secondary' : 'outline'}
          onClick={() => onShowFilterChange(!showFilters)}
          className="gap-1.5 sm:gap-2 flex-1 h-10 sm:flex-initial"
        >
          <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="sm:hidden">Filtres</span>
          <span className="hidden sm:inline">Filtres</span>
          {hasActiveFilters && (
            <span className="ml-0.5 sm:ml-1 rounded-full bg-primary w-1.5 h-1.5 sm:w-2 sm:h-2" />
          )}
        </Button>

        {/* Bouton Affichage */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-1.5 sm:gap-2 h-10 flex-1 sm:flex-initial"
            >
              <Settings2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sm:hidden">Colonnes</span>
              <span className="hidden sm:inline">Affichage</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 sm:w-56">
            <DropdownMenuLabel className="text-xs sm:text-sm">
              Colonnes visibles
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={columnVisibility[col.id] !== false}
                  onCheckedChange={(checked) => onToggleColumn(col.id, checked)}
                  className="text-xs sm:text-sm"
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
