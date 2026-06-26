import { Button } from '@/components/animate-ui/components/buttons/button';
import { Plus } from 'lucide-react';
import { useClassTable } from './table-provider';
import { DeleteSelectedCount } from '@/components/school/delete-selected-count';
import DataHeaderInput from '@/components/school/data-filters';
import { AppAlertDialog } from '@/components/app-alert-dialog';
import * as React from 'react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ClassTableFilter from './class-table-filter';
import ClassDialog from '@/components/school/class/table/class-dialog';

const CLASSES_COLUMN = [
  {
    id: 'name',
    label: 'Classe',
  },
  {
    id: 'level',
    label: 'Niveau',
  },
  {
    id: 'section',
    label: 'Section',
  },
  {
    id: 'supervisor',
    label: 'Prof. Principal',
  },
  {
    id: 'students',
    label: 'Élèves',
  },
  {
    id: 'subjects',
    label: 'Matières',
  },
  {
    id: 'teachers',
    label: 'Professeurs',
  },
];

export default function DataTableHeader() {
  const {
    searchTerm,
    setSearchTerm,
    setColumnVisibility,
    columnVisibility,
    filters,
    setRowSelection,
    rowSelection,
  } = useClassTable();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.keys(filters).some((v) => v !== undefined);
  const selectedCount = Object.values(rowSelection).length;

  const isPending = false;
  const toggleColumns = (columnId: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: isVisible,
    }));
  };

  function handleDelete() {}

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col w-full">
        {/* PARTIE FILTRAGE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {selectedCount > 0 ? (
            <DeleteSelectedCount
              selectedCount={selectedCount}
              onDelete={() => setShowDeleteAlert(true)}
              onClose={() => setRowSelection({})}
            />
          ) : (
            <>
              <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
                <DataHeaderInput
                  inputPlaceholder="Rechercher un élève..."
                  onShowFilterChange={setShowFilters}
                  hasActiveFilters={hasActiveFilters}
                  search={searchTerm}
                  showFilters={showFilters}
                  onSearchChange={setSearchTerm}
                  onToggleColumn={toggleColumns}
                  columns={CLASSES_COLUMN}
                  columnVisibility={columnVisibility}
                />

                {/* Bouton Ajouter  */}
                <Button
                  hoverScale={0.95}
                  tapScale={0.9}
                  onClick={() => setOpen(true)}
                  className="w-full cursor-pointer sm:w-auto lg:w-auto gap-1.5 sm:gap-2 h-10 bg-linear-to-tr from-primary to-primary/50 hover:from-primary/90 hover:to-primary lg:ml-auto"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="sm:hidden">Ajouter</span>
                  <span className="hidden sm:inline font-medium">
                    Ajouter une Classe
                  </span>
                </Button>
              </div>
              <ClassDialog open={open} onOpenChange={setOpen} />
            </>
          )}
        </div>

        {/* Filtres étendus */}
        {showFilters && !selectedCount && (
          <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
            <ClassTableFilter />
          </div>
        )}

        <AppAlertDialog
          open={showDeleteAlert}
          onOpenChange={setShowDeleteAlert}
          title={`Supprimer ${selectedCount} élève(s) ?`}
          description="Cette action archivera les élèves sélectionnés. Ils ne pourront plus accéder à la plateforme."
          onConfirm={handleDelete}
          isLoading={isPending}
          confirmLabel="Supprimer"
          variant="destructive"
        />
      </div>
    </div>
  );
}
