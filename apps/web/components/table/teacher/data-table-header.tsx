'use client';

import { Input } from '@/components/ui/input';
import { useTable } from './table-provider';
import { Button } from '@/components/ui/button';
import { Filter, Search, X } from 'lucide-react';
import { useState } from 'react';
import { TeacherFilters } from './teacher-filters';
import { TeacherDialog } from './teacher-dialog';
import { useDashboard } from '@/components/providers/dashboard-provider';

export function DataTableHeader() {
  const { searchTerm, setSearchTerm, filters } = useTable();
  const [showFilters, setShowFilters] = useState(false);
  const { me } = useDashboard();

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="flex flex-col gap-4 font-poppins font-medium">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Input
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-full pr-8"
              icon={Search}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm('')}
                className="absolute h-8 w-8 top-1/2 -translate-y-1/2 right-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant={showFilters || hasActiveFilters ? 'secondary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary w-2 h-2" />
            )}
          </Button>
        </div>
        {me?.schoolContext?.role === 'ADMIN' && <TeacherDialog />}
      </div>

      {showFilters && <TeacherFilters />}
    </div>
  );
}
