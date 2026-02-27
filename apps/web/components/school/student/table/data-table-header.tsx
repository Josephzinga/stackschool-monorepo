import { Button } from '@/components/ui/button';
import { Filter, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { useState } from 'react';
import { useTable } from '@/components/school/student/table/table-provider';
import { DeleteSelectedCount } from '@/components/school/delete-selected-count';
import { useUserStore } from '@stackschool/ui';
import StudentFilter from '@/components/school/student/table/table-filter';
import { StudentDialog } from '@/components/school/student/table/student-dialog';

export function DataTableHeader() {
  const {
    rowSelection,
    searchTerm,
    filters,
    setSearchTerm,
    columnVisibility,
    setColumnVisibility,
    setRowSelection,
  } = useTable();
  const { currentSchool } = useUserStore();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);
  const selectedCount = Object.values(rowSelection).length;

  const toggleColumns = (columnId: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };
  return (
    <div className="flex flex-col gap-4 sm:gap-4">
      <div className="flex justify-between w-full ">
        {/*  PARTIE FILTRAGE */}
        <div className="flex justify-between h-10 gap-2 sm:gap-4">
          {selectedCount > 0 ? (
            <DeleteSelectedCount
              selectedCount={selectedCount}
              onClose={setRowSelection}
              onDelete={setShowDeleteAlert}
            />
          ) : (
            <>
              <div className="relative h-full w-60 sm:w-72">
                <Input
                  placeholder="Rechercher un enseignant..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className=" pr-8"
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
              {/*  Button filtre */}
              <Button
                variant={
                  showFilters || hasActiveFilters ? 'secondary' : 'outline'
                }
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 h-full cursor-pointer"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:block ">Filtres</span>
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                )}
              </Button>
            </>
          )}
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="gap-3 w-14 sm:w-30 h-full md:w-60 bg-linear-to-tr from-primary to-chart-2"
        >
          <Plus className="h-8 w-8" />
          <span className="hidden sm:block font-poppins font-semibold">
            Ajouter
          </span>
        </Button>
        <StudentDialog open={open} setOpen={setOpen} />
      </div>
      {showFilters && !selectedCount && <StudentFilter />}
    </div>
  );
}
