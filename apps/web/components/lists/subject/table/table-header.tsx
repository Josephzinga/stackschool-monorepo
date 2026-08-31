import { DeleteSelectedCount } from '@/components/lists/delete-selected-count';
import DataHeaderInput from '@/components/lists/data-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import { useSubjectTable } from '@/components/lists/subject/table/table-provider';
import * as React from 'react';
import { useState } from 'react';
import { SubjectFilter } from '@/components/lists/subject/table/subject-filter';
import CreateSubjectDialog from '@/components/lists/subject/table/create-subject-dialog';

const SUBJECT_COLUMN = [
  { id: 'name', label: 'Matière' },
  { id: 'className', label: 'Classe' },
  { id: 'teacher', label: 'Professeur' },
  { id: 'coefficient', label: 'Coéff' },
  { id: 'weeklyHours', label: 'H/sem' },
];

export default function TableHeader() {
  const {
    searchTerm,
    setSearchTerm,
    setFilters,
    rowSelection,
    filters,
    columnVisibility,
    setColumnVisibility,
  } = useSubjectTable();

  const [showFilters, setShowFilters] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleColumn = (columnId: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);
  const selectedCount = Object.keys(rowSelection).length;
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col w-full">
        {/* PARTIE FILTRAGE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {0 > 0 ? (
            <DeleteSelectedCount selectedCount={0} />
          ) : (
            <>
              <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <DataHeaderInput
                  hasActiveFilters={hasActiveFilters}
                  inputPlaceholder="Rechercher une maitéres..."
                  showFilters={showFilters}
                  columns={SUBJECT_COLUMN}
                  columnVisibility={columnVisibility}
                  search={searchTerm}
                  onSearchChange={setSearchTerm}
                  onToggleColumn={toggleColumn}
                  onShowFilterChange={setShowFilters}
                />

                {/* Bouton Ajouter à droite sur lg */}
                <Button
                  onClick={() => setOpen(true)}
                  className="w-full sm:w-auto lg:w-auto gap-1.5 sm:gap-2 h-10 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary lg:ml-auto"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sm:hidden">Ajouter</span>
                  <span className="hidden sm:inline font-poppins font-semibold">
                    Ajouter une Matière
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
        {/* Filtres étendus */}
        {showFilters && !selectedCount && (
          <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <SubjectFilter />
          </div>
        )}
        {open && <CreateSubjectDialog open={open} onOpenChange={setOpen} />}
      </div>
    </div>
  );
}
